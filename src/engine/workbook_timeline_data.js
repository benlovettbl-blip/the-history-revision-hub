/**
 * Master Workbook Timeline Registry
 * 
 * 100% synchronized canonical workbook timeline missions and centrefold milestone data.
 * Extracted directly from official pupil workbook renderers and component specifications.
 * Covers all units with pupil workbooks and physical centrefolds.
 */

export const WORKBOOK_TIMELINE_DATA = {
  "medieval_england": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestone 1 (1066)",
      "date": "1066",
      "title": "The Battle of Hastings & Norman Conquest",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Following victory over Vikings at Stamford Bridge, Harold’s exhausted army forms a shield wall atop Senlac Hill; Norman cavalry feigned retreats shatter the line, Harold is killed, and Duke William seizes the crown.",
      "sketchPrompt": "Saxon shield wall atop Senlac Hill vs charging Norman cavalry",
      "sketchIdeas": [
        "🛡️ Saxon locked shield wall",
        "🐎 Charging Norman heavy cavalry",
        "🏹 Norman archers & Senlac Hill"
      ],
      "conceptTitle": "Hastings Conquest",
      "branches": [
        {
          "label": "Causal Factor 1",
          "value": "Stamford Bridge exhaustion (200-mile march)"
        },
        {
          "label": "Causal Factor 2",
          "value": "Senlac Hill locked shield wall"
        },
        {
          "label": "Tactical Pivot",
          "value": "Feigned retreat cavalry deception"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 2 & 3 (1069–1086)",
      "date": "1069–1086",
      "title": "Norman Subjugation & Domesday Survey",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "William crushes Anglo-Saxon resistance by systematically burning crops, salting fields, and slaughtering livestock across Yorkshire, starving over 100,000 people while erecting 500 timber motte castles and commissioning the exhaustive Domesday tax audit.",
      "sketchPrompt": "Motte castle overlooking salted Yorkshire fields, or Domesday ledger before Portchester keep",
      "sketchIdeas": [
        "🏰 Motte-and-bailey timber castle",
        "🔥 Harrying scorched-earth famine",
        "📖 Domesday royal tax audit ledger"
      ],
      "conceptTitle": "Norman Subjugation",
      "branches": [
        {
          "label": "State Terror",
          "value": "Harrying of the North (100,000 starved)"
        },
        {
          "label": "Military Dominance",
          "value": "500 motte-and-bailey castles blitz"
        },
        {
          "label": "Administrative Grip",
          "value": "1086 Domesday Book exhaustive tax audit"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 4 (1170)",
      "date": "1170",
      "title": "Crown vs Church: The Becket Crisis",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Following a bitter clash over whether royal courts or church courts could try criminal priests, four of Henry II’s knights butcher Archbishop Becket on the cathedral altar steps; Becket’s shrine becomes Christendom’s greatest pilgrimage.",
      "sketchPrompt": "Archbishop Becket confronting four armed Norman knights before Canterbury altar steps",
      "sketchIdeas": [
        "⛪ Canterbury cathedral arch",
        "🗡️ Four drawn Norman swords",
        "🕊️ Archbishop martyr cross"
      ],
      "conceptTitle": "Church vs Crown",
      "branches": [
        {
          "label": "Legal Friction",
          "value": "1164 Constitutions of Clarendon"
        },
        {
          "label": "Clerical Immunity",
          "value": "Criminous clerks double jurisdiction"
        },
        {
          "label": "Altar Regicide",
          "value": "29 Dec 1170 Becket martyrdom at Canterbury"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 5 & 6 (1215–1265)",
      "date": "1215–1265",
      "title": "Magna Carta & Simon de Montfort’s Parliament",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Bankrupted by military defeat at Bouvines, King John is forced by rebel barons at Runnymede to seal Magna Carta; Clause 39 guarantees that no free man can be imprisoned without lawful trial, leading to Simon de Montfort summoning the first elected Commons.",
      "sketchPrompt": "King John sealing Magna Carta at Runnymede, or elected burgesses gathering at Westminster",
      "sketchIdeas": [
        "📜 Magna Carta wax seal",
        "🛡️ Armed rebel baronial coalition",
        "🏛️ de Montfort 1265 Parliament"
      ],
      "conceptTitle": "Crown vs Barons",
      "branches": [
        {
          "label": "Fiscal Crisis",
          "value": "Loss of Normandy & Bouvines disaster"
        },
        {
          "label": "Charter Rights",
          "value": "1215 Runnymede Clause 39 lawful trial rights"
        },
        {
          "label": "Parliamentary Seed",
          "value": "1265 Simon de Montfort elected Commons"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1348–1381)",
      "date": "1348–1381",
      "title": "The Black Death & The Peasants’ Revolt",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "The Black Death eliminates up to 50% of England’s population, creating severe agricultural labour shortages; when lords attempt to cap wages with the Statute of Labourers, peasants march on London under Wat Tyler demanding an end to serfdom.",
      "sketchPrompt": "Plague cottage marked with red cross, or young Richard II facing Wat Tyler at Smithfield",
      "sketchIdeas": [
        "💀 Black Death 50% mortality",
        "🌾 Peasant wage & freedom demands",
        "🚩 1381 Peasants’ Revolt march"
      ],
      "conceptTitle": "Crisis of Feudalism",
      "branches": [
        {
          "label": "Demographic Shock",
          "value": "1348 Black Death catastrophic mortality"
        },
        {
          "label": "Wage Capping",
          "value": "1351 Statute of Labourers repression"
        },
        {
          "label": "Armed Insurrection",
          "value": "1381 Poll Tax rebellion & march on London"
        }
      ]
    }
  ],
  "monarchy_religion_power": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 2 (1517–1540)",
      "date": "1517–1540",
      "title": "The Reformation & Royal Supremacy",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Martin Luther sparks the European Reformation against church corruption; King Henry VIII breaks with Rome over his annulment, declaring himself Supreme Head of the Church of England and dissolving 800 monasteries.",
      "sketchPrompt": "Luther nailing 95 Theses to Wittenberg door, or Henry VIII severing papal ties while Cromwell melts abbey lead",
      "sketchIdeas": [
        "🔨 Luther’s reform hammer",
        "📜 95 Theses nailed to door",
        "✂️ Royal shears severing Rome",
        "🛒 Melted abbey lead"
      ],
      "conceptTitle": "Reformation & Royal Supremacy",
      "branches": [
        {
          "label": "Indulgence Protest",
          "value": "Corrupt indulgence trade & 95 Theses"
        },
        {
          "label": "Royal Supremacy",
          "value": "1534 Act of Supremacy (King is Supreme Head)"
        },
        {
          "label": "Monastic Wealth",
          "value": "Dissolution of 800 monasteries"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 3 (1559)",
      "date": "1559",
      "title": "The Elizabethan Religious Settlement (Via Media)",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Queen Elizabeth I navigates between Catholic traditionalists and radical Puritans, establishing the Middle Way: English Protestant liturgy with moderate traditional ceremonies, enforced through the Act of Uniformity and recusancy fines.",
      "sketchPrompt": "Queen Elizabeth balancing on a tightrope labelled ‘Via Media’, holding English Bible and crucifix",
      "sketchIdeas": [
        "🎪 Tightrope walker over religious abyss",
        "📖 English Book of Common Prayer",
        "✝️ Traditional ceremonial crucifix"
      ],
      "conceptTitle": "Elizabethan Middle Way",
      "branches": [
        {
          "label": "Royal Compromise",
          "value": "1559 Act of Supremacy (Supreme Governor)"
        },
        {
          "label": "Uniform Worship",
          "value": "1559 Book of Common Prayer"
        },
        {
          "label": "Financial Penalty",
          "value": "1-shilling weekly recusancy fines"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 4 (1588)",
      "date": "1588",
      "title": "The Defeat of the Spanish Armada",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Philip II dispatches 130 warships to invade England; English commanders launch eight blazing fireships into the Spanish crescent at Calais at midnight, scattering the Armada before storms drive the galleons into shipwreck.",
      "sketchPrompt": "Eight blazing English fireships crashing into anchored Spanish Armada at Calais at midnight",
      "sketchIdeas": [
        "🔥 Eight blazing fireships",
        "⚓ Severed anchor cables",
        "⛵ Scattering Spanish galleons"
      ],
      "conceptTitle": "Defeat of the Armada",
      "branches": [
        {
          "label": "Midnight Panic",
          "value": "Calais Roads fireship attack"
        },
        {
          "label": "Gunnery Standoff",
          "value": "Battle of Gravelines close-range broadsides"
        },
        {
          "label": "Providential Storms",
          "value": "Protestant Wind shipwrecks in Scotland & Ireland"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 5 & 6 (1629–1649)",
      "date": "1629–1649",
      "title": "Personal Rule, Civil War & Regicide",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Charles I rules without Parliament for eleven years, extracting illegal Ship Money taxes; escalating clashes spark the English Civil War, culminating in the victory of Cromwell’s New Model Army and the public execution of the King.",
      "sketchPrompt": "Royal sheriff demanding Ship Money in an inland field, or executioner’s chopping block outside Whitehall",
      "sketchIdeas": [
        "💰 Inland Ship Money tax collection",
        "🪓 Executioner’s chopping block",
        "👑 Fallen crown on black scaffold"
      ],
      "conceptTitle": "Road to Regicide",
      "branches": [
        {
          "label": "Personal Rule",
          "value": "11 Years Personal Rule (1629–1640)"
        },
        {
          "label": "Civil War Decider",
          "value": "New Model Army victory at Naseby (1645)"
        },
        {
          "label": "Public Regicide",
          "value": "30 Jan 1649 Charles I beheading at Whitehall"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1688–1689)",
      "date": "1688–1689",
      "title": "The Glorious Revolution & The Bill of Rights",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Fearing a permanent Catholic dynasty under James II, Parliament invites William of Orange to invade; James flees, and Parliament establishes constitutional monarchy by making William and Mary sign the 1689 Bill of Rights.",
      "sketchPrompt": "James II throwing the Great Seal into the foggy Thames, or Parliament presenting clipped crown to William and Mary",
      "sketchIdeas": [
        "🚣 Rowboat in nighttime Thames fog",
        "🌊 Sinking Great Seal in river",
        "📜 1689 Bill of Rights contract"
      ],
      "conceptTitle": "Constitutional Monarchy",
      "branches": [
        {
          "label": "Dynastic Panic",
          "value": "Birth of James II’s Catholic heir (1688)"
        },
        {
          "label": "Dutch Landing",
          "value": "William of Orange invasion at Torbay"
        },
        {
          "label": "Crown Constraints",
          "value": "1689 Bill of Rights (Parliamentary supremacy)"
        }
      ]
    }
  ],
  "great_war_part2": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestone 1 (August 1914)",
      "date": "August 1914",
      "title": "Recruitment & Voluntary Mobilisation",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Lord Kitchener issues his iconic recruiting appeal, drawing over 750,000 volunteers in eight weeks as young men enlist in local Pals Battalions amid patriotic fervor and social pressure.",
      "sketchPrompt": "Lord Kitchener pointing finger and voluntary recruitment queues outside town halls",
      "sketchIdeas": [
        "👉 Kitchener pointing finger",
        "📜 Enlistment papers & King’s Shilling",
        "🚶‍♂️ Civic queue of volunteers"
      ],
      "conceptTitle": "Voluntary Mobilisation",
      "branches": [
        {
          "label": "Recruitment Wave",
          "value": "750,000 recruits in first 8 weeks"
        },
        {
          "label": "Civic Bonds",
          "value": "Pals Battalions (e.g. Pompey Pals)"
        },
        {
          "label": "Social Coercion",
          "value": "White feather shaming & peer pressure"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 3 & 4 (1916)",
      "date": "1916",
      "title": "The Battle of the Somme & Armoured Warfare",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "On 1 July 1916, the British Army suffers 57,470 casualties on the worst day in its history after artillery fails to destroy German deep dugouts; in September, tanks make their world debut at Flers-Courcelette.",
      "sketchPrompt": "German Maxim machine-gun redoubt firing across uncut wire, or rhomboid Mark I tank crushing trenches",
      "sketchIdeas": [
        "🧱 Concrete bunker & uncut wire",
        "⚙️ Spandau Maxim machine gun",
        "🚜 Rhomboid Mark I British tank"
      ],
      "conceptTitle": "Somme & Armoured Breakthrough",
      "branches": [
        {
          "label": "Opening Bloodbath",
          "value": "1 July 1916: 57,470 British casualties"
        },
        {
          "label": "Bombardment Failure",
          "value": "Artillery failed to cut barbed wire or shelters"
        },
        {
          "label": "Armoured Innovation",
          "value": "Sept 1916 first tank deployment at Flers"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestones 2 & 6 (1915 & 1917–18)",
      "date": "1915 & 1917–18",
      "title": "Empire Contribution & Global Mobilisation",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Over four million non-white and Dominion soldiers serve the British Empire, including 1.5 million Indian troops fighting in Flanders and Mesopotamia, while ANZAC forces forge national identity on the cliffs of Gallipoli.",
      "sketchPrompt": "Indian cavalry and ANZAC troops landing on steep cliffs under fire, or troopships crossing oceans with Victoria Cross",
      "sketchIdeas": [
        "🌊 Wooden landing craft under fire",
        "⛰️ Gallipoli steep coastal cliffs",
        "👳‍♂️ Indian turban & slouch hat",
        "🏅 Victoria Cross medal"
      ],
      "conceptTitle": "Global Empire Mobilisation",
      "branches": [
        {
          "label": "Indian Army Service",
          "value": "1.5 million soldiers in Europe & Middle East"
        },
        {
          "label": "ANZAC Sacrifice",
          "value": "Gallipoli forge of Australian/NZ nationhood"
        },
        {
          "label": "Global Logistical Edge",
          "value": "4 million non-white troops & Chinese Labour Corps"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 5 (1916–1917)",
      "date": "1916–1917",
      "title": "The Home Front & Total War",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Total war transforms civilian life: Parliament introduces conscription in 1916, one million female munitions workers produce 80% of British shells, and German submarine blockades force nationwide food rationing.",
      "sketchPrompt": "‘Canary Girls’ loading heavy artillery shells beside a queue holding ration books",
      "sketchIdeas": [
        "🏭 Munitions factory smokestacks",
        "💣 Heavy artillery shell (Canary workers)",
        "🎫 Civilian wartime ration book"
      ],
      "conceptTitle": "Home Front & Total War",
      "branches": [
        {
          "label": "Compulsory Service",
          "value": "1916 Military Service Act conscription"
        },
        {
          "label": "Munitions Labour",
          "value": "1 million women producing 80% of shells"
        },
        {
          "label": "U-Boat Blockade",
          "value": "German submarine warfare & food rationing"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1918 & 1919)",
      "date": "1918 & 1919",
      "title": "The Armistice & The Treaty of Versailles",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Allied combined arms break the Hindenburg Line, forcing Germany to sign the Armistice at 11:00 am on 11 November 1918; the 1919 Treaty of Versailles imposes Article 231 War Guilt and £6.6 billion reparations.",
      "sketchPrompt": "Foch’s railway carriage at 11:00 am, or signing the treaty under arched mirrors in the Hall of Mirrors",
      "sketchIdeas": [
        "🚂 Compiègne railway carriage",
        "⏰ 11:00 am Armistice clock",
        "🏛️ Versailles Hall of Mirrors",
        "📜 Article 231 War Guilt clause"
      ],
      "conceptTitle": "Armistice & Versailles",
      "branches": [
        {
          "label": "Combined Arms Breakthrough",
          "value": "Hundred Days Offensive & Hindenburg Line"
        },
        {
          "label": "War Guilt Stigma",
          "value": "Article 231 assigning total moral blame"
        },
        {
          "label": "Economic Sanctions",
          "value": "£6.6 billion reparations & 13% territory loss"
        }
      ]
    }
  ],
  "australia": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 2 (1770–1788)",
      "date": "1770–1788",
      "title": "Cook’s Voyage & The First Fleet Invasion",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "James Cook charts Botany Bay in 1770, claiming the continent under the legal fiction of terra nullius; in 1788, the First Fleet lands 11 ships carrying over 700 convicts to found Sydney penal colony.",
      "sketchPrompt": "Ship anchor crossed with Aboriginal hardwood shield / Union Jack beside convict leg-shackles",
      "sketchIdeas": [
        "⚓ Ship anchor & hardwood shield",
        "🇬🇧 Union Jack flag planted",
        "⛓️ Convict iron leg-shackles"
      ],
      "conceptTitle": "Imperial Invasion",
      "branches": [
        {
          "label": "Maritime Voyage",
          "value": "Cook & Tupaia 1770 voyage on Endeavour"
        },
        {
          "label": "Penal Colony",
          "value": "1788 First Fleet arrival at Sydney Cove"
        },
        {
          "label": "Legal Fiction",
          "value": "Terra nullius doctrine of uninhabited land"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 3 (1789)",
      "date": "1789",
      "title": "The Gal-Galla Smallpox Epidemic",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "In April 1789, a catastrophic smallpox epidemic (gal-galla) sweeps through the Eora clans around Sydney Harbour, killing 50–70% of the Indigenous population and shattering ancient oral kinship structures.",
      "sketchPrompt": "Empty bark canoe drifting on water beneath a weeping eucalyptus branch",
      "sketchIdeas": [
        "🛶 Empty bark canoe drifting",
        "🌿 Weeping eucalyptus branches",
        "💀 Deserted coastal beach camps"
      ],
      "conceptTitle": "Biological Catastrophe",
      "branches": [
        {
          "label": "Epidemic Outbreak",
          "value": "April 1789 gal-galla smallpox virus"
        },
        {
          "label": "Catastrophic Loss",
          "value": "50% to 70% Eora population mortality"
        },
        {
          "label": "Oral Trauma",
          "value": "Loss of songline elders & kinship links"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 4 (1797)",
      "date": "1797",
      "title": "Pemulwuy’s Bidjigal Frontier Resistance",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Bidjigal warrior Pemulwuy leads a twelve-year guerrilla resistance campaign against British pastoral expansion, burning colonial crops and leading 100 warriors in the armed 1797 Battle of Parramatta.",
      "sketchPrompt": "Barbed hunting spear crossed with a burning colonial wheat sheaf and shield",
      "sketchIdeas": [
        "🗡️ Barbed hardwood hunting spear",
        "🔥 Burning colonial wheat sheaf",
        "🛡️ Ochre-painted warrior shield"
      ],
      "conceptTitle": "Pemulwuy’s Resistance",
      "branches": [
        {
          "label": "Guerrilla Campaign",
          "value": "Bidjigal 12-year resistance campaign"
        },
        {
          "label": "Pastoral Sabotage",
          "value": "Burning crops & driving off livestock"
        },
        {
          "label": "Armed Stand",
          "value": "1797 Battle of Parramatta confrontation"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 5 & 6 (1828–1838)",
      "date": "1828–1838",
      "title": "The Black War & The Myall Creek Massacre",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Governor Arthur declares martial law in Van Diemen’s Land during the Black War; in 1838, eleven stockmen slaughter 28 unarmed Indigenous people at Myall Creek, leading to seven perpetrators being hanged.",
      "sketchPrompt": "Proclamation board pinned to gum tree / magistrate’s gavel on tethering rope",
      "sketchIdeas": [
        "📜 Proclamation board on gum tree",
        "⚖️ Royal judicial gavel & noose",
        "🐎 Stockmen riders with tethering rope"
      ],
      "conceptTitle": "Frontier Warfare",
      "branches": [
        {
          "label": "Van Diemen’s Land Conflict",
          "value": "1828 Martial Law & 1830 Black Line"
        },
        {
          "label": "Myall Creek Atrocity",
          "value": "1838 massacre of 28 unarmed Wirrayaraay"
        },
        {
          "label": "Judicial Precedent",
          "value": "First execution of white stockmen for murder"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1851–1854)",
      "date": "1851–1854",
      "title": "The Gold Rush & The Eureka Stockade",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Gold discoveries in Ballarat draw 500,000 migrants to Victoria; oppressive 30-shilling monthly licence taxes provoke diggers to swear allegiance to the Southern Cross and fight the 1854 Eureka Stockade uprising.",
      "sketchPrompt": "Miner’s pickaxe crossed with gold wash pan / Eureka Southern Cross flag flying over wooden stockade",
      "sketchIdeas": [
        "⛏️ Crossed miner’s pickaxes",
        "🪙 Gold wash pan with nuggets",
        "⭐ Eureka Southern Cross blue flag",
        "🪵 Wooden defensive stockade"
      ],
      "conceptTitle": "Gold & Democracy",
      "branches": [
        {
          "label": "Demographic Boom",
          "value": "1851 Ballarat rush & 500,000 diggers"
        },
        {
          "label": "Licence Tax Hunt",
          "value": "Oppressive 30-shilling monthly fee"
        },
        {
          "label": "Democratic Spark",
          "value": "1854 Eureka Stockade & secret ballot"
        }
      ]
    }
  ],
  "second_british_empire": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1, 5 & 7 (1805–1889)",
      "date": "1805–1889",
      "title": "Pax Britannica & Naval Supremacy",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Following Trafalgar, Portsmouth Royal Dockyard becomes the industrial beating heart of empire, constructing ironclad steam warships like HMS Warrior to enforce global Pax Britannica under the Two-Power Standard.",
      "sketchPrompt": "HMS Warrior ironclad steam battleship with black smokestack, or Portsmouth dockyard smiths forging anchor chains",
      "sketchIdeas": [
        "🚢 iron battleship",
        "🛡️ iron armour",
        "🏭 dockyard block mill"
      ],
      "conceptTitle": "Pax Britannica & Naval Power",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Portsmouth Royal Dockyard factory base"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1860 HMS Warrior ironclad revolution"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1889 Two-Power Standard"
        }
      ],
      "fullMissionText": "Milestones 1, 5 & 7 (1805–1889): Choose (A) Creative Sketch: HMS Warrior ironclad steam battleship with black smokestack, or Portsmouth dockyard smiths forging anchor chains [🚢 iron battleship • 🛡️ iron armour • 🏭 dockyard block mill] • OR • (B) Mind Map: \"Pax Britannica & Naval Power\" (Portsmouth Royal Dockyard factory base, 1860 HMS Warrior ironclad revolution, 1889 Two-Power Standard)"
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 2 (1813–1834)",
      "date": "1813–1834",
      "title": "De-industrialisation of India & Textiles",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Colonial tariffs and industrial steam mills collapse India’s share of global textiles from 25% to under 2%, reducing proud Dhaka muslin weavers to destitution as Britain floods the subcontinent with Lancashire cotton.",
      "sketchPrompt": "Bengali pit-loom artisan weaving muslin beside British merchant ships dumping factory cotton crates",
      "sketchIdeas": [
        "🧵 wooden loom",
        "📜 fine muslin",
        "📦 factory bales"
      ],
      "conceptTitle": "De-industrialisation of India",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "25% pre-colonial world textile share"
        },
        {
          "label": "Core Mechanism 2",
          "value": "British protective Calico tariffs"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1834 Bentinck report on weavers bleaching plains"
        }
      ],
      "fullMissionText": "Milestone 2 (1813–1834): Choose (A) Creative Sketch: Bengali pit-loom artisan weaving muslin beside British merchant ships dumping factory cotton crates [🧵 wooden loom • 📜 fine muslin • 📦 factory bales] • OR • (B) Mind Map: \"De-industrialisation of India\" (25% pre-colonial world textile share, British protective Calico tariffs, 1834 Bentinck report on weavers bleaching plains)"
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestones 3 & 4 (1857–1858)",
      "date": "1857–1858",
      "title": "The 1857 Indian Rebellion & British Raj",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Enfield rifle cartridges greased with cow and pig fat trigger a massive military insurrection across northern India; Rani Lakshmibai leads the defense of Jhansi before Britain dissolves the East India Company to establish direct Crown rule.",
      "sketchPrompt": "Sepoy refusing to bite the greased cartridge, or Rani Lakshmibai on horseback with curved talwar sword",
      "sketchIdeas": [
        "🔫 Enfield cartridge",
        "🐎 galloping horse",
        "🗡️ curved talwar"
      ],
      "conceptTitle": "1857 Rebellion & The British Raj",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Enfield cow/pig fat crisis"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Rani Lakshmibai at Jhansi/Gwalior"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1858 Government of India Act dissolving Company"
        }
      ],
      "fullMissionText": "Milestones 3 & 4 (1857–1858): Choose (A) Creative Sketch: Sepoy refusing to bite the greased cartridge, or Rani Lakshmibai on horseback with curved talwar sword [🔫 Enfield cartridge • 🐎 galloping horse • 🗡️ curved talwar] • OR • (B) Mind Map: \"1857 Rebellion & The British Raj\" (Enfield cow/pig fat crisis, Rani Lakshmibai at Jhansi/Gwalior, 1858 Government of India Act dissolving Company)"
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 6 & 8 (1884 & 1898)",
      "date": "1884 & 1898",
      "title": "The Scramble for Africa & Maxim Guns",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "European imperial powers meet at the 1884 Berlin Conference to partition Africa under \"effective occupation\"; Hiram Maxim’s automatic machine gun gives small colonial forces overwhelming military lethality across the continent.",
      "sketchPrompt": "European diplomats around a table carving up a cake labelled \"Afrique\", or Maxim gun crew at Omdurman",
      "sketchIdeas": [
        "🎂 cake labelled Africa",
        "🗡️ carving knife",
        "🔫 Maxim gun"
      ],
      "conceptTitle": "Scramble for Africa",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1884–85 Berlin Conference Effective Occupation"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Maxim gun & quinine military edge"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Morel \"Black Man’s Burden\" resource theft"
        }
      ],
      "fullMissionText": "Milestones 6 & 8 (1884 & 1898): Choose (A) Creative Sketch: European diplomats around a table carving up a cake labelled \"Afrique\", or Maxim gun crew at Omdurman [🎂 cake labelled Africa • 🗡️ carving knife • 🔫 Maxim gun] • OR • (B) Mind Map: \"Scramble for Africa\" (1884–85 Berlin Conference Effective Occupation, Maxim gun & quinine military edge, Morel \"Black Man’s Burden\" resource theft)"
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestone 8 & Imperial Verdict (1851–1901)",
      "date": "1851–1901",
      "title": "The Workshop of the World & Naoroji’s Drain of Wealth",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "The 1851 Great Exhibition showcases Britain as the manufacturing titan of the globe, while Dadabhai Naoroji proves that colonial rule drains £20–30 million annually out of India, triggering devastating famines.",
      "sketchPrompt": "Crystal Palace barrel-vault glass roof with Koh-i-Noor diamond, or Dadabhai Naoroji presenting drain of wealth ledgers",
      "sketchIdeas": [
        "🏛️ Crystal Palace",
        "💎 Koh-i-Noor",
        "📜 economic ledger"
      ],
      "conceptTitle": "Workshop vs Exploitation",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1851 Crystal Palace industrial supremacy"
        },
        {
          "label": "Core Mechanism 2",
          "value": "25,000 miles colonial railways"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Naoroji Drain of Wealth & Victorian famines"
        }
      ],
      "fullMissionText": "Milestone 8 & Imperial Verdict (1851–1901): Choose (A) Creative Sketch: Crystal Palace barrel-vault glass roof with Koh-i-Noor diamond, or Dadabhai Naoroji presenting drain of wealth ledgers [🏛️ Crystal Palace • 💎 Koh-i-Noor • 📜 economic ledger] • OR • (B) Mind Map: \"Workshop vs Exploitation\" (1851 Crystal Palace industrial supremacy, 25,000 miles colonial railways, Naoroji Drain of Wealth & Victorian famines)"
    }
  ],
  "the_shoah": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestone 1 (c. 1933)",
      "date": "c. 1933",
      "title": "Jewish Life Before the War & Cultural Heritage",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Across Europe, over nine million Jewish individuals live vibrant lives rooted in profound religious traditions, thriving Yiddish and Ladino secular culture, and proud civic and patriotic service.",
      "sketchPrompt": "Draw a vibrant scene of pre-war life — e.g. an open book glowing with Yiddish words, a bustling town market, or a German WWI Iron Cross medal showing proud patriotism",
      "sketchIdeas": [],
      "conceptTitle": "Pre-War Life",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "9.5M Jews"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Yiddish culture"
        },
        {
          "label": "Core Mechanism 3",
          "value": "WWI service"
        }
      ],
      "fullMissionText": "Milestone 1 (c. 1933): Choose (A) Creative Sketch: Draw a vibrant scene of pre-war life — e.g. an open book glowing with Yiddish words, a bustling town market, or a German WWI Iron Cross medal showing proud patriotism • OR • (B) Mind Map: \"Pre-War Life\" (9.5M Jews, Yiddish culture, WWI service)"
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 2 & 3 (1933–1938)",
      "date": "1933–1938",
      "title": "The Escalation of Persecution & Nuremberg Laws",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Nazi legislation systematically strips German Jews of their citizenship, civil rights, and livelihoods through the 1933 economic boycott, 1935 Nuremberg Laws, and the violent state-sponsored terror of Kristallnacht.",
      "sketchPrompt": "Draw a powerful image of rights being destroyed — e.g. the scales of justice tilting and cracking under a swastika, or a shop window shattered into jagged shards reflecting a burning synagogue",
      "sketchIdeas": [],
      "conceptTitle": "Nazi Persecution",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Boycott"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Nuremberg Laws"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Kristallnacht"
        }
      ],
      "fullMissionText": "Milestones 2 & 3 (1933–1938): Choose (A) Creative Sketch: Draw a powerful image of rights being destroyed — e.g. the scales of justice tilting and cracking under a swastika, or a shop window shattered into jagged shards reflecting a burning synagogue • OR • (B) Mind Map: \"Nazi Persecution\" (Boycott, Nuremberg Laws, Kristallnacht)"
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestones 4 & 5 (1939–1942)",
      "date": "1939–1942",
      "title": "Ghettos, Starvation & Clandestine Defiance",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Nazi authorities force hundreds of thousands of Jews into walled, overcrowded urban ghettos like Warsaw, where victims endure deliberate starvation while maintaining secret archives like Emanuel Ringelblum’s Oneg Shabbat.",
      "sketchPrompt": "Illustrate life and defiance behind the walls — e.g. a child smuggling a loaf of bread through a hole in a 10ft brick wall, or a sealed metal milk can buried beneath cobblestones hiding secret diaries",
      "sketchIdeas": [],
      "conceptTitle": "The Warsaw Ghetto",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Walls"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Starvation"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Oneg Shabbat"
        }
      ],
      "fullMissionText": "Milestones 4 & 5 (1939–1942): Choose (A) Creative Sketch: Illustrate life and defiance behind the walls — e.g. a child smuggling a loaf of bread through a hole in a 10ft brick wall, or a sealed metal milk can buried beneath cobblestones hiding secret diaries • OR • (B) Mind Map: \"The Warsaw Ghetto\" (Walls, Starvation, Oneg Shabbat)"
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 6 (1941)",
      "date": "1941",
      "title": "The Holocaust by Bullets & Einsatzgruppen",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Following the 1941 invasion of the Soviet Union, four mobile killing squads (Einsatzgruppen) and local auxiliaries shoot over 1.5 million Jewish men, women, and children into ravines and mass graves like Babi Yar.",
      "sketchPrompt": "Depict the brutal turning point of 1941 — e.g. a lightning-bolt invasion arrow cutting across the Soviet border, or a single memorial candle burning at the edge of the dark Babi Yar ravine",
      "sketchIdeas": [],
      "conceptTitle": "Holocaust by Bullets",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Barbarossa"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Einsatzgruppen"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Babi Yar"
        }
      ],
      "fullMissionText": "Milestone 6 (1941): Choose (A) Creative Sketch: Depict the brutal turning point of 1941 — e.g. a lightning-bolt invasion arrow cutting across the Soviet border, or a single memorial candle burning at the edge of the dark Babi Yar ravine • OR • (B) Mind Map: \"Holocaust by Bullets\" (Barbarossa, Einsatzgruppen, Babi Yar)"
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1942–1944)",
      "date": "1942–1944",
      "title": "Industrial Annihilation & Camp Resistance",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "At the 1942 Wannsee Conference, the Nazi regime coordinates the industrial transport of millions to dedicated extermination camps; victims maintain clandestine resistance, culminating in the 1943 Warsaw Ghetto Uprising and camp revolts.",
      "sketchPrompt": "Capture industrial terror or defiant resistance — e.g. railway tracks narrowing into the ominous archway of Birkenau, or a raised fist breaking through barbed wire clutching a secret resistance leaflet",
      "sketchIdeas": [],
      "conceptTitle": "Death Camps & Resistance",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Wannsee"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Treblinka"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Warsaw Uprising"
        }
      ],
      "fullMissionText": "Milestones 7 & 8 (1942–1944): Choose (A) Creative Sketch: Capture industrial terror or defiant resistance — e.g. railway tracks narrowing into the ominous archway of Birkenau, or a raised fist breaking through barbed wire clutching a secret resistance leaflet • OR • (B) Mind Map: \"Death Camps & Resistance\" (Wannsee, Treblinka, Warsaw Uprising)"
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_6",
      "milestoneBadge": "Milestone 9 (1943)",
      "date": "1943",
      "title": "Rescue, Resistance & The Righteous Among the Nations",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Defying totalitarian terror, rescue networks and courageous individuals—from Danish fishermen smuggling 7,200 Jews to Sweden, to Chiune Sugihara stamping transit visas—risk their lives to save human beings.",
      "sketchPrompt": "Illustrate courage against the odds — e.g. a small wooden fishing boat sailing through dark waves under moonlight to Sweden, or an official passport stamped with a life-saving hand-written visa",
      "sketchIdeas": [],
      "conceptTitle": "Rescue & Resistance",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Danish boats"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Sugihara visas"
        },
        {
          "label": "Core Mechanism 3",
          "value": "White Rose"
        }
      ],
      "fullMissionText": "Milestone 9 (1943): Choose (A) Creative Sketch: Illustrate courage against the odds — e.g. a small wooden fishing boat sailing through dark waves under moonlight to Sweden, or an official passport stamped with a life-saving hand-written visa • OR • (B) Mind Map: \"Rescue & Resistance\" (Danish boats, Sugihara visas, White Rose)"
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_7",
      "milestoneBadge": "Milestone 10 (1945–1948)",
      "date": "1945–1948",
      "title": "Liberation, Displaced Persons & The Pursuit of Justice",
      "pageRef": "Workbook Centrefold • pp. 10–11",
      "desc": "Allied armies uncover unfathomable atrocities as they liberate Nazi camps; survivors rebuild shattered lives in Displaced Persons camps while the Nuremberg Trials establish individual criminal accountability for crimes against humanity.",
      "sketchPrompt": "Depict liberation and the pursuit of justice — e.g. a barbed-wire gate swung wide open toward a rising sun, or a judge’s wooden gavel striking down beside the words \"Never Again\"",
      "sketchIdeas": [],
      "conceptTitle": "Liberation & Justice",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Camp liberation"
        },
        {
          "label": "Core Mechanism 2",
          "value": "DP camps"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Nuremberg Trials"
        }
      ],
      "fullMissionText": "Milestone 10 (1945–1948): Choose (A) Creative Sketch: Depict liberation and the pursuit of justice — e.g. a barbed-wire gate swung wide open toward a rising sun, or a judge’s wooden gavel striking down beside the words \"Never Again\" • OR • (B) Mind Map: \"Liberation & Justice\" (Camp liberation, DP camps, Nuremberg Trials)"
    }
  ],
  "first_british_empire": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 4 (1600 & 1757)",
      "date": "1600 & 1757",
      "title": "The East India Company & The Diwani of Bengal",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Queen Elizabeth I charters the East India Company in 1600; following Robert Clive’s victory at Plassey in 1757, Emperor Shah Alam II grants the Company the Diwani, transforming a commercial merchant enterprise into a territorial tax-collecting empire.",
      "sketchPrompt": "East Indiaman merchant ship laden with spices, or Clive receiving the Diwani tax scroll from Shah Alam II",
      "sketchIdeas": [
        "⛵ merchant ship",
        "📜 royal charter",
        "👑 imperial throne",
        "📜 Diwani scroll"
      ],
      "conceptTitle": "EIC Corporate Expansion",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1600 Elizabeth I charter monopoly"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1757 Battle of Plassey"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1765 Diwani Bengal tax extraction"
        }
      ],
      "fullMissionText": "Milestones 1 & 4 (1600 & 1757): Choose (A) Creative Sketch: East Indiaman merchant ship laden with spices, or Clive receiving the Diwani tax scroll from Shah Alam II [⛵ merchant ship • 📜 royal charter • 👑 imperial throne • 📜 Diwani scroll] • OR • (B) Mind Map: \"EIC Corporate Expansion\" (1600 Elizabeth I charter monopoly, 1757 Battle of Plassey, 1765 Diwani Bengal tax extraction)"
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 2 (1672)",
      "date": "1672",
      "title": "The Royal African Company & The Middle Passage",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "King Charles II establishes the Royal African Company with a royal monopoly over the transatlantic trade in enslaved human beings, brutally forcibly transporting millions across the Middle Passage aboard horrific slave ships.",
      "sketchPrompt": "Royal African Company branding iron \\'RAC\\' and slave ship Brookes deck cross-section",
      "sketchIdeas": [
        "🔥 branding iron",
        "🚢 slave ship",
        "⛓️ iron shackles"
      ],
      "conceptTitle": "Royal African Company & Middle Passage",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1672 Crown trade monopoly"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1713 Spanish Asiento"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1781 Zong massacre insurance claim"
        }
      ],
      "fullMissionText": "Milestone 2 (1672): Choose (A) Creative Sketch: Royal African Company branding iron \\'RAC\\' and slave ship Brookes deck cross-section [🔥 branding iron • 🚢 slave ship • ⛓️ iron shackles] • OR • (B) Mind Map: \"Royal African Company & Middle Passage\" (1672 Crown trade monopoly, 1713 Spanish Asiento, 1781 Zong massacre insurance claim)"
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 3 (1739)",
      "date": "1739",
      "title": "Plantation Slavery & Queen Nanny’s Maroon Resistance",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Enslaved Africans labour under terror on Caribbean sugar plantations; in the rugged Blue Mountains of Jamaica, Queen Nanny leads the Windward Maroons in a brilliant guerrilla campaign, forcing the British Crown to sign a 1739 sovereignty peace treaty.",
      "sketchPrompt": "Queen Nanny on a mountain ridge sounding the abeng horn with camouflaged warriors ambushing redcoats",
      "sketchIdeas": [
        "📯 curved cow-horn abeng",
        "🌿 leafy camouflage",
        "⛰️ Blue Mountain peak"
      ],
      "conceptTitle": "Maroon Resistance & Sovereignty",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Cromwell 1655 conquest"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Blue Mountains guerrilla warfare"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1739 treaty granting 1,500 sovereign acres"
        }
      ],
      "fullMissionText": "Milestone 3 (1739): Choose (A) Creative Sketch: Queen Nanny on a mountain ridge sounding the abeng horn with camouflaged warriors ambushing redcoats [📯 curved cow-horn abeng • 🌿 leafy camouflage • ⛰️ Blue Mountain peak] • OR • (B) Mind Map: \"Maroon Resistance & Sovereignty\" (Cromwell 1655 conquest, Blue Mountains guerrilla warfare, 1739 treaty granting 1,500 sovereign acres)"
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 5 & 6 (1765 & 1773)",
      "date": "1765 & 1773",
      "title": "Taxation Without Representation & The Boston Tea Party",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Parliament’s Stamp Act and tea duties spark fierce resistance among American colonists shouting \"No taxation without representation!\", culminating in the 1773 Boston Tea Party when the Sons of Liberty dump 342 chests of tea into the harbour.",
      "sketchPrompt": "Bostonians hanging a stamp tax collector effigy from the Liberty Tree, or Sons of Liberty dumping 342 tea chests into Boston harbour",
      "sketchIdeas": [
        "🌳 Liberty Tree",
        "🪢 effigy",
        "🪓 tomahawk axe",
        "📦 tea chest",
        "🌊 harbour"
      ],
      "conceptTitle": "Road to American Revolution",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1765 Stamp Act \\'No taxation without representation\\'"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1770 Boston Massacre"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1773 Boston Tea Party & Coercive Acts"
        }
      ],
      "fullMissionText": "Milestones 5 & 6 (1765 & 1773): Choose (A) Creative Sketch: Bostonians hanging a stamp tax collector effigy from the Liberty Tree, or Sons of Liberty dumping 342 tea chests into Boston harbour [🌳 Liberty Tree • 🪢 effigy • 🪓 tomahawk axe • 📦 tea chest • 🌊 harbour] • OR • (B) Mind Map: \"Road to American Revolution\" (1765 Stamp Act \\'No taxation without representation\\', 1770 Boston Massacre, 1773 Boston Tea Party & Coercive Acts)"
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 7 & 8 (1776 & 1783)",
      "date": "1776 & 1783",
      "title": "The American Declaration of Independence & Black Loyalists",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Thomas Jefferson pens the 1776 Declaration of Independence proclaiming equality while owning enslaved labourers; thousands of enslaved people escape to British lines under Lord Dunmore’s proclamation, earning freedom as Black Loyalists.",
      "sketchPrompt": "Thomas Jefferson writing the Declaration of Independence while attended by an enslaved servant, or Black Loyalists boarding ships with Book of Negroes certificates",
      "sketchIdeas": [
        "🪶 eagle quill",
        "📜 Declaration",
        "🚢 evacuation frigate",
        "📖 Book of Negroes"
      ],
      "conceptTitle": "American Independence & Black Loyalists",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1776 Declaration moral paradox"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1781 Yorktown surrender"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1783 evacuation of 3,000 Black Loyalists to Nova Scotia"
        }
      ],
      "fullMissionText": "Milestones 7 & 8 (1776 & 1783): Choose (A) Creative Sketch: Thomas Jefferson writing the Declaration of Independence while attended by an enslaved servant, or Black Loyalists boarding ships with Book of Negroes certificates [🪶 eagle quill • 📜 Declaration • 🚢 evacuation frigate • 📖 Book of Negroes] • OR • (B) Mind Map: \"American Independence & Black Loyalists\" (1776 Declaration moral paradox, 1781 Yorktown surrender, 1783 evacuation of 3,000 Black Loyalists to Nova Scotia)"
    }
  ],
  "industrialisation_and_empire": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 2 (1784–1787)",
      "date": "1784–1787",
      "title": "Henry Cort, Iron Puddling & The Funtley Revolution",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "At Funtley Iron Works near Fareham, Henry Cort patents reverberatory puddling furnaces and grooved rollers in 1784, enabling Britain to refine iron 15 times faster using coal and freeing the Royal Navy from dependence on foreign timber.",
      "sketchPrompt": "Funtley puddling furnace stirring molten iron beside River Meon, or Admiralty master smiths testing naval anchors at Portsmouth",
      "sketchIdeas": [
        "🔥 reverberatory furnace",
        "🥄 puddling rod",
        "⚓ naval anchor"
      ],
      "conceptTitle": "Iron Revolution at Funtley",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1784 Cort puddling furnace & grooved rollers"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Portsmouth Dockyard trials"
        },
        {
          "label": "Core Mechanism 3",
          "value": "domestic wrought iron self-sufficiency"
        }
      ],
      "fullMissionText": "Milestones 1 & 2 (1784–1787): Choose (A) Creative Sketch: Funtley puddling furnace stirring molten iron beside River Meon, or Admiralty master smiths testing naval anchors at Portsmouth [🔥 reverberatory furnace • 🥄 puddling rod • ⚓ naval anchor] • OR • (B) Mind Map: \"Iron Revolution at Funtley\" (1784 Cort puddling furnace & grooved rollers, Portsmouth Dockyard trials, domestic wrought iron self-sufficiency)"
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 5 (1832)",
      "date": "1832",
      "title": "Factory Discipline, Textile Mules & Child Labour",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Steam-powered textile mills enforce severe factory discipline with 14-hour days; child piecers risk mutilation crawling under spinning mules until Michael Sadler’s 1832 report forces Parliament to pass the landmark 1833 Factory Act.",
      "sketchPrompt": "Child piecer crawling beneath whirring textile spinning mules while commissioners take notes",
      "sketchIdeas": [
        "🧵 spinning mule",
        "👶 child piecer",
        "📋 Sadler report"
      ],
      "conceptTitle": "Factory Work & Child Labour",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "14-hour workdays & mill discipline"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1832 Sadler Committee evidence"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1833 Factory Act establishing state inspection"
        }
      ],
      "fullMissionText": "Milestone 5 (1832): Choose (A) Creative Sketch: Child piecer crawling beneath whirring textile spinning mules while commissioners take notes [🧵 spinning mule • 👶 child piecer • 📋 Sadler report] • OR • (B) Mind Map: \"Factory Work & Child Labour\" (14-hour workdays & mill discipline, 1832 Sadler Committee evidence, 1833 Factory Act establishing state inspection)"
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 7 (1858)",
      "date": "1858",
      "title": "Slums, Asiatic Cholera & Bazalgette’s Sewers",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Rapid urban growth packs factory workers into squalid back-to-back slums with contaminated cesspools; following deadly cholera epidemics and the 1858 Great Stink, Joseph Bazalgette constructs 82 miles of subterranean brick intercepting sewers.",
      "sketchPrompt": "Muddy steaming Thames beside Parliament with politicians holding noses, or Bazalgette’s arched brick interceptor tunnels",
      "sketchIdeas": [
        "🏛️ Westminster",
        "👃 soaked curtains",
        "🧱 underground brick sewer"
      ],
      "conceptTitle": "Slums, Cholera & Sewers",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "deadly back-to-back housing cesspools"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Chadwick 1842 report & John Snow 1854 pump"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1858 Great Stink & 82 miles of Bazalgette sewers"
        }
      ],
      "fullMissionText": "Milestone 7 (1858): Choose (A) Creative Sketch: Muddy steaming Thames beside Parliament with politicians holding noses, or Bazalgette’s arched brick interceptor tunnels [🏛️ Westminster • 👃 soaked curtains • 🧱 underground brick sewer] • OR • (B) Mind Map: \"Slums, Cholera & Sewers\" (deadly back-to-back housing cesspools, Chadwick 1842 report & John Snow 1854 pump, 1858 Great Stink & 82 miles of Bazalgette sewers)"
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 3 & 4 (1819 & 1830)",
      "date": "1819 & 1830",
      "title": "Radical Protest: Peterloo Massacre & The Swing Riots",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Sixty thousand unarmed reform protestors at St Peter’s Field are charged by sabre-wielding yeomanry in the 1819 Peterloo Massacre; in 1830, desperate Hampshire farm workers smash threshing machines under the mythical leader Captain Swing.",
      "sketchPrompt": "Yeomanry cavalry charging unarmed cotton workers at Peterloo, or Hampshire farm labourers smashing a threshing machine under Captain Swing",
      "sketchIdeas": [
        "🏇 sabre cavalry",
        "🔨 heavy sledgehammer",
        "🌾 shattered threshing drum"
      ],
      "conceptTitle": "Radical Protest & Repression",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1819 Peterloo Massacre & Six Acts"
        },
        {
          "label": "Core Mechanism 2",
          "value": "1830 Hampshire Swing Riots across Meon Valley"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Winchester Assizes 101 transported"
        }
      ],
      "fullMissionText": "Milestones 3 & 4 (1819 & 1830): Choose (A) Creative Sketch: Yeomanry cavalry charging unarmed cotton workers at Peterloo, or Hampshire farm labourers smashing a threshing machine under Captain Swing [🏇 sabre cavalry • 🔨 heavy sledgehammer • 🌾 shattered threshing drum] • OR • (B) Mind Map: \"Radical Protest & Repression\" (1819 Peterloo Massacre & Six Acts, 1830 Hampshire Swing Riots across Meon Valley, Winchester Assizes 101 transported)"
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 6 & 8 (1832 & 1872)",
      "date": "1832 & 1872",
      "title": "The Great Reform Act, Chartism & The Secret Ballot",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Fearing revolution, Parliament passes the 1832 Great Reform Act abolishing 56 rotten boroughs and granting seats to Manchester and Birmingham, sparking the mass working-class Chartist petitions and the 1872 Secret Ballot Act.",
      "sketchPrompt": "Earl Grey presenting the 1832 Reform roll granting Manchester seats, or voter in private wooden booth dropping wax-sealed ballot",
      "sketchIdeas": [
        "📜 1832 Reform roll",
        "🏭 Manchester chimney",
        "🗳️ locked metal ballot box"
      ],
      "conceptTitle": "Road to Democracy",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "1832 Great Reform Act abolishing 56 rotten boroughs"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Chartist People’s Charter petitions"
        },
        {
          "label": "Core Mechanism 3",
          "value": "1872 Secret Ballot Act at Pontefract"
        }
      ],
      "fullMissionText": "Milestones 6 & 8 (1832 & 1872): Choose (A) Creative Sketch: Earl Grey presenting the 1832 Reform roll granting Manchester seats, or voter in private wooden booth dropping wax-sealed ballot [📜 1832 Reform roll • 🏭 Manchester chimney • 🗳️ locked metal ballot box] • OR • (B) Mind Map: \"Road to Democracy\" (1832 Great Reform Act abolishing 56 rotten boroughs, Chartist People’s Charter petitions, 1872 Secret Ballot Act at Pontefract)"
    }
  ],
  "post_war_britain": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 3 (1897 & 1918)",
      "date": "1897 & 1918",
      "title": "The Votes for Women Campaign & The 1918 Act",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Millicent Fawcett’s constitutional NUWSS and Emmeline Pankhurst’s militant WSPU battle for female suffrage; following decisive wartime mobilisation of 1.5 million women in munitions, Parliament grants women over 30 the vote in 1918.",
      "sketchPrompt": "Suffragette banner 'Deeds Not Words' crossed with munitions shell and 1918 ballot paper",
      "sketchIdeas": [
        "🗳️ 1918 Ballot paper",
        "📜 Suffragist petition scroll",
        "💣 Canary Girl artillery shell",
        "⛓️ WSPU hunger strike chains"
      ],
      "conceptTitle": "Votes for Women Campaign",
      "branches": [
        {
          "label": "Constitutional Campaign",
          "value": "1897 Millicent Fawcett NUWSS peaceful lobbying"
        },
        {
          "label": "Militant Defiance",
          "value": "1903 Pankhurst WSPU direct action & hunger strikes"
        },
        {
          "label": "War Mobilisation",
          "value": "1918 Representation of the People Act voting rights"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 4 & 5 (1942 & 1948)",
      "date": "1942 & 1948",
      "title": "The Beveridge Report & The Foundation of the NHS",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Sir William Beveridge publishes his 1942 blueprint to conquer the Five Giants (Want, Disease, Ignorance, Squalor, Idleness); on 5 July 1948, Health Minister Aneurin Bevan launches the National Health Service, providing free medical treatment for all.",
      "sketchPrompt": "Shield slaying the Five Giants or Bevan presenting free prescription spectacles to an elderly patient",
      "sketchIdeas": [
        "🛡️ Beveridge shield slaying 5 Giants",
        "🏥 NHS 5 July 1948 banner",
        "🩺 Stethoscope & free prescription",
        "📜 1942 Beveridge Social Insurance report"
      ],
      "conceptTitle": "Post-War Welfare State",
      "branches": [
        {
          "label": "Social Blueprint",
          "value": "1942 Beveridge Report conquering Five Giants"
        },
        {
          "label": "Cradle to Grave",
          "value": "Universal Social Security & National Insurance"
        },
        {
          "label": "Healthcare Equality",
          "value": "5 July 1948 Aneurin Bevan founds the free NHS"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 6 (22 June 1948)",
      "date": "22 June 1948",
      "title": "HMT Empire Windrush & Caribbean Migration",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "HMT Empire Windrush arrives at Tilbury Docks carrying 492 passengers from Jamaica and Trinidad; invited as British citizens to rebuild war-torn Britain, Caribbean migrants establish multicultural Britain despite facing widespread colour bars in housing and employment.",
      "sketchPrompt": "Troopship Empire Windrush docking at Tilbury Docks with passengers carrying suitcases and calypso records",
      "sketchIdeas": [
        "🚢 HMT Empire Windrush bow",
        "🧳 Cardboard migration suitcase",
        "📜 1948 British Nationality Act passport",
        "🚫 'No Coloureds' racist lodging sign"
      ],
      "conceptTitle": "Windrush Generation",
      "branches": [
        {
          "label": "Imperial Citizenship",
          "value": "1948 British Nationality Act citizenship rights"
        },
        {
          "label": "Post-War Reconstruction",
          "value": "Vital labour in London Transport, NHS, & railways"
        },
        {
          "label": "Colour Bar Resistance",
          "value": "Community mutual aid & anti-discrimination solidarity"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 7 (1963)",
      "date": "1963",
      "title": "The Bristol Bus Boycott & The Race Relations Acts",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Led by Paul Stephenson and the West Indian Development Council, Bristol citizens stage a four-month boycott of the Bristol Omnibus Company over its racist ban on non-white crews, forcing management to capitulate and inspiring the 1965 Race Relations Act.",
      "sketchPrompt": "Double-decker Bristol bus with boycott placards and civil rights marchers",
      "sketchIdeas": [
        "🚌 Bristol double-decker bus",
        "✊ Stephenson boycott placard",
        "⚖️ 1965 Race Relations Act ledger",
        "🛑 Overturned colour bar rule"
      ],
      "conceptTitle": "Civil Rights in Britain",
      "branches": [
        {
          "label": "Colour Bar Exposure",
          "value": "Bristol Omnibus Company racist hiring policy"
        },
        {
          "label": "Direct Action Boycott",
          "value": "Paul Stephenson & 4-month community boycott"
        },
        {
          "label": "Legislative Milestone",
          "value": "Harold Wilson passes 1965 & 1968 Race Relations Acts"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestone 8 (1958–1982)",
      "date": "1958–1982",
      "title": "CND, The Aldermaston Marches & Greenham Common",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "The Campaign for Nuclear Disarmament (CND) designs the iconic peace symbol and mobilises thousands on the annual Aldermaston Marches; in 1981, women establish the Greenham Common Peace Camp, encircling the perimeter fence with children’s photos and yarn to protest US cruise missiles.",
      "sketchPrompt": "Gerald Holtom’s CND peace symbol superimposed over Aldermaston marchers or Greenham Common perimeter fence weaving",
      "sketchIdeas": [
        "☮️ Gerald Holtom CND peace symbol",
        "🚶‍♀️ Aldermaston 52-mile protest march",
        "🧶 Greenham Common barbed-wire yarn",
        "🚀 US Cruise missile silhouette"
      ],
      "conceptTitle": "Nuclear Protest & Peace Movement",
      "branches": [
        {
          "label": "Anti-Nuclear Mobilisation",
          "value": "1958 CND founding & Aldermaston peace marches"
        },
        {
          "label": "Visual Iconography",
          "value": "Holtom semaphore symbol (N+D for Nuclear Disarmament)"
        },
        {
          "label": "Greenham Common Camp",
          "value": "1981–1982 30,000 women embrace the base fence"
        }
      ]
    }
  ],
  "great_war": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 2 (1871)",
      "date": "1871",
      "title": "German Unification, Hall of Mirrors & Alsace-Lorraine",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Inside the Hall of Mirrors at Versailles, Prussian King Wilhelm I is proclaimed German Emperor; France is forced to surrender mineral-rich Alsace-Lorraine and pay 5 billion francs, permanently cementing French revanchism and upsetting the European balance of power.",
      "sketchPrompt": "Wilhelm I crowned beneath Versailles chandeliers or mourning France looking across the lost Vosges border",
      "sketchIdeas": [
        "👑 Prussian Imperial Pickelhaube",
        "🏛️ Versailles Hall of Mirrors",
        "🗺️ Alsace-Lorraine border map",
        "🇫🇷 French mourning black veil"
      ],
      "conceptTitle": "German Unification & French Revanchism",
      "branches": [
        {
          "label": "Power Transformation",
          "value": "1871 Bismarck unites 39 German states into military powerhouse"
        },
        {
          "label": "Treaty of Frankfurt",
          "value": "France loses Alsace-Lorraine and pays 5 billion francs"
        },
        {
          "label": "Revanchism Fuel",
          "value": "Generations of French schoolbooks pledge revenge"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 3 & 7 (1884 & 1911)",
      "date": "1884 & 1911",
      "title": "The Scramble for Africa & The Panther at Agadir",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Bismarck convenes the 1884 Berlin Conference to carve up Africa under rules of \"effective occupation\"; in 1911, Kaiser Wilhelm II sends the gunboat SMS Panther to Agadir, provoking Lloyd George’s Mansion House speech and forging close Anglo-French naval cooperation.",
      "sketchPrompt": "Imperial diplomats carving up African map cake or German gunboat Panther anchored in Moroccan bay under British warning",
      "sketchIdeas": [
        "🗺️ Berlin Conference African map",
        "🚢 Gunboat SMS Panther anchored at Agadir",
        "🦁 British roaring lion warning",
        "🤝 Anglo-French secret naval pact"
      ],
      "conceptTitle": "Imperial Rivalry & Moroccan Crises",
      "branches": [
        {
          "label": "Imperial Carve-Up",
          "value": "1884 Berlin Conference triggers Scramble for Africa"
        },
        {
          "label": "Weltpolitik Challenge",
          "value": "1905 & 1911 Moroccan Crises test Entente Cordiale"
        },
        {
          "label": "Entente Solidified",
          "value": "Britain and France agree joint naval defense coordination"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 6 (1906)",
      "date": "1906",
      "title": "HMS Dreadnought & The Anglo-German Naval Race",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "The Royal Navy launches HMS Dreadnought, armed with ten 12-inch guns and revolutionary steam turbines; making all previous battleships obsolete, it sparks a ferocious naval arms race between Admiral Fisher and Admiral von Tirpitz in the North Sea.",
      "sketchPrompt": "HMS Dreadnought firing broadside or British and German shipyards racing with stopwatch and rivet hammers",
      "sketchIdeas": [
        "🚢 HMS Dreadnought all-big-gun battleship",
        "🎯 Ten 12-inch rotating gun turrets",
        "⏱️ \"We want eight and we won’t wait!\" stopwatch",
        "🌊 North Sea battleship deployment"
      ],
      "conceptTitle": "Anglo-German Naval Arms Race",
      "branches": [
        {
          "label": "Naval Revolution",
          "value": "1906 HMS Dreadnought makes all existing fleets obsolete"
        },
        {
          "label": "Tirpitz Naval Laws",
          "value": "German risk fleet threatens British sea communications"
        },
        {
          "label": "British Commitment",
          "value": "Royal Navy retains 29 dreadnoughts to Germany’s 17"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestones 4 & 7 (1890 & 1908)",
      "date": "1890 & 1908",
      "title": "Dropping the Pilot & The Bosnian Crisis",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Kaiser Wilhelm II dismisses Bismarck in 1890 and lets the Reinsurance Treaty lapse, driving Russia into the arms of France; in 1908, Austria-Hungary annexes Bosnia-Herzegovina, enraging Serbia and humiliating Russia.",
      "sketchPrompt": "Bismarck descending ship gangway as Kaiser looks on from bridge or Austro-Hungarian double eagle grasping Bosnia",
      "sketchIdeas": [
        "⚓ Bismarck walking ship gangway",
        "🦅 Austro-Hungarian two-headed eagle",
        "🇷🇸 Serbian nationalist protest rally",
        "💣 Balkan Powder Keg fuse"
      ],
      "conceptTitle": "Alliance Entanglement & Balkan Powder Keg",
      "branches": [
        {
          "label": "Diplomatic Collapse",
          "value": "1890 Bismarck dismissed; Franco-Russian alliance signed 1894"
        },
        {
          "label": "Triple Entente",
          "value": "1907 Britain, France and Russia align against Central Powers"
        },
        {
          "label": "Bosnian Annexation",
          "value": "1908 Austrian annexation humiliates Russia and enrages Serbia"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestone 8 (28 June 1914)",
      "date": "28 June 1914",
      "title": "The Sarajevo Assassination & The Outbreak of War",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Nineteen-year-old Gavrilo Princip shoots Archduke Franz Ferdinand and Sophie beside the Latin Bridge in Sarajevo; Austria issues the July Ultimatum with a German \"blank cheque\", dragging the interlocking alliance system into World War I.",
      "sketchPrompt": "Gavrilo Princip aiming pistol at Archduke’s open-top Gräf & Stift motorcar at the Latin Bridge",
      "sketchIdeas": [
        "🚗 Open-top Austrian royal motorcar",
        "🔫 Princip Browning automatic pistol",
        "🌉 Sarajevo Latin Bridge & Miljacka River",
        "📜 German \"Blank Cheque\" telegram"
      ],
      "conceptTitle": "July Crisis & Spark of World War I",
      "branches": [
        {
          "label": "Fatal Trigger",
          "value": "28 June 1914 Black Hand assassination in Sarajevo"
        },
        {
          "label": "German Blank Cheque",
          "value": "Kaiser Wilhelm promises unconditional backing to Vienna"
        },
        {
          "label": "Domino Mobilisation",
          "value": "Russia mobilises; Schlieffen Plan invades Belgium, bringing Britain in"
        }
      ]
    }
  ],
  "water_and_sanitation": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestone 1 (c.AD 75)",
      "date": "c.AD 75",
      "title": "Roman Aqueducts & Fishbourne Lead Pipes",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Romans construct monumental gravity-fed aqueducts, thermae, and jointed lead pipes at Fishbourne Palace, demonstrating imperial technological mastery over hydraulic engineering.",
      "sketchPrompt": "Draw stone aqueduct arches with water flowing into lead pipes",
      "sketchIdeas": [
        "🏛️ Stone Roman aqueduct arches",
        "🚰 Lead water conduit pipes",
        "🏊 Roman thermae public baths"
      ],
      "conceptTitle": "Roman Hydraulic Engineering",
      "branches": [
        {
          "label": "Monumental Supply",
          "value": "Gravity-fed stone aqueduct channels"
        },
        {
          "label": "Palace Infrastructure",
          "value": "Fishbourne Palace pressurized lead conduits"
        },
        {
          "label": "Public Hygiene",
          "value": "Public thermae baths and continuous flush latrines"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 2 (c.1165)",
      "date": "c.1165",
      "title": "Canterbury Monastic Conduits & Settling Tanks",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Monk Wibert designs five settling tanks and lead conduits to bring filtered spring water to Christ Church Priory, keeping monks healthy while townspeople drink contaminated river water.",
      "sketchPrompt": "Draw five settling tanks filtering mud and sand from spring water",
      "sketchIdeas": [
        "⛪ Canterbury Priory conduit tower",
        "🧪 Five sand settling tanks",
        "⛲ Monastic cloister lavatorium fountain"
      ],
      "conceptTitle": "Medieval Monastic Sanitation",
      "branches": [
        {
          "label": "Spring Conduit",
          "value": "Clean water piped from hills outside city"
        },
        {
          "label": "Sequential Filtration",
          "value": "Five tanks settling sediment and grit"
        },
        {
          "label": "Health Privilege",
          "value": "Monasteries insulated from urban cholera and dysentery"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestone 3 (1596)",
      "date": "1596",
      "title": "Sir John Harington: The Flush Toilet",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Elizabeth I’s godson invents the world’s first valve-operated flushing water closet, though lack of running water mains and sewers prevents wide adoption.",
      "sketchPrompt": "Draw an overhead cistern with a pull lever flushing into a pan",
      "sketchIdeas": [
        "🚽 Harington overhead cistern toilet",
        "🪣 Hand-filled water barrel",
        "📜 The Metamorphosis of Ajax treatise"
      ],
      "conceptTitle": "Early Modern Innovation",
      "branches": [
        {
          "label": "Mechanical Flushing",
          "value": "Valve releases water to wash away waste"
        },
        {
          "label": "Infrastructural Deficit",
          "value": "No running municipal water mains"
        },
        {
          "label": "Cesspool Persistence",
          "value": "Towns continue relying on leaking street cesspits"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 4 (1831–1842)",
      "date": "1831–1842",
      "title": "Asiatic Cholera & Chadwick’s 1842 Report",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Cholera sweeps through industrial boomtowns killing thousands; Edwin Chadwick proves that squalor and contaminated privies cause preventable disease and economic poverty.",
      "sketchPrompt": "Draw back-to-back terraced houses with an overflowing shared privy midden",
      "sketchIdeas": [
        "🏘️ Squalid back-to-back slum terraces",
        "🪣 Overflowing outdoor cesspool privy",
        "📋 1842 Chadwick Sanitary Report"
      ],
      "conceptTitle": "Industrial Squalor & Sanitary Reform",
      "branches": [
        {
          "label": "Epidemic Terror",
          "value": "1831 Asiatic cholera kills 50,000 in Britain"
        },
        {
          "label": "Statistical Proof",
          "value": "Chadwick proves Manchester labourers die at average age 17"
        },
        {
          "label": "State Awakening",
          "value": "1848 Public Health Act establishes General Board of Health"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 5 & 6 (1854–1884)",
      "date": "1854–1884",
      "title": "Snow’s Pump, The Great Stink & Bazalgette’s Sewers",
      "pageRef": "Workbook Centrefold • pp. 8–9",
      "desc": "Dr John Snow removes the Broad Street pump handle in 1854; the 1858 Great Stink forces Parliament to fund Joseph Bazalgette’s 82 miles of subterranean brick sewers, conquering water-borne disease.",
      "sketchPrompt": "Draw a street pump with handle removed beside an egg-shaped brick underground sewer tunnel",
      "sketchIdeas": [
        "🚰 Broad Street pump with removed handle",
        "🗺️ John Snow Soho cholera spot map",
        "🧱 Bazalgette arched brick sewer tunnels",
        "🏛️ Westminster curtains soaked in chloride of lime"
      ],
      "conceptTitle": "Engineering & Epidemiological Triumph",
      "branches": [
        {
          "label": "Water-Borne Proof",
          "value": "1854 John Snow proves cholera is transmitted in water"
        },
        {
          "label": "The Great Stink",
          "value": "1858 heatwave drives MPs to fund Bazalgette’s sewer network"
        },
        {
          "label": "Compulsory Hygiene",
          "value": "1875 Public Health Act mandates clean water nationwide"
        }
      ]
    }
  ],
  "cme_new": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestone 1 (1915–1917)",
      "date": "1915–1917",
      "title": "Conflicting Promises & Imperial Mandates",
      "pageRef": "Workbook Pages 2–3 • Key Topic 1.1",
      "desc": "Britain issues contradictory pledges: the McMahon-Hussein Correspondence promising Arab independence, the secret Sykes-Picot Agreement dividing the Levant with France, and the Balfour Declaration supporting a Jewish national home.",
      "sketchPrompt": "Contradictory British pledges and the imperial boundary line separating British and French mandate zones",
      "sketchIdeas": [
        "📜 Balfour Declaration letter",
        "🗺️ Sykes-Picot ruler boundary line",
        "👑 McMahon-Hussein correspondence"
      ],
      "conceptTitle": "Conflicting Pledges",
      "branches": [
        {
          "label": "Arab Alliance",
          "value": "McMahon-Hussein promises Arab sovereignty"
        },
        {
          "label": "Imperial Partition",
          "value": "Sykes-Picot divides Middle East into spheres"
        },
        {
          "label": "Zionist Commitment",
          "value": "1917 Balfour Declaration backs Jewish homeland"
        }
      ]
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestone 2 (1946–1947)",
      "date": "1946–1947",
      "title": "The End of the British Mandate & King David Hotel",
      "pageRef": "Workbook Pages 2–3 • Key Topic 1.2",
      "desc": "Holocaust survivors seek refuge in Palestine as Jewish paramilitary groups target British rule; the Irgun bombs the King David Hotel in July 1946, prompting exhausted Britain to refer Palestine to the United Nations.",
      "sketchPrompt": "Shattered south-west wing of the King David Hotel and the barbed wire perimeter around British administrative zones",
      "sketchIdeas": [
        "🏨 King David Hotel shattered wing",
        "🚢 Exodus 1947 refugee ship",
        "🌐 UN badge & mandate handover"
      ],
      "conceptTitle": "Collapse of British Mandate",
      "branches": [
        {
          "label": "Refugee Crisis",
          "value": "Post-Holocaust migration and British blockades"
        },
        {
          "label": "Armed Insurgency",
          "value": "Irgun bombing of British military HQ"
        },
        {
          "label": "UN Referral",
          "value": "Britain relinquishes mandate to United Nations"
        }
      ]
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestones 3 & 4 (1947–1949)",
      "date": "1947–1949",
      "title": "UN Partition & The 1948–49 Arab-Israeli War",
      "pageRef": "Workbook Pages 2–3 • Key Topic 1.3",
      "desc": "The UN passes Resolution 181 partitioning Palestine; on 14 May 1948 Ben-Gurion proclaims Israel’s independence. Five Arab armies invade, but Israeli forces prevail, expanding territory by 21% beyond the partition lines.",
      "sketchPrompt": "UN Partition map divisions and the five Arab invasion routes crossing Israel’s borders",
      "sketchIdeas": [
        "🗺️ 1947 UN Partition map",
        "⭐ Israeli declaration of independence scroll",
        "⚔️ Five Arab army invasion vectors"
      ],
      "conceptTitle": "1948 War of Independence",
      "branches": [
        {
          "label": "UN Resolution 181",
          "value": "Partition plan rejected by Arab leadership"
        },
        {
          "label": "Statehood Declaration",
          "value": "Ben-Gurion proclaims State of Israel"
        },
        {
          "label": "1949 Armistice",
          "value": "Green Line established with 21% territorial gain"
        }
      ]
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 5 (1948–1950)",
      "date": "1948–1950",
      "title": "The Palestinian Refugee Crisis (Al-Nakba)",
      "pageRef": "Workbook Pages 2–3 • Key Topic 1.4",
      "desc": "Over 700,000 Palestinian Arabs flee or are expelled from their homes during the 1948 war (Al-Nakba), becoming stateless refugees in UNRWA camps across Gaza, the West Bank, Jordan, Syria, and Lebanon.",
      "sketchPrompt": "Overcrowded UNRWA refugee tents alongside the cargo ships arriving in Haifa with Jewish immigrants",
      "sketchIdeas": [
        "⛺ UNRWA canvas refugee tent",
        "🔑 Palestinian home key (Right of Return)",
        "🚢 Immigration cargo ships arriving at Haifa"
      ],
      "conceptTitle": "Nakba & Refugee Catastrophe",
      "branches": [
        {
          "label": "Mass Displacement",
          "value": "700,000 Palestinians become stateless refugees"
        },
        {
          "label": "UNRWA Camps",
          "value": "Permanent tent cities in Gaza and West Bank"
        },
        {
          "label": "Jewish Influx",
          "value": "Law of Return doubles Israeli population"
        }
      ]
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_6",
      "milestoneBadge": "Milestone 6 (1956)",
      "date": "1956",
      "title": "Nasser & The Suez Crisis",
      "pageRef": "Workbook Pages 2–3 • Key Topic 1.5",
      "desc": "President Nasser nationalises the Suez Canal; Britain, France, and Israel hatch the secret Sèvres Protocol to invade Egypt, but US President Eisenhower forces an immediate humiliating British and French withdrawal.",
      "sketchPrompt": "Nationalised Suez Canal waterway and the British paratroopers landing at Port Said under US diplomatic pressure",
      "sketchIdeas": [
        "🌊 Suez Canal waterway",
        "🪖 British paratroopers landing at Port Said",
        "🦅 US dollar pressure forcing withdrawal"
      ],
      "conceptTitle": "Suez Crisis of 1956",
      "branches": [
        {
          "label": "Canal Nationalisation",
          "value": "Nasser seizes canal to fund Aswan Dam"
        },
        {
          "label": "Protocol of Sèvres",
          "value": "Secret Anglo-French-Israeli collusion"
        },
        {
          "label": "Superpower Halt",
          "value": "Eisenhower halts invasion; imperial prestige ruined"
        }
      ]
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_7",
      "milestoneBadge": "Milestones 1 & 2 (1964–1967)",
      "date": "1964–1967",
      "title": "Escalation to the Six-Day War & Straits of Tiran",
      "pageRef": "Workbook Pages 2–3 • Key Topic 2.1",
      "desc": "Border clashes over water diversion on the Syrian border and the creation of the PLO escalate; in May 1967, Nasser expels UNEF peacekeepers and blockades the Straits of Tiran to Israeli shipping.",
      "sketchPrompt": "Cairo Arab Summit symbol and the naval blockade of the Straits of Tiran at Sharm el-Sheikh",
      "sketchIdeas": [
        "⚓ Straits of Tiran blockade",
        "📢 Arab summit rhetoric",
        "🪖 UNEF blue helmets ordered out of Sinai"
      ],
      "conceptTitle": "Road to Six-Day War",
      "branches": [
        {
          "label": "Water Disputes",
          "value": "Headwater diversion clashes on Golan border"
        },
        {
          "label": "UNEF Eviction",
          "value": "Nasser orders UN troops out of Sinai buffer"
        },
        {
          "label": "Naval Blockade",
          "value": "Closing Straits of Tiran acts as casus belli"
        }
      ]
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_8",
      "milestoneBadge": "Milestone 3 (5–10 June 1967)",
      "date": "5–10 June 1967",
      "title": "Operation Focus & The Six-Day War Blitzkrieg",
      "pageRef": "Workbook Pages 2–3 • Key Topic 2.2",
      "desc": "Israel launches preemptive airstrike Operation Focus, destroying Egypt’s air force on the tarmac in under three hours; ground forces seize the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and the Golan Heights.",
      "sketchPrompt": "Israeli Centurion tanks advancing through the desert and label the Golan Heights, West Bank, and Sinai",
      "sketchIdeas": [
        "✈️ IAF Mirage jet striking Egyptian airfields",
        "🚜 Centurion tank advancing in Sinai",
        "🗺️ Conquered territories map (Sinai, West Bank, Golan)"
      ],
      "conceptTitle": "Six-Day War Triumph",
      "branches": [
        {
          "label": "Operation Focus",
          "value": "Preemptive airstrike destroys 400 Arab combat aircraft"
        },
        {
          "label": "Rapid Blitzkrieg",
          "value": "IDF takes Sinai, West Bank, and Golan Heights in 6 days"
        },
        {
          "label": "Territorial Tripling",
          "value": "Israel controls territory three times its pre-1967 size"
        }
      ]
    },
    {
      "lessonIndex": 7,
      "lessonId": "lesson_9",
      "milestoneBadge": "Milestone 4 (Nov 1967)",
      "date": "Nov 1967",
      "title": "UN Resolution 242 & The Khartoum \"Three Noes\"",
      "pageRef": "Workbook Pages 2–3 • Key Topic 2.3",
      "desc": "The UN Security Council passes Resolution 242 establishing the \"land for peace\" formula; Arab leaders meet at Khartoum issuing the \"Three Noes\" (no peace, no recognition, no negotiations with Israel).",
      "sketchPrompt": "UN Security Council emblem and the three banners of the Khartoum \"Three Noes\"",
      "sketchIdeas": [
        "🌐 UN Resolution 242 \"Land for Peace\" balance scale",
        "📜 Khartoum Summit Three Noes banner",
        "🧱 Israeli settlements in occupied West Bank"
      ],
      "conceptTitle": "Resolution 242 & Stalemate",
      "branches": [
        {
          "label": "Land for Peace",
          "value": "UN 242 withdrawal from territories for secure borders"
        },
        {
          "label": "Khartoum Summit",
          "value": "Arab League pledges \"No peace, no recognition, no negotiation\""
        },
        {
          "label": "Settlement Movement",
          "value": "Beginning of Israeli civilian settlement in West Bank"
        }
      ]
    },
    {
      "lessonIndex": 8,
      "lessonId": "lesson_10",
      "milestoneBadge": "Milestone 5 (1968–1972)",
      "date": "1968–1972",
      "title": "The Rise of the PLO, Black September & Munich",
      "pageRef": "Workbook Pages 2–3 • Key Topic 2.4",
      "desc": "Yasser Arafat’s PLO adopts armed fedayeen struggle following the Battle of Karameh; expelled from Jordan during Black September in 1970, militants assassinate 11 Israeli athletes at the 1972 Munich Olympics.",
      "sketchPrompt": "Dawson’s Field aircraft explosion and trace the PLO exile route from Jordan to southern Lebanon",
      "sketchIdeas": [
        "✈️ Dawson’s Field hijacked aircraft",
        "🚩 Black September crossed rifles",
        "🏅 Munich 1972 Olympic memorial rings"
      ],
      "conceptTitle": "Armed Resistance & Global Shock",
      "branches": [
        {
          "label": "Fedayeen Emergence",
          "value": "Arafat leads PLO as sole legitimate representative"
        },
        {
          "label": "Black September",
          "value": "King Hussein expels PLO militias to Lebanon"
        },
        {
          "label": "Munich Olympics Terror",
          "value": "11 Israeli athletes killed by Black September"
        }
      ]
    },
    {
      "lessonIndex": 9,
      "lessonId": "lesson_11",
      "milestoneBadge": "Milestone 6 (October 1973)",
      "date": "October 1973",
      "title": "Operation Badr, The Yom Kippur War & OPEC Embargo",
      "pageRef": "Workbook Pages 2–3 • Key Topic 2.5",
      "desc": "Egypt and Syria launch a surprise assault on Yom Kippur, breaching the Bar-Lev Line with high-pressure water monitors; Arab OPEC members impose an oil embargo on Western supporters, quadrupling global oil prices.",
      "sketchPrompt": "Water-monitor breach of the Bar-Lev Line and the OPEC oil pipeline embargo valve",
      "sketchIdeas": [
        "🌊 High-pressure water monitors breaching sand wall",
        "🛢️ OPEC oil barrel embargo valve",
        "🕊️ UN ceasefire line & shuttle diplomacy"
      ],
      "conceptTitle": "1973 War & Energy Shock",
      "branches": [
        {
          "label": "Operation Badr",
          "value": "Egyptian forces cross Suez and shatter Bar-Lev Line"
        },
        {
          "label": "IDF Counter-Offensive",
          "value": "Sharon crosses canal; 3rd Army surrounded"
        },
        {
          "label": "OPEC Oil Weapon",
          "value": "Oil prices quadruple, shocking Western economies"
        }
      ]
    },
    {
      "lessonIndex": 10,
      "lessonId": "lesson_12",
      "milestoneBadge": "Milestones 1 & 2 (1977–1979)",
      "date": "1977–1979",
      "title": "Sadat in Jerusalem & The Camp David Accords",
      "pageRef": "Workbook Pages 2–3 • Key Topic 3.1",
      "desc": "Anwar Sadat makes an unprecedented journey to address the Israeli Knesset; mediated by Jimmy Carter at Camp David, Egypt and Israel sign a historic peace treaty returning the Sinai Peninsula to Egypt.",
      "sketchPrompt": "Sadat addressing the Knesset chamber and the three-way handshake on the White House lawn",
      "sketchIdeas": [
        "🏛️ Sadat addressing Israeli Knesset podium",
        "🤝 Carter, Sadat & Begin three-way handshake",
        "🗺️ Sinai Peninsula returned to Egyptian sovereignty"
      ],
      "conceptTitle": "Camp David Peace Treaty",
      "branches": [
        {
          "label": "Knesset Address",
          "value": "Sadat declares \"No more war, no more bloodshed\""
        },
        {
          "label": "Camp David Summit",
          "value": "13 days of negotiation mediated by Jimmy Carter"
        },
        {
          "label": "Historic Treaty",
          "value": "First Arab-Israeli peace treaty signed in 1979"
        }
      ]
    },
    {
      "lessonIndex": 11,
      "lessonId": "lesson_13",
      "milestoneBadge": "Milestones 4, 5 & 6 (1982–1995)",
      "date": "1982–1995",
      "title": "Lebanon, The First Intifada & The Oslo Accords",
      "pageRef": "Workbook Pages 2–3 • Key Topic 3.2",
      "desc": "Israel invades Lebanon in 1982; grassroots stone-throwing youth spark the 1987 First Intifada. In 1993, Yitzhak Rabin and Yasser Arafat shake hands at the White House on the Oslo Accords before Rabin is assassinated.",
      "sketchPrompt": "Stone-throwing youth facing an IDF tank, Rabin-Arafat handshake, and memorial flame in Tel Aviv",
      "sketchIdeas": [
        "🪨 Stone-throwing youth facing Merkava tank",
        "🤝 Rabin and Arafat White House handshake",
        "🕯️ Memorial flame for Yitzhak Rabin"
      ],
      "conceptTitle": "Intifada to Oslo Accords",
      "branches": [
        {
          "label": "First Intifada",
          "value": "1987 popular uprising in Gaza and West Bank"
        },
        {
          "label": "Oslo Accords",
          "value": "Mutual recognition and Palestinian Authority created"
        },
        {
          "label": "Rabin Assassination",
          "value": "Peace process derailed by extremist violence"
        }
      ]
    }
  ],
  "cold_war": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1",
      "milestoneBadge": "Milestones 1 & 2 (1945)",
      "date": "1945",
      "title": "Ideological Clash: Capitalism vs Communism",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "Following the defeat of Nazi Germany, the Grand Alliance fractures over irreconcilable worldviews: American liberal democracy and free markets versus Soviet Marxist-Leninist state control and one-party dictatorship.",
      "sketchPrompt": "Draw the ideological split — e.g. the American Dollar sign versus the Soviet Hammer and Sickle separated by a rising wall of suspicion",
      "sketchIdeas": [],
      "conceptTitle": "Ideological Clash",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Free Market vs State Planning"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Democracy vs Dictatorship"
        }
      ],
      "fullMissionText": "Milestones 1 & 2 (1945): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw the ideological split — e.g. the American Dollar sign versus the Soviet Hammer and Sickle separated by a rising wall of suspicion • OR • (B) Mind Map: \"Ideological Clash\" (Free Market vs State Planning, Democracy vs Dictatorship)."
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_2",
      "milestoneBadge": "Milestones 2 & 3 (1945–1946)",
      "date": "1945–1946",
      "title": "Yalta to Potsdam: The Breakdown of the Grand Alliance",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "At Yalta and Potsdam in 1945, Churchill, Roosevelt/Truman, and Stalin clash over the fate of Poland and the four-power division of Germany; Truman’s atomic bomb revelation accelerates Soviet suspicion.",
      "sketchPrompt": "Draw a conference table divided down the centre, with Truman holding an atomic thunderbolt and Stalin drawing a heavy red border around Poland",
      "sketchIdeas": [],
      "conceptTitle": "Yalta to Potsdam",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Zone division"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Polish dispute"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Atomic leverage"
        }
      ],
      "fullMissionText": "Milestones 2 & 3 (1945–1946): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw a conference table divided down the centre, with Truman holding an atomic thunderbolt and Stalin drawing a heavy red border around Poland • OR • (B) Mind Map: \"Yalta to Potsdam\" (Zone division, Polish dispute, Atomic leverage)."
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_3",
      "milestoneBadge": "Milestones 4 & 5 (1947–1949)",
      "date": "1947–1949",
      "title": "The Iron Curtain & The Berlin Blockade",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "Stalin cuts all road, rail, and canal routes into West Berlin in June 1948; the Western Allies respond with the daring 11-month Berlin Airlift, flying 278,000 supply missions and prompting the formation of NATO.",
      "sketchPrompt": "Draw a C-54 transport plane dropping parachutes of coal and milk over the ruins of Berlin",
      "sketchIdeas": [],
      "conceptTitle": "Berlin Crisis",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Currency reform"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Blockade"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Airlift"
        },
        {
          "label": "Core Mechanism 4",
          "value": "NATO"
        }
      ],
      "fullMissionText": "Milestones 4 & 5 (1947–1949): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw a C-54 transport plane dropping parachutes of coal and milk over the ruins of Berlin • OR • (B) Mind Map: \"Berlin Crisis\" (Currency reform, Blockade, Airlift, NATO)."
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_4",
      "milestoneBadge": "Milestone 7 (1962)",
      "date": "1962",
      "title": "Nuclear Brinkmanship: The Cuban Missile Crisis",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "In October 1962, US U-2 spy planes discover Soviet nuclear missile sites in Cuba; President Kennedy imposes a naval quarantine, bringing humanity to the brink of nuclear war before a secret missile swap resolves the crisis.",
      "sketchPrompt": "Draw Kennedy and Khrushchev arm-wrestling while seated on nuclear hydrogen bombs with fingers hovering over detonators",
      "sketchIdeas": [],
      "conceptTitle": "Cuban Missile Crisis",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "U-2 discovery"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Quarantine"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Black Saturday"
        },
        {
          "label": "Core Mechanism 4",
          "value": "Secret swap"
        }
      ],
      "fullMissionText": "Milestone 7 (1962): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw Kennedy and Khrushchev arm-wrestling while seated on nuclear hydrogen bombs with fingers hovering over detonators • OR • (B) Mind Map: \"Cuban Missile Crisis\" (U-2 discovery, Quarantine, Black Saturday, Secret swap)."
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_5",
      "milestoneBadge": "Milestones 6 & 8 (1950–1975)",
      "date": "1950–1975",
      "title": "Asian Proxy Wars: Korea & Vietnam",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "Superpower rivalry explodes into proxy warfare in Asia: the 1950–1953 Korean War solidifies the 38th Parallel division, while American intervention in Vietnam demonstrates the brutal human cost of the Domino Theory.",
      "sketchPrompt": "Draw a row of falling dominos stretching across a map of East Asia, or a Huey helicopter landing beside dense jungle",
      "sketchIdeas": [],
      "conceptTitle": "Asian Proxy Wars",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Korea 38th Parallel"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Vietnam Indochina"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Guerrilla warfare"
        }
      ],
      "fullMissionText": "Milestones 6 & 8 (1950–1975): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw a row of falling dominos stretching across a map of East Asia, or a Huey helicopter landing beside dense jungle • OR • (B) Mind Map: \"Asian Proxy Wars\" (Korea 38th Parallel, Vietnam Indochina, Guerrilla warfare)."
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_6",
      "milestoneBadge": "Milestones 9 & 10 (1989–1991)",
      "date": "1989–1991",
      "title": "The Fall of the Berlin Wall & Collapse of the USSR",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "Mikhail Gorbachev introduces Glasnost and Perestroika; on 9 November 1989, joyous crowds dismantle the Berlin Wall, leading to the peaceful collapse of Eastern European regimes and the 1991 dissolution of the USSR.",
      "sketchPrompt": "Draw joyous crowds standing atop the graffiti-covered Berlin Wall with sledgehammers under the night sky",
      "sketchIdeas": [],
      "conceptTitle": "Fall of the USSR",
      "branches": [
        {
          "label": "Core Mechanism 1",
          "value": "Reagan pressure"
        },
        {
          "label": "Core Mechanism 2",
          "value": "Glasnost/Perestroika"
        },
        {
          "label": "Core Mechanism 3",
          "value": "Wall falls"
        },
        {
          "label": "Core Mechanism 4",
          "value": "1991 dissolution"
        }
      ],
      "fullMissionText": "Milestones 9 & 10 (1989–1991): Turn to Pages 10–11. Choose (A) Creative Sketch: Draw joyous crowds standing atop the graffiti-covered Berlin Wall with sledgehammers under the night sky • OR • (B) Mind Map: \"Fall of the USSR\" (Reagan pressure, Glasnost/Perestroika, Wall falls, 1991 dissolution)."
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_7",
      "milestoneBadge": "Full Living Timeline Synthesis (1945–1991)",
      "date": "1945–1991",
      "title": "Living Timeline Synthesis: Was the Cold War Truly Cold?",
      "pageRef": "Workbook Spread • pp. 10–11",
      "desc": "Across nearly five decades, direct superpower armed conflict was deterred by Mutually Assured Destruction (MAD), but proxy conflicts, arms races, and political repression claimed millions of lives globally.",
      "sketchPrompt": "",
      "sketchIdeas": [],
      "conceptTitle": "",
      "branches": [],
      "fullMissionText": "Full Living Timeline Synthesis (1945–1991): Turn to Pages 10–11. Review all 10 Milestones. Ensure your dual-coding sketches and mind maps are complete across both pages."
    }
  ],
  "weimar_nazi_germany": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1_1",
      "milestoneBadge": "Key Topic KEY TOPIC 1.1",
      "date": "29 Sep 1918",
      "title": "KT1.1: The Origins of the Republic, 1918–1919",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Ludendorff informs the Kaiser the war is lost and urges parliamentary reform to secure lenient terms from Wilson.",
      "sketchPrompt": "1). In the drawing box, sketch Philipp Scheidemann shouting from the Reichstag window alongside the Kaiser fleeing to Holland. Annotate why moderate politicians rushed to declare a democratic republic.",
      "sketchIdeas": [
        "1). In the drawing box, sketch Philipp Scheidemann shouting from the Reichstag window",
        "the Kaiser fleeing to Holland.",
        "why moderate politicians rushed to declare a democratic republic."
      ],
      "conceptTitle": "The Origins of the Republic, 1918–1919",
      "branches": [
        {
          "label": "Date & Context",
          "value": "29 Sep 1918"
        },
        {
          "label": "Core Mechanism",
          "value": "Origins of the Republic: WW1 legacy, abdication of the Kaiser, revolution and armistice; National Assembly and the new constitution; strengths and weaknesses of the constitution."
        },
        {
          "label": "Key Consequence",
          "value": "The Military Collapse"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 1.1). In the drawing box, sketch Philipp Scheidemann shouting from the Reichstag window alongside the Kaiser fleeing to Holland. Annotate why moderate politicians rushed to declare a democratic republic."
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_1_2",
      "milestoneBadge": "Key Topic KEY TOPIC 1.2",
      "date": "5–12 Jan 1919",
      "title": "KT1.2: The Early Challenges to the Weimar Republic, 1919–1923",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Communist revolt in Berlin is crushed by the Freikorps; leaders Rosa Luxemburg and Karl Liebknecht are murdered.",
      "sketchPrompt": "2). In the drawing box, sketch French troops confiscating German coal in the Ruhr alongside a wheelbarrow filled with worthless marks. Label how passive resistance triggered hyperinflation.",
      "sketchIdeas": [
        "2). In the drawing box, sketch French troops confiscating German coal in the Ruhr",
        "a wheelbarrow filled with w",
        "thless marks."
      ],
      "conceptTitle": "The Early Challenges to the Weimar Republic, 1919–1923",
      "branches": [
        {
          "label": "Date & Context",
          "value": "5–12 Jan 1919"
        },
        {
          "label": "Core Mechanism",
          "value": "Early Challenges: Dolchstoßlegende and Versailles; Spartacist Uprising and Kapp Putsch; political assassinations; French occupation of the Ruhr (1923) and hyperinflation."
        },
        {
          "label": "Key Consequence",
          "value": "The Spartacist Uprising"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 1.2). In the drawing box, sketch French troops confiscating German coal in the Ruhr alongside a wheelbarrow filled with worthless marks. Label how passive resistance triggered hyperinflation."
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_1_3",
      "milestoneBadge": "Key Topic KEY TOPIC 1.3",
      "date": "Nov 1923",
      "title": "KT1.3: The Recovery of the Republic, 1924–1929",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Stresemann and Schacht issue the Rentenmark backed by land mortgages, destroying hyperinflation within weeks.",
      "sketchPrompt": "3). In the drawing box, sketch Gustav Stresemann signing the Locarno Pact alongside a bridge connecting Germany to the League of Nations. Label how diplomacy restored Germany's great power status.",
      "sketchIdeas": [
        "3). In the drawing box, sketch Gustav Stresemann signing the Locarno Pact",
        "a bridge connecting Germany to the League of Nations.",
        "how diplomacy rest"
      ],
      "conceptTitle": "The Recovery of the Republic, 1924–1929",
      "branches": [
        {
          "label": "Date & Context",
          "value": "Nov 1923"
        },
        {
          "label": "Core Mechanism",
          "value": "Recovery of the Republic: Stresemann; Rentenmark; Dawes Plan (1924), US loans, Young Plan (1929); Locarno Treaties (1925), League of Nations (1926), Kellogg-Briand (1928)."
        },
        {
          "label": "Key Consequence",
          "value": "The Rentenmark Introduced"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 1.3). In the drawing box, sketch Gustav Stresemann signing the Locarno Pact alongside a bridge connecting Germany to the League of Nations. Label how diplomacy restored Germany's great power status."
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_1_4",
      "milestoneBadge": "Key Topic KEY TOPIC 1.4",
      "date": "Aug 1919",
      "title": "KT1.4: Changes in Society, 1924–1929",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Women gain the vote at 20; by 1926, 32 female deputies sit in the Reichstag, pioneering social rights.",
      "sketchPrompt": "4). In the drawing box, sketch a Bauhaus building alongside an Otto Dix portrait of Berlin cabaret life. Label how avant-garde culture divided urban radicals from rural conservatives.",
      "sketchIdeas": [
        "4). In the drawing box, sketch a Bauhaus building",
        "an Otto Dix p",
        "trait of Berlin cabaret life."
      ],
      "conceptTitle": "Changes in Society, 1924–1929",
      "branches": [
        {
          "label": "Date & Context",
          "value": "Aug 1919"
        },
        {
          "label": "Core Mechanism",
          "value": "Changes in Society: living standards (wages, housing, unemployment insurance 1927); women in politics, work, and leisure; cultural flowering in architecture, art, and cinema."
        },
        {
          "label": "Key Consequence",
          "value": "Article 109 Gender Equality"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 1.4). In the drawing box, sketch a Bauhaus building alongside an Otto Dix portrait of Berlin cabaret life. Label how avant-garde culture divided urban radicals from rural conservatives."
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_2_1",
      "milestoneBadge": "Key Topic KEY TOPIC 2.1",
      "date": "5 Jan 1919",
      "title": "KT2.1: Early Development of the Nazi Party, 1920–1922",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Anton Drexler forms the German Workers' Party; Hitler is dispatched by army intelligence and joins as member 55.",
      "sketchPrompt": "1). In the drawing box, sketch a Munich beer hall meeting with stormtroopers guarding the doors and Hitler speaking from a table. Annotate how theatrical oratory and violence built party support.",
      "sketchIdeas": [
        "1). In the drawing box, sketch a Munich beer hall meeting with st",
        "mtroopers guarding the do",
        "s and Hitler speaking from a table."
      ],
      "conceptTitle": "Early Development of the Nazi Party, 1920–1922",
      "branches": [
        {
          "label": "Date & Context",
          "value": "5 Jan 1919"
        },
        {
          "label": "Core Mechanism",
          "value": "Early Nazi Development: DAP origins under Drexler; Hitler joins and transforms party; 25-Point Programme (1920); SA formation (Brownshirts); party reorganisation and the swastika emblem."
        },
        {
          "label": "Key Consequence",
          "value": "DAP Founded in Munich"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 2.1). In the drawing box, sketch a Munich beer hall meeting with stormtroopers guarding the doors and Hitler speaking from a table. Annotate how theatrical oratory and violence built party support."
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_2_2",
      "milestoneBadge": "Key Topic KEY TOPIC 2.2",
      "date": "8–9 Nov 1923",
      "title": "KT2.2: The Munich Putsch and the Lean Years, 1923–1929",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Hitler hijacks Kahr's meeting and marches on Munich; police fire kills 16 Nazis and the coup collapses.",
      "sketchPrompt": "2). In the drawing box, sketch Hitler in his Landsberg cell dictating Mein Kampf alongside a ballot box. Annotate why Hitler abandoned violent armed coups in favor of democratic elections.",
      "sketchIdeas": [
        "2). In the drawing box, sketch Hitler in his Landsberg cell dictating Mein Kampf",
        "a ballot box.",
        "why Hitler abandoned violent armed coups in fav"
      ],
      "conceptTitle": "The Munich Putsch and the Lean Years, 1923–1929",
      "branches": [
        {
          "label": "Date & Context",
          "value": "8–9 Nov 1923"
        },
        {
          "label": "Core Mechanism",
          "value": "Munich Putsch and Lean Years: Munich Putsch (1923); trial and Landsberg imprisonment; Mein Kampf; party reorganisation; Bamberg Conference (1926); electoral performance in 1928."
        },
        {
          "label": "Key Consequence",
          "value": "The Munich Beer Hall Putsch"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 2.2). In the drawing box, sketch Hitler in his Landsberg cell dictating Mein Kampf alongside a ballot box. Annotate why Hitler abandoned violent armed coups in favor of democratic elections."
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_2_3",
      "milestoneBadge": "Key Topic KEY TOPIC 2.3",
      "date": "24 Oct 1929",
      "title": "KT2.3: The Growth in Support for the Nazis, 1929–1932",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "US banks call in short-term loans; German factories close, banks fail, and mass unemployment begins to surge.",
      "sketchPrompt": "3). In the drawing box, sketch an unemployed worker in soup kitchen queues alongside a Nazi poster promising \"Work and Bread\". Annotate why desperate voters abandoned moderate democracy for radical extremes.",
      "sketchIdeas": [
        "3). In the drawing box, sketch an unemployed w",
        "ker in soup kitchen queues",
        "a Nazi poster promising \"W"
      ],
      "conceptTitle": "The Growth in Support for the Nazis, 1929–1932",
      "branches": [
        {
          "label": "Date & Context",
          "value": "24 Oct 1929"
        },
        {
          "label": "Core Mechanism",
          "value": "Growth in Nazi Support: Wall Street Crash (1929) and economic depression; unemployment; Heinrich Brüning and Article 48; appeal to middle classes, youth, and workers; propaganda under Goebbels."
        },
        {
          "label": "Key Consequence",
          "value": "The Wall Street Crash"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 2.3). In the drawing box, sketch an unemployed worker in soup kitchen queues alongside a Nazi poster promising \"Work and Bread\". Annotate why desperate voters abandoned moderate democracy for radical extremes."
    },
    {
      "lessonIndex": 7,
      "lessonId": "lesson_2_4",
      "milestoneBadge": "Key Topic KEY TOPIC 2.4",
      "date": "30 May 1932",
      "title": "KT2.4: How Hitler Became Chancellor, 1932–1933",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Hindenburg dismisses Brüning over East Prussian land reforms; appoints Franz von Papen to lead the \"Barons\".",
      "sketchPrompt": "4). In the drawing box, sketch Franz von Papen whispering into aged President Hindenburg's ear as Hitler shakes hands on 30 January 1933. Annotate Papen's fateful boast: \"In two months we will have pushed him into a corner!\"",
      "sketchIdeas": [
        "4). In the drawing box, sketch Franz von Papen whispering into aged President Hindenburg's ear as Hitler shakes hands on 30 January 1933.",
        "Papen's fateful boast: \"In two months we will have pushed him into a c",
        "ner!\""
      ],
      "conceptTitle": "How Hitler Became Chancellor, 1932–1933",
      "branches": [
        {
          "label": "Date & Context",
          "value": "30 May 1932"
        },
        {
          "label": "Core Mechanism",
          "value": "Hitler Becomes Chancellor: political developments in 1932; fall of Brüning and Schleicher; roles of Hindenburg and Franz von Papen; the 'backstairs intrigue'; appointment on 30 January 1933."
        },
        {
          "label": "Key Consequence",
          "value": "Brüning Sacked by Hindenburg"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 2.4). In the drawing box, sketch Franz von Papen whispering into aged President Hindenburg's ear as Hitler shakes hands on 30 January 1933. Annotate Papen's fateful boast: \"In two months we will have pushed him into a corner!\""
    },
    {
      "lessonIndex": 8,
      "lessonId": "lesson_3_1",
      "milestoneBadge": "Key Topic KEY TOPIC 3.1",
      "date": "27 Feb 1933",
      "title": "KT3.1: The Creation of a Dictatorship, 1933–1934",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Dutch communist Van der Lubbe is arrested; Hitler claims communist plot; Fire Decree suspends civil liberties.",
      "sketchPrompt": "1). In the drawing box, sketch the burning Reichstag building alongside the SA badge of Ernst Röhm crossed out in red. Annotate how Hitler eliminated both external enemies and internal rivals.",
      "sketchIdeas": [
        "1). In the drawing box, sketch the burning Reichstag building",
        "the SA badge of Ernst Röhm crossed out in red.",
        "how Hitler eliminated both external enemies and internal rivals."
      ],
      "conceptTitle": "The Creation of a Dictatorship, 1933–1934",
      "branches": [
        {
          "label": "Date & Context",
          "value": "27 Feb 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Creation of Dictatorship: Reichstag Fire; Emergency Decree; Enabling Act (1933); Gleichschaltung (trade unions, political parties); Night of the Long Knives; death of Hindenburg and army oath."
        },
        {
          "label": "Key Consequence",
          "value": "The Reichstag Fire"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 3.1). In the drawing box, sketch the burning Reichstag building alongside the SA badge of Ernst Röhm crossed out in red. Annotate how Hitler eliminated both external enemies and internal rivals."
    },
    {
      "lessonIndex": 9,
      "lessonId": "lesson_3_2",
      "milestoneBadge": "Key Topic KEY TOPIC 3.2",
      "date": "22 Mar 1933",
      "title": "KT3.2: The Police State and Religious Control",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Himmler establishes the first model concentration camp near Munich to imprison communist and socialist opponents.",
      "sketchPrompt": "2). In the drawing box, sketch a Gestapo interrogation file alongside a swastika placed on a church altar. Annotate how the regime combined secret terror with control over spiritual life.",
      "sketchIdeas": [
        "2). In the drawing box, sketch a Gestapo interrogation file",
        "a swastika placed on a church altar.",
        "how the regime combined secret terr"
      ],
      "conceptTitle": "The Police State and Religious Control",
      "branches": [
        {
          "label": "Date & Context",
          "value": "22 Mar 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Police State & Religion: SS, SD, and Gestapo; concentration camps (Dachau); legal system and People's Court; policies towards Catholic and Protestant churches; Confessing Church."
        },
        {
          "label": "Key Consequence",
          "value": "Dachau Camp Opens"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 3.2). In the drawing box, sketch a Gestapo interrogation file alongside a swastika placed on a church altar. Annotate how the regime combined secret terror with control over spiritual life."
    },
    {
      "lessonIndex": 10,
      "lessonId": "lesson_3_3",
      "milestoneBadge": "Key Topic KEY TOPIC 3.3",
      "date": "13 Mar 1933",
      "title": "KT3.3: Controlling and Influencing Attitudes",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Joseph Goebbels heads the Ministry of Public Enlightenment and Propaganda, coordinating press, art, and cinema.",
      "sketchPrompt": "3). In the drawing box, sketch a Volksempfänger radio broadcasting Hitler's voice alongside the searchlights of the Nuremberg Cathedral of Light. Annotate how propaganda saturated daily life.",
      "sketchIdeas": [
        "3). In the drawing box, sketch a Volksempfänger radio broadcasting Hitler's voice",
        "the searchlights of the Nuremberg Cathedral of Light.",
        "how propaganda saturated daily life."
      ],
      "conceptTitle": "Controlling and Influencing Attitudes",
      "branches": [
        {
          "label": "Date & Context",
          "value": "13 Mar 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Controlling Attitudes: Goebbels and Propaganda Ministry; censorship of press, radio, literature; rallies and Berlin 1936 Olympics; Reich Chamber of Culture; art, architecture, music."
        },
        {
          "label": "Key Consequence",
          "value": "Propaganda Ministry Created"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 3.3). In the drawing box, sketch a Volksempfänger radio broadcasting Hitler's voice alongside the searchlights of the Nuremberg Cathedral of Light. Annotate how propaganda saturated daily life."
    },
    {
      "lessonIndex": 11,
      "lessonId": "lesson_3_4",
      "milestoneBadge": "Key Topic KEY TOPIC 3.4",
      "date": "May 1934",
      "title": "KT3.4: Opposition, Resistance and Conformity",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Pastor Niemöller and Karl Barth establish Confessional Church, rejecting state control by the Nazi \"German Christians\".",
      "sketchPrompt": "4). In the drawing box, sketch an Edelweiss flower badge alongside illegal jazz records of the Swing Youth. Annotate why young rebels rejected regimented Hitler Youth drills.",
      "sketchIdeas": [
        "4). In the drawing box, sketch an Edelweiss flower badge",
        "illegal jazz rec",
        "ds of the Swing Youth."
      ],
      "conceptTitle": "Opposition, Resistance and Conformity",
      "branches": [
        {
          "label": "Date & Context",
          "value": "May 1934"
        },
        {
          "label": "Core Mechanism",
          "value": "Opposition & Conformity: extent of support and conformity; worker and political underground opposition; youth groups (Edelweiss Pirates, Swing Youth); church resistance (Niemöller, Bonhoeffer, Galen)."
        },
        {
          "label": "Key Consequence",
          "value": "Barmen Declaration"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 3.4). In the drawing box, sketch an Edelweiss flower badge alongside illegal jazz records of the Swing Youth. Annotate why young rebels rejected regimented Hitler Youth drills."
    },
    {
      "lessonIndex": 12,
      "lessonId": "lesson_4_1",
      "milestoneBadge": "Key Topic KEY TOPIC 4.1",
      "date": "1 Jun 1933",
      "title": "KT4.1: Nazi Policies Towards Women",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Newlyweds receive 1,000 RM interest-free loan; 25% cancelled per live child; wife must leave employment.",
      "sketchPrompt": "1). In the drawing box, sketch a Mother's Cross medal alongside a woman working a lathe in a munitions factory. Annotate the contradiction between domestic ideology and military labour demands.",
      "sketchIdeas": [
        "1). In the drawing box, sketch a Mother's Cross medal",
        "a woman w",
        "king a lathe in a munitions fact"
      ],
      "conceptTitle": "Nazi Policies Towards Women",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1 Jun 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Policies Towards Women: views on women and family; marriage laws and loans (1933); Mother’s Cross; Lebensborn; changes in employment (1933–37) and rearmament labor reversal (1937–39)."
        },
        {
          "label": "Key Consequence",
          "value": "Marriage Encouragement Law"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.1). In the drawing box, sketch a Mother's Cross medal alongside a woman working a lathe in a munitions factory. Annotate the contradiction between domestic ideology and military labour demands."
    },
    {
      "lessonIndex": 13,
      "lessonId": "lesson_4_2",
      "milestoneBadge": "Key Topic KEY TOPIC 4.2",
      "date": "Apr 1933",
      "title": "KT4.2: Nazi Policies Towards the Young",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Jewish and anti-Nazi teachers sacked; all educators join the National Socialist Teachers' League (*NSLB*).",
      "sketchPrompt": "2). In the drawing box, sketch a Hitler Youth boy practicing rifle shooting alongside a school mathematics textbook showing bombing trajectory calculations. Annotate how education was completely militarized.",
      "sketchIdeas": [
        "2). In the drawing box, sketch a Hitler Youth boy practicing rifle shooting",
        "a school mathematics textbook showing bombing traject",
        "y calculations."
      ],
      "conceptTitle": "Nazi Policies Towards the Young",
      "branches": [
        {
          "label": "Date & Context",
          "value": "Apr 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Policies Towards the Young: Hitler Youth and League of German Girls (BDM); education policies (curriculum, textbooks); control of teachers (NSLB); elite schools (Napolas)."
        },
        {
          "label": "Key Consequence",
          "value": "Civil Service Law Purges Staff"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.2). In the drawing box, sketch a Hitler Youth boy practicing rifle shooting alongside a school mathematics textbook showing bombing trajectory calculations. Annotate how education was completely militarized."
    },
    {
      "lessonIndex": 14,
      "lessonId": "lesson_4_3",
      "milestoneBadge": "Key Topic KEY TOPIC 4.3",
      "date": "1 Jun 1933",
      "title": "KT4.3: Employment and Living Standards",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Unemployed men aged 18–25 must complete 6 months manual labour building autobahns and clearing land.",
      "sketchPrompt": "3). In the drawing box, sketch a worker shoveling on an autobahn construction site alongside a KdF cruise brochure. Annotate how full employment was paired with long hours and lost strike rights.",
      "sketchIdeas": [
        "3). In the drawing box, sketch a w",
        "ker shoveling on an autobahn construction site",
        "a KdF cruise brochure."
      ],
      "conceptTitle": "Employment and Living Standards",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1 Jun 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Employment & Living Standards: reduction of unemployment (RAD, autobahns, rearmament, conscription); invisible unemployment; Labour Front (DAF), Strength Through Joy (KdF), Beauty of Labour (SdA); real wages vs cost of living."
        },
        {
          "label": "Key Consequence",
          "value": "Reich Labour Service (RAD)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.3). In the drawing box, sketch a worker shoveling on an autobahn construction site alongside a KdF cruise brochure. Annotate how full employment was paired with long hours and lost strike rights."
    },
    {
      "lessonIndex": 15,
      "lessonId": "lesson_4_4",
      "milestoneBadge": "Key Topic KEY TOPIC 4.4",
      "date": "1 Apr 1933",
      "title": "KT4.4: The Persecution of Minorities",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "SA pickets Jewish shops, doctors, and lawyers nationwide; the regime's first coordinated anti-Semitic action.",
      "sketchPrompt": "4). In the drawing box, sketch a Jewish shopfront daubed with \"Jude\" alongside the burning synagogues of Kristallnacht. Annotate the escalation from economic boycotts to violent state pogroms.",
      "sketchIdeas": [
        "4). In the drawing box, sketch a Jewish shopfront daubed with \"Jude\"",
        "the burning synagogues of Kristallnacht.",
        "the escalation from economic boycotts to violent state pogroms."
      ],
      "conceptTitle": "The Persecution of Minorities",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1 Apr 1933"
        },
        {
          "label": "Core Mechanism",
          "value": "Persecution of Minorities: racial hierarchy and Herrenvolk; persecution of disabled, Roma, and homosexuals; anti-Semitic measures (1933 boycott, 1935 Nuremberg Laws, 1938 Kristallnacht)."
        },
        {
          "label": "Key Consequence",
          "value": "Anti-Jewish Boycott"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.4). In the drawing box, sketch a Jewish shopfront daubed with \"Jude\" alongside the burning synagogues of Kristallnacht. Annotate the escalation from economic boycotts to violent state pogroms."
    }
  ],
  "eee": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1_1",
      "milestoneBadge": "Key Topic KEY TOPIC 1.1",
      "date": "1558–1588",
      "title": "The situation on Elizabeth’s accession, 1558",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "How dangerous was the crisis facing Elizabeth I upon her accession in 1558?",
      "sketchPrompt": "In Milestone 1, sketch the Tudor Rose crown and note Elizabeth’s £300,000 inherited debt alongside William Cecil's appointment.",
      "sketchIdeas": [
        "In Milestone 1, sketch the Tudor Rose crown",
        "Elizabeth’s £300,000 inherited debt",
        "William Cecil's appointment."
      ],
      "conceptTitle": "The situation on Elizabeth’s accession, 1558",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Elizabethan government (Monarch, Privy Council, Parliament, Lords Lieutenant, JPs); challenges of gender, legitimacy, and marriage; financial debt; foreign threats from France and Scotland."
        },
        {
          "label": "Enquiry Challenge",
          "value": "How dangerous was the crisis facing Elizabeth I upon her accession in 1558?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 1). In Milestone 1, sketch the Tudor Rose crown and note Elizabeth’s £300,000 inherited debt alongside William Cecil's appointment."
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_1_2",
      "milestoneBadge": "Key Topic KEY TOPIC 1.2",
      "date": "1559",
      "title": "The 'settlement' of religion, 1559",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Was Elizabeth’s Religious Settlement a brilliant compromise or an unstable truce?",
      "sketchPrompt": "In Milestone 2, sketch the open English Book of Common Prayer and note the 1 shilling recusancy fine.",
      "sketchIdeas": [
        "In Milestone 2, sketch the open English Book of Common Prayer",
        "the 1 shilling recusancy fine."
      ],
      "conceptTitle": "The 'settlement' of religion, 1559",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "The Act of Supremacy (1559); the Act of Uniformity (1559); the Royal Injunctions (1559); the Book of Common Prayer; the role of the Church of England."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Was Elizabeth’s Religious Settlement a brilliant compromise or an unstable truce?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 2). In Milestone 2, sketch the open English Book of Common Prayer and note the 1 shilling recusancy fine."
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_1_3",
      "milestoneBadge": "Key Topic KEY TOPIC 1.3",
      "date": "1558–1588",
      "title": "Challenge to the religious settlement",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did both Puritans and traditional Catholics challenge Elizabeth’s Middle Way?",
      "sketchPrompt": "In Milestone 5, sketch the plain Puritan surplice alongside Archbishop Parker's Book of Advertisements.",
      "sketchIdeas": [
        "In Milestone 5, sketch the plain Puritan surplice",
        "Archbishop Parker's Book of Advertisements."
      ],
      "conceptTitle": "Challenge to the religious settlement",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "The nature and extent of the Puritan challenge (vestments and crucifix controversies); the Catholic challenge (the Papacy, Catholic nobility, Recusancy)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did both Puritans and traditional Catholics challenge Elizabeth’s Middle Way?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 5). In Milestone 5, sketch the plain Puritan surplice alongside Archbishop Parker's Book of Advertisements."
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_1_4",
      "milestoneBadge": "Key Topic KEY TOPIC 1.4",
      "date": "1568",
      "title": "The problem of Mary, Queen of Scots",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did the arrival of Mary, Queen of Scots transform English politics into an existential crisis?",
      "sketchPrompt": "In Milestone 6, sketch Carlisle Castle where Mary Stuart was first held under armed house arrest in 1568.",
      "sketchIdeas": [
        "In Milestone 6, sketch Carlisle Castle where Mary Stuart was first held under armed house arrest in 1568."
      ],
      "conceptTitle": "The problem of Mary, Queen of Scots",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Mary, Queen of Scots: claim to the English throne; arrival in England in 1568; relations between Elizabeth and Mary, 1568–69; the Casket Letters inquiry."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did the arrival of Mary, Queen of Scots transform English politics into an existential crisis?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 6). In Milestone 6, sketch Carlisle Castle where Mary Stuart was first held under armed house arrest in 1568."
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_2_1",
      "milestoneBadge": "Key Topic KEY TOPIC 2.1",
      "date": "1569",
      "title": "Plots and revolts at home, 1569–87",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did Catholic plots fail to overthrow Elizabeth between 1569 and 1587?",
      "sketchPrompt": "In Milestone 5, sketch the beer barrel with hidden cipher letters and the execution block at Fotheringhay.",
      "sketchIdeas": [
        "In Milestone 5, sketch the beer barrel with hidden cipher letters",
        "execution block at Fotheringhay."
      ],
      "conceptTitle": "Plots and revolts at home, 1569–87",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Revolt of the Northern Earls (1569); Ridolfi Plot (1571); Throckmorton Plot (1583); Babington Plot (1586); Walsingham’s spy network; execution of Mary Stuart (1587)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did Catholic plots fail to overthrow Elizabeth between 1569 and 1587?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 5). In Milestone 5, sketch the beer barrel with hidden cipher letters and the execution block at Fotheringhay."
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_2_2",
      "milestoneBadge": "Key Topic KEY TOPIC 2.2",
      "date": "1587",
      "title": "Relations with Spain and commercial rivalry",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Was war between England and Spain inevitable from the moment Elizabeth took the throne?",
      "sketchPrompt": "In Milestone 2, sketch Francis Drake's Golden Hind carrying Spanish silver into Plymouth harbour.",
      "sketchIdeas": [
        "In Milestone 2, sketch Francis Drake's Golden Hind carrying Spanish silver into Plymouth harbour."
      ],
      "conceptTitle": "Relations with Spain and commercial rivalry",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Political and religious rivalry; commercial rivalry in the New World; privateering; Sir Francis Drake; raid on Cadiz (1587)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Was war between England and Spain inevitable from the moment Elizabeth took the throne?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 2). In Milestone 2, sketch Francis Drake's Golden Hind carrying Spanish silver into Plymouth harbour."
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_2_3",
      "milestoneBadge": "Key Topic KEY TOPIC 2.3",
      "date": "1585–88",
      "title": "Outbreak of war with Spain, 1585–88",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did English intervention in the Netherlands force Philip II to launch the Armada?",
      "sketchPrompt": "In Milestone 3, sketch English troops landing at Flushing with the flags of the Dutch Protestant rebels.",
      "sketchIdeas": [
        "In Milestone 3, sketch English troops landing at Flushing with the flags of the Dutch Protestant rebels."
      ],
      "conceptTitle": "Outbreak of war with Spain, 1585–88",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "English involvement in the Netherlands (1585–88); role of Robert Dudley; Treaty of Nonsuch; singeing the King of Spain’s beard (Cadiz, 1587)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did English intervention in the Netherlands force Philip II to launch the Armada?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 3). In Milestone 3, sketch English troops landing at Flushing with the flags of the Dutch Protestant rebels."
    },
    {
      "lessonIndex": 7,
      "lessonId": "lesson_2_4",
      "milestoneBadge": "Key Topic KEY TOPIC 2.4",
      "date": "1558–1588",
      "title": "The Spanish Armada, 1588",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Did brilliant English tactics or fatal Spanish blunders defeat the Armada in 1588?",
      "sketchPrompt": "In Milestone 4, sketch the English fireships drifting into the Spanish fleet at Calais Roads.",
      "sketchIdeas": [
        "In Milestone 4, sketch the English fireships drifting into the Spanish fleet at Calais Roads."
      ],
      "conceptTitle": "The Spanish Armada, 1588",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Reasons why Philip II launched the Armada; English and Spanish naval tactics; technology; Battle of Gravelines; the reasons for English victory."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Did brilliant English tactics or fatal Spanish blunders defeat the Armada in 1588?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 4). In Milestone 4, sketch the English fireships drifting into the Spanish fleet at Calais Roads."
    },
    {
      "lessonIndex": 8,
      "lessonId": "lesson_3_1",
      "milestoneBadge": "Key Topic KEY TOPIC 3.1",
      "date": "1558–1588",
      "title": "Education and leisure in Elizabethan England",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Did Elizabethan education and leisure reflect a true \"Golden Age\" for all social classes?",
      "sketchPrompt": "In Milestone 2, sketch James Burbage's 'The Theatre' with groundlings in the pit and nobility in the galleries.",
      "sketchIdeas": [
        "In Milestone 2, sketch James Burbage's 'The Theatre' with groundlings in the pit and nobility in the galleries."
      ],
      "conceptTitle": "Education and leisure in Elizabethan England",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Education in the home, schools and universities; sports and pastimes; the rise of the theatre."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Did Elizabethan education and leisure reflect a true \"Golden Age\" for all social classes?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 2). In Milestone 2, sketch James Burbage's 'The Theatre' with groundlings in the pit and nobility in the galleries."
    },
    {
      "lessonIndex": 9,
      "lessonId": "lesson_3_2",
      "milestoneBadge": "Key Topic KEY TOPIC 3.2",
      "date": "1572",
      "title": "The 'problem' of the poor",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did poverty and vagrancy become the greatest domestic fear in Elizabethan society?",
      "sketchPrompt": "In Milestone 1, sketch the branding iron of the 1572 Vagabonds Act alongside the wool stockpiles of the 1576 Poor Act.",
      "sketchIdeas": [
        "In Milestone 1, sketch the branding iron of the 1572 Vagabonds Act",
        "the wool stockpiles of the 1576 Poor Act."
      ],
      "conceptTitle": "The 'problem' of the poor",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Reasons for increase in poverty and vagabondage; changing attitudes and policies; the 1572 Vagabonds Act; the 1576 Act for Relief of the Poor."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did poverty and vagrancy become the greatest domestic fear in Elizabethan society?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 1). In Milestone 1, sketch the branding iron of the 1572 Vagabonds Act alongside the wool stockpiles of the 1576 Poor Act."
    },
    {
      "lessonIndex": 10,
      "lessonId": "lesson_3_3",
      "milestoneBadge": "Key Topic KEY TOPIC 3.3",
      "date": "1577–80",
      "title": "Exploration and voyages of discovery",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Did Drake circumnavigate the globe for geographic science, national glory, or legalised piracy?",
      "sketchPrompt": "In Milestone 4, sketch Drake's route through the Straits of Magellan up to Nova Albion and around the Cape of Good Hope.",
      "sketchIdeas": [
        "In Milestone 4, sketch Drake's route through the Straits of Magellan up to Nova Albion and around the Cape of Good Hope."
      ],
      "conceptTitle": "Exploration and voyages of discovery",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Factors prompting exploration (technology, sailing, expanding trade); reasons for and significance of Drake’s circumnavigation (1577–80)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Did Drake circumnavigate the globe for geographic science, national glory, or legalised piracy?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 2: Explain Why [12 marks &bull; 18 mins] (12 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 4). In Milestone 4, sketch Drake's route through the Straits of Magellan up to Nova Albion and around the Cape of Good Hope."
    },
    {
      "lessonIndex": 11,
      "lessonId": "lesson_3_4",
      "milestoneBadge": "Key Topic KEY TOPIC 3.4",
      "date": "1585–86",
      "title": "Attempted colonisation of Virginia",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Why did Walter Raleigh’s first American colony at Roanoke collapse into disaster by 1586?",
      "sketchPrompt": "In Milestone 5, sketch the grounded flagship Tiger losing its seed grain and gunpowder on the Outer Banks.",
      "sketchIdeas": [
        "In Milestone 5, sketch the grounded flagship Tiger losing its seed grain and gunpowder on the Outer Banks."
      ],
      "conceptTitle": "Attempted colonisation of Virginia",
      "branches": [
        {
          "label": "Syllabus Focus",
          "value": "Reasons for attempted colonisation; significance of Raleigh; reasons for the failure of the first settlement at Roanoke (1585–86)."
        },
        {
          "label": "Enquiry Challenge",
          "value": "Why did Walter Raleigh’s first American colony at Roanoke collapse into disaster by 1586?"
        },
        {
          "label": "Disciplinary Output",
          "value": "Question 3: Evaluative Essay [16 marks + 4 marks SPaG &bull; 25 mins] (20 marks)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 5). In Milestone 5, sketch the grounded flagship Tiger losing its seed grain and gunpowder on the Outer Banks."
    }
  ],
  "edexcel_medicine": [
    {
      "lessonIndex": 0,
      "lessonId": "lesson_1_1",
      "milestoneBadge": "Milestones 1 & 2 (c. 1250 & 1277)",
      "date": "c1250",
      "title": "KT1.1: Supernatural & Religious Explanations of Disease (c1250–c1500)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Throughout the medieval era between 1250 and 1500, the Roman Catholic Church was the supreme authority governing everyday life, thought, and morality across Western Europe. Ordinary peasants and learned scholars alike believed that disease ...",
      "sketchPrompt": "In the sketchpad frame, sketch the Church scriptorium and annotate the terrifying warning: 'Dissent from Galen is Heresy!'",
      "sketchIdeas": [
        "the Church scriptorium",
        "the terrifying warning: 'Dissent from Galen is Heresy!'"
      ],
      "conceptTitle": "Supernatural & Religious Explanations of Disease (c1250–c1500)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "c1250"
        },
        {
          "label": "Medical Concept",
          "value": "God's Punishment"
        },
        {
          "label": "Significance",
          "value": "Flagellation"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 1 & 2). In the sketchpad frame, sketch the Church scriptorium and annotate the terrifying warning: 'Dissent from Galen is Heresy!'"
    },
    {
      "lessonIndex": 1,
      "lessonId": "lesson_1_2",
      "milestoneBadge": "Milestone 1 (c. 1250)",
      "date": "c1250",
      "title": "KT1.2: Rational Explanations: Hippocrates, Galen & The Four Humours (c1250–c1500)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Alongside religious beliefs, medieval physicians possessed a systematic rational theory inherited from Ancient Greece and Rome. Hippocrates (c.460–c.370 BC) argued that disease was caused by natural, physical imbalances within the body rath...",
      "sketchPrompt": "In the sketchpad frame, sketch the Four Humours wheel and annotate Galen's Theory of Opposites!",
      "sketchIdeas": [
        "the Four Humours wheel",
        "Galen's Theory of Opposites!"
      ],
      "conceptTitle": "Rational Explanations: Hippocrates, Galen & The Four Humours (c1250–c1500)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "c1250"
        },
        {
          "label": "Medical Concept",
          "value": "Four Humours"
        },
        {
          "label": "Significance",
          "value": "Theory of Opposites"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 1). In the sketchpad frame, sketch the Four Humours wheel and annotate Galen's Theory of Opposites!"
    },
    {
      "lessonIndex": 2,
      "lessonId": "lesson_1_3",
      "milestoneBadge": "Milestones 1 & 6 (c. 1250 & 1400s)",
      "date": "c1250",
      "title": "KT1.3: Approaches to Prevention & Treatment: Rituals, Bleeding & Purging (c1250–c1500)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Before any physical medicine was administered, medieval patients sought spiritual pardon. Sickness was understood as a trial sent by God, meaning that medical remedies could not succeed without divine mercy. The primary treatments were ther...",
      "sketchPrompt": "In the sketchpad frame, sketch a fleam and bowl used for bloodletting alongside herbal Theriac!",
      "sketchIdeas": [
        "a fleam and bowl used for bloodletting",
        "herbal Theriac!"
      ],
      "conceptTitle": "Approaches to Prevention & Treatment: Rituals, Bleeding & Purging (c1250–c1500)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "c1250"
        },
        {
          "label": "Medical Concept",
          "value": "Phlebotomy"
        },
        {
          "label": "Significance",
          "value": "Purging"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 1 & 6). In the sketchpad frame, sketch a fleam and bowl used for bloodletting alongside herbal Theriac!"
    },
    {
      "lessonIndex": 3,
      "lessonId": "lesson_1_4",
      "milestoneBadge": "Milestones 6 (1400s)",
      "date": "c1250",
      "title": "KT1.4: Medical Care Providers & Monastic Hospitals: ‘Care Not Cure’ (c1250–c1500)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Medical care in medieval Britain was strictly stratified by social class and wealth. At the top of the hierarchy were university-trained physicians. Educated at Oxford, Cambridge, Paris, or Montpellier, physicians were scholastic scholars w...",
      "sketchPrompt": "In the sketchpad frame, sketch a monastic hospital ward facing a chapel altar and annotate: 'Hospitality and prayer, not medical cure!'",
      "sketchIdeas": [
        "a monastic hospital ward facing a chapel altar",
        ": 'Hospitality and prayer, not medical cure!'"
      ],
      "conceptTitle": "Medical Care Providers & Monastic Hospitals: ‘Care Not Cure’ (c1250–c1500)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "c1250"
        },
        {
          "label": "Medical Concept",
          "value": "Monastic Infirmary"
        },
        {
          "label": "Significance",
          "value": "Barber-Surgeon"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 6). In the sketchpad frame, sketch a monastic hospital ward facing a chapel altar and annotate: 'Hospitality and prayer, not medical cure!'"
    },
    {
      "lessonIndex": 4,
      "lessonId": "lesson_1_5",
      "milestoneBadge": "Milestones 4 & 5 (1348 & 1349)",
      "date": "1348",
      "title": "KT1.5: Case Study: Dealing with the Black Death (1348–1349)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In June 1348, the Black Death (Yersinia pestis) arrived in England aboard merchant trading vessels landing at the Dorset port of Melcombe Regis. The disease presented primarily in two terrifying forms: bubonic plague, spread by fleas living...",
      "sketchPrompt": "In the sketchpad frame, sketch the mass burial pit at East Smithfield and annotate Edward III’s mandate: 'Clean the streets of pestilential filth!'",
      "sketchIdeas": [
        "the mass burial pit at East Smithfield",
        "Edward III’s mandate: 'Clean the streets of pestilential filth!'"
      ],
      "conceptTitle": "Case Study: Dealing with the Black Death (1348–1349)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1348"
        },
        {
          "label": "Medical Concept",
          "value": "Black Death"
        },
        {
          "label": "Significance",
          "value": "Buboes"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 4 & 5). In the sketchpad frame, sketch the mass burial pit at East Smithfield and annotate Edward III’s mandate: 'Clean the streets of pestilential filth!'"
    },
    {
      "lessonIndex": 5,
      "lessonId": "lesson_2_1",
      "milestoneBadge": "Milestones 1 & 5 (1440 & 1662)",
      "date": "c1500",
      "title": "KT2.1: The New Spirit of Enquiry: Humanism, The Printing Press & The Royal Society (c1500–c1700)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Around 1440 in Mainz, Germany, Johannes Gutenberg developed movable metal type, sparking an information revolution across Europe. By 1476, William Caxton had established England’s first commercial press in Westminster. Previously, medical k...",
      "sketchPrompt": "In the sketchpad frame, sketch Gutenberg’s screw press producing identical anatomical plates and annotate the Royal Society's battle-cry: 'Nullius in Verba' (Take nobody's word for it)!",
      "sketchIdeas": [
        "Gutenberg’s screw press producing identical anatomical plates",
        "the Royal Society's battle-cry: 'Nullius in Verba' (Take nobody's word for it)!"
      ],
      "conceptTitle": "The New Spirit of Enquiry: Humanism, The Printing Press & The Royal Society (c1500–c1700)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "c1500"
        },
        {
          "label": "Medical Concept",
          "value": "Monastic Scriptoria"
        },
        {
          "label": "Significance",
          "value": "Movable Metal Type"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 1 & 5). In the sketchpad frame, sketch Gutenberg’s screw press producing identical anatomical plates and annotate the Royal Society's battle-cry: 'Nullius in Verba' (Take nobody's word for it)!"
    },
    {
      "lessonIndex": 6,
      "lessonId": "lesson_2_2",
      "milestoneBadge": "Milestone 8 (1676)",
      "date": "1676",
      "title": "KT2.2: Thomas Sydenham & The Art of Bedside Observation (1676)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "During the mid-seventeenth century, Dr Thomas Sydenham (1624–1689) revolutionised medical practice in London. While most university-trained physicians spent consultations reading Latin textbooks, casting horoscopes, and inspecting urine fla...",
      "sketchPrompt": "In the sketchpad frame, sketch Sydenham recording clinical symptoms at a patient's bedside and annotate his landmark book: Observationes Medicae!",
      "sketchIdeas": [
        "Sydenham recording clinical symptoms at a patient's bedside",
        "his landmark book: Observationes Medicae!"
      ],
      "conceptTitle": "Thomas Sydenham & The Art of Bedside Observation (1676)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1676"
        },
        {
          "label": "Medical Concept",
          "value": "English Hippocrates"
        },
        {
          "label": "Significance",
          "value": "Observationes Medicae (1676)"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 8: 1676). In the sketchpad frame, sketch Sydenham recording clinical symptoms at a patient's bedside and annotate his landmark book: Observationes Medicae!"
    },
    {
      "lessonIndex": 7,
      "lessonId": "lesson_2_3",
      "milestoneBadge": "Milestone 3 (1543)",
      "date": "1543",
      "title": "KT2.3: Andreas Vesalius & The Anatomical Revolution (1543)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Andreas Vesalius (1514–1564), born in Brussels, was appointed Professor of Surgery and Anatomy at the prestigious University of Padua in Italy in 1537 at the remarkable age of twenty-three. Rejecting medieval tradition—where aristocratic pr...",
      "sketchPrompt": "In the sketchpad frame, sketch Vesalius dissecting the human muscular system and annotate his landmark masterwork: De Humani Corporis Fabrica!",
      "sketchIdeas": [
        "Vesalius dissecting the human muscular system",
        "his landmark masterwork: De Humani Corporis Fabrica!"
      ],
      "conceptTitle": "Andreas Vesalius & The Anatomical Revolution (1543)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1543"
        },
        {
          "label": "Medical Concept",
          "value": "De Fabrica (1543)"
        },
        {
          "label": "Significance",
          "value": "Padua Anatomical Theatre"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 3: 1543). In the sketchpad frame, sketch Vesalius dissecting the human muscular system and annotate his landmark masterwork: De Humani Corporis Fabrica!"
    },
    {
      "lessonIndex": 8,
      "lessonId": "lesson_2_4",
      "milestoneBadge": "Milestone 4 (1628)",
      "date": "1628",
      "title": "KT2.4: William Harvey & The Circulation of the Blood (1628)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "English physician William Harvey (1578–1657) studied medicine at the University of Padua under Hieronymus Fabricius, who discovered that human veins contained one-way valves. Returning to London, Harvey was appointed Physician to St Barthol...",
      "sketchPrompt": "In the sketchpad frame, sketch the famous arm ligature experiment showing vein valves and annotate: De Motu Cordis (1628)!",
      "sketchIdeas": [
        "the famous arm ligature experiment showing vein valves",
        ": De Motu Cordis (1628)!"
      ],
      "conceptTitle": "William Harvey & The Circulation of the Blood (1628)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1628"
        },
        {
          "label": "Medical Concept",
          "value": "De Motu Cordis (1628)"
        },
        {
          "label": "Significance",
          "value": "Mechanical Pump"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 4: 1628). In the sketchpad frame, sketch the famous arm ligature experiment showing vein valves and annotate: De Motu Cordis (1628)!"
    },
    {
      "lessonIndex": 9,
      "lessonId": "lesson_2_5",
      "milestoneBadge": "Milestone 6 (1665)",
      "date": "1665",
      "title": "KT2.5: Continuity in Treatment & The Great Plague of London (1665)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In the spring of 1665, bubonic plague struck London with ferocity. Originating in the squalid suburban parish of St Giles-in-the-Fields, the epidemic exploded during an unusually hot, dry summer. Between June and November 1665, an estimated...",
      "sketchPrompt": "In the sketchpad frame, sketch a plague doctor wearing the beak mask and annotate the red cross on a quarantined door: 'Lord have mercy upon us'!",
      "sketchIdeas": [
        "a plague doctor wearing the beak mask",
        "the red cross on a quarantined door: 'Lord have mercy upon us'!"
      ],
      "conceptTitle": "Continuity in Treatment & The Great Plague of London (1665)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1665"
        },
        {
          "label": "Medical Concept",
          "value": "Bills of Mortality"
        },
        {
          "label": "Significance",
          "value": "Municipal Quarantine"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestone 6: 1665). In the sketchpad frame, sketch a plague doctor wearing the beak mask and annotate the red cross on a quarantined door: 'Lord have mercy upon us'!"
    },
    {
      "lessonIndex": 10,
      "lessonId": "lesson_3_1",
      "milestoneBadge": "Milestones 6 & 8 (1861 & 1882)",
      "date": "1861",
      "title": "KT3.1: Ideas on Causes: Pasteur’s Germ Theory & Koch’s Microbe Hunters (c.1861–c.1883)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "At the dawn of the 1860s, European understanding of disease causation was mired in intellectual confusion. While Antonie van Leeuwenhoek had observed microscopic \"animalcules\" in 1676, natural philosophers assumed these organisms were harml...",
      "sketchPrompt": "In the sketchpad frame, sketch Pasteur’s swan-neck flask experiment and Koch’s agar plate. Annotate the decisive turning point: 'Air does not generate life; microscopic airborne pathogens cause decay and disease!'",
      "sketchIdeas": [
        "Pasteur’s swan-neck flask experiment and Koch’s agar plate. Annotate the decisive turning point: 'Air does not generate life; microscopic airborne pathogens cause decay and disease!'"
      ],
      "conceptTitle": "Ideas on Causes: Pasteur’s Germ Theory & Koch’s Microbe Hunters (c.1861–c.1883)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1861"
        },
        {
          "label": "Medical Concept",
          "value": "Spontaneous Generation"
        },
        {
          "label": "Significance",
          "value": "Germ Theory (1861)"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 6 & 8). In the sketchpad frame, sketch Pasteur’s swan-neck flask experiment and Koch’s agar plate. Annotate the decisive turning point: 'Air does not generate life; microscopic airborne pathogens cause decay and disease!'"
    },
    {
      "lessonIndex": 11,
      "lessonId": "lesson_3_2",
      "milestoneBadge": "Milestones 1 & 7 (1796 & 1852)",
      "date": "1796",
      "title": "KT3.2: Approaches to Prevention: Edward Jenner & The Smallpox Vaccine (1796–1853)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "Throughout the eighteenth century, smallpox (*Variola major*) was the most terrifying epidemic killer in Britain. An airborne viral infection that spread effortlessly through crowded tenements, smallpox killed an estimated 40,000 people in ...",
      "sketchPrompt": "In the sketchpad frame, sketch milkmaid Sarah Nelmes and young James Phipps. Annotate the historic transition from dangerous inoculation to compulsory vaccination under the 1852 Act!",
      "sketchIdeas": [
        "milkmaid Sarah Nelmes and young James Phipps. Annotate the historic transition from dangerous inoculation to compulsory vaccination under the 1852 Act!"
      ],
      "conceptTitle": "Approaches to Prevention: Edward Jenner & The Smallpox Vaccine (1796–1853)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1796"
        },
        {
          "label": "Medical Concept",
          "value": "Inoculation (Variolation)"
        },
        {
          "label": "Significance",
          "value": "Vaccination"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 1 & 7). In the sketchpad frame, sketch milkmaid Sarah Nelmes and young James Phipps. Annotate the historic transition from dangerous inoculation to compulsory vaccination under the 1852 Act!"
    },
    {
      "lessonIndex": 12,
      "lessonId": "lesson_3_3",
      "milestoneBadge": "Milestones 4 & 5 (1854 & 1860)",
      "date": "1854",
      "title": "KT3.3: Improvements in Hospital Care: Florence Nightingale, Mary Seacole & The Sanitary Revolution (1854–1863)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In the first half of the nineteenth century, British hospitals were squalid, dangerous institutions. Rather than centers of cure, municipal voluntary hospitals and poor law infirmaries were regarded by the working classes as \"death houses\" ...",
      "sketchPrompt": "In the sketchpad frame, sketch Nightingale’s pavilion ward with facing cross-ventilation windows and her famous 1858 Polar Area Coxcomb chart proving sanitary reform saved lives!",
      "sketchIdeas": [
        "Nightingale’s pavilion ward with facing cross-ventilation windows and her famous 1858 Polar Area Coxcomb chart proving sanitary reform saved lives!"
      ],
      "conceptTitle": "Improvements in Hospital Care: Florence Nightingale, Mary Seacole & The Sanitary Revolution (1854–1863)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1854"
        },
        {
          "label": "Medical Concept",
          "value": "Hospitalism"
        },
        {
          "label": "Significance",
          "value": "Scutari Barrack Hospital"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 4 & 5). In the sketchpad frame, sketch Nightingale’s pavilion ward with facing cross-ventilation windows and her famous 1858 Polar Area Coxcomb chart proving sanitary reform saved lives!"
    },
    {
      "lessonIndex": 13,
      "lessonId": "lesson_3_4",
      "milestoneBadge": "Milestones 2 & 7 (1847 & 1865)",
      "date": "1847",
      "title": "KT3.4: The Surgical Revolution: Simpson, Lister & The Conquest of Pain and Sepsis (1847–1870s)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In the early decades of the nineteenth century, surgery was an ordeal of unimaginable agony. Surgeons faced three insurmountable physiological barriers: *Pain*, *Infection*, and *Bleeding*. Because there were no effective anaesthetics, oper...",
      "sketchPrompt": "In the sketchpad frame, sketch Simpson testing chloroform and Lister’s donkey carbolic spray. Annotate how conquering pain and sepsis transformed surgery from a 30-second butchery into an aseptic science!",
      "sketchIdeas": [
        "Simpson testing chloroform and Lister’s donkey carbolic spray. Annotate how conquering pain and sepsis transformed surgery from a 30-second butchery into an aseptic science!"
      ],
      "conceptTitle": "The Surgical Revolution: Simpson, Lister & The Conquest of Pain and Sepsis (1847–1870s)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1847"
        },
        {
          "label": "Medical Concept",
          "value": "Chloroform (1847)"
        },
        {
          "label": "Significance",
          "value": "The \"Black Period\" of Surgery"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 2 & 7). In the sketchpad frame, sketch Simpson testing chloroform and Lister’s donkey carbolic spray. Annotate how conquering pain and sepsis transformed surgery from a 30-second butchery into an aseptic science!"
    },
    {
      "lessonIndex": 14,
      "lessonId": "lesson_3_5",
      "milestoneBadge": "Milestones 3, 4 & 7 (1848, 1854 & 1875)",
      "date": "1875",
      "title": "KT3.5: Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "During the rapid industrialization of the early nineteenth century, British cities expanded at terrifying speed. Millions of rural laborers migrated into factory towns like Manchester, Leeds, and London, crammed into unpaved, back-to-back s...",
      "sketchPrompt": "In the sketchpad frame, sketch the removed Broad Street pump handle and Bazalgette’s massive underground sewer arches. Annotate the death of laissez-faire with the compulsory 1875 Public Health Act!",
      "sketchIdeas": [
        "the removed Broad Street pump handle and Bazalgette’s massive underground sewer arches. Annotate the death of laissez-faire with the compulsory 1875 Public Health Act!"
      ],
      "conceptTitle": "Public Health & Cholera: John Snow, The Broad Street Pump & The 1875 Public Health Act (1854–1875)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1875"
        },
        {
          "label": "Medical Concept",
          "value": "Cholera"
        },
        {
          "label": "Significance",
          "value": "Laissez-faire"
        }
      ],
      "fullMissionText": "Turn back to Pages 2–3 (Milestones 3, 4 & 7). In the sketchpad frame, sketch the removed Broad Street pump handle and Bazalgette’s massive underground sewer arches. Annotate the death of laissez-faire with the compulsory 1875 Public Health Act!"
    },
    {
      "lessonIndex": 15,
      "lessonId": "lesson_4_1",
      "milestoneBadge": "Key Topic 4.1",
      "date": "1953",
      "title": "KT4.1: Ideas on Causes: Genetics, DNA & The Human Genome Project (c.1953–present)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "By the opening decades of the twentieth century, Louis Pasteur and Robert Koch’s Germ Theory had conquered infectious medicine, explaining how external bacteria caused cholera, tuberculosis, and anthrax. Yet physicians were confronted by a ...",
      "sketchPrompt": "1). In the drawing box, sketch Franklin’s Photograph 51 cross pattern and Watson & Crick’s double helix model. Annotate how base pairing unlocked the causes of hereditary disease!",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Key Topic 4.1). In the drawing box, sketch Franklin’s Photograph 51 cross pattern and Watson & Crick’s double helix model. Annotate how base pairing unlocked the causes of hereditary disease!"
      ],
      "conceptTitle": "Ideas on Causes: Genetics, DNA & The Human Genome Project (c.1953–present)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1953"
        },
        {
          "label": "Medical Concept",
          "value": "DNA (Deoxyribonucleic Acid)"
        },
        {
          "label": "Significance",
          "value": "X-ray Crystallography"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.1). In the drawing box, sketch Franklin’s Photograph 51 cross pattern and Watson & Crick’s double helix model. Annotate how base pairing unlocked the causes of hereditary disease!"
    },
    {
      "lessonIndex": 16,
      "lessonId": "lesson_4_2",
      "milestoneBadge": "Key Topic 4.2",
      "date": "1900",
      "title": "KT4.2: Lifestyle Factors & The Technological Revolution in Diagnosis (c.1900–present)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In 1895, physician diagnostics remained trapped on the exterior of the living body: doctors tapped chests, smelled urine, and took pulses, but could only discover internal fractures, bullets, or tumors through agonizing exploratory knife su...",
      "sketchPrompt": "2). In the drawing box, sketch Bertha Röntgen’s hand X-ray and Godfrey Hounsfield’s circular CT scanner. Annotate how scanning permanently ended blind exploratory surgery!",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Key Topic 4.2). In the drawing box, sketch Bertha Röntgen’s hand X-ray and Godfrey Hounsfield’s circular CT scanner. Annotate how scanning permanently ended blind exploratory surgery!"
      ],
      "conceptTitle": "Lifestyle Factors & The Technological Revolution in Diagnosis (c.1900–present)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1900"
        },
        {
          "label": "Medical Concept",
          "value": "X-ray"
        },
        {
          "label": "Significance",
          "value": "CT Scanner (Computed Tomography)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.2). In the drawing box, sketch Bertha Röntgen’s hand X-ray and Godfrey Hounsfield’s circular CT scanner. Annotate how scanning permanently ended blind exploratory surgery!"
    },
    {
      "lessonIndex": 17,
      "lessonId": "lesson_4_3",
      "milestoneBadge": "Key Topic 4.3",
      "date": "1909",
      "title": "KT4.3: The Search for Magic Bullets, High-Tech Treatments & The Birth of the NHS (1909–1948)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "By the opening decade of the twentieth century, bacteriology had successfully unmasked the microbial culprits behind tuberculosis, cholera, and diphtheria. Yet physicians found themselves crippled by an agonizing limitation known as the *Di...",
      "sketchPrompt": "3). In the drawing box, sketch Ehrlich’s test tube of Salvarsan 606 and the 1948 NHS information leaflet. Annotate how free healthcare abolished medical poverty!",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Key Topic 4.3). In the drawing box, sketch Ehrlich’s test tube of Salvarsan 606",
        "1948 NHS information leaflet. Annotate how free healthcare abolished medical poverty!"
      ],
      "conceptTitle": "The Search for Magic Bullets, High-Tech Treatments & The Birth of the NHS (1909–1948)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1909"
        },
        {
          "label": "Medical Concept",
          "value": "Magic Bullet"
        },
        {
          "label": "Significance",
          "value": "Salvarsan 606"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.3). In the drawing box, sketch Ehrlich’s test tube of Salvarsan 606 and the 1948 NHS information leaflet. Annotate how free healthcare abolished medical poverty!"
    },
    {
      "lessonIndex": 18,
      "lessonId": "lesson_4_4",
      "milestoneBadge": "Key Topic 4.4",
      "date": "1928",
      "title": "KT4.4: Case Study 1: The Antibiotic Revolution: Fleming, Florey & Chain and Penicillin (1928–1945)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "During the First World War, Scottish bacteriologist Alexander Fleming witnessed thousands of soldiers die from wound sepsis in French military hospitals. Fleming recognized that standard chemical antiseptics like carbolic acid did more harm...",
      "sketchPrompt": "4). In the drawing box, sketch Fleming’s contaminated petri dish and an American 10,000-gallon deep-tank vat. Annotate how penicillin saved Allied troops on D-Day!",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Key Topic 4.4). In the drawing box, sketch Fleming’s contaminated petri dish and an American 10,000-gallon deep-tank vat. Annotate how penicillin saved Allied troops on D-Day!"
      ],
      "conceptTitle": "Case Study 1: The Antibiotic Revolution: Fleming, Florey & Chain and Penicillin (1928–1945)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1928"
        },
        {
          "label": "Medical Concept",
          "value": "Penicillin"
        },
        {
          "label": "Significance",
          "value": "Antibiotic"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.4). In the drawing box, sketch Fleming’s contaminated petri dish and an American 10,000-gallon deep-tank vat. Annotate how penicillin saved Allied troops on D-Day!"
    },
    {
      "lessonIndex": 19,
      "lessonId": "lesson_4_5",
      "milestoneBadge": "Key Topic 4.5",
      "date": "1950",
      "title": "KT4.5: Case Study 2: Public Health & The Fight Against Lung Cancer (c.1950–present)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "At the turn of the twentieth century, carcinoma of the lung was an extraordinarily rare clinical pathology in Great Britain, with major London teaching hospitals recording fewer than ten cases annually. By 1950, however, lung cancer had eru...",
      "sketchPrompt": "5). In the drawing box, sketch a 1950s doctor cigarette advert and a 2016 olive-green plain pack. Annotate how state legislation slashed smoking from 65% to under 13%!",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Key Topic 4.5). In the drawing box, sketch a 1950s doctor cigarette advert and a 2016 olive-green plain pack. Annotate how state legislation slashed smoking from 65% to under 13%!"
      ],
      "conceptTitle": "Case Study 2: Public Health & The Fight Against Lung Cancer (c.1950–present)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1950"
        },
        {
          "label": "Medical Concept",
          "value": "Carcinoma"
        },
        {
          "label": "Significance",
          "value": "Epidemiology"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Key Topic 4.5). In the drawing box, sketch a 1950s doctor cigarette advert and a 2016 olive-green plain pack. Annotate how state legislation slashed smoking from 65% to under 13%!"
    },
    {
      "lessonIndex": 20,
      "lessonId": "lesson_5_1",
      "milestoneBadge": "Western Front Milestone 1",
      "date": "1914",
      "title": "KT5.1: The Theatre of War: The British Sector, Trench Geography & Battles (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In August 1914, the British Expeditionary Force (BEF) deployed to France expecting a war of rapid movement, sweeping cavalry maneuvers, and decisive open-field engagements. However, the lethal reality of modern industrialized firepower imme...",
      "sketchPrompt": "Sketch and annotate the zig-zag traverse pattern and low-lying Ypres water table.",
      "sketchIdeas": [
        "🩺 Diagnostic symbol",
        "💊 Treatment breakthrough",
        "🔬 Microscopic pathogen"
      ],
      "conceptTitle": "The Theatre of War: The British Sector, Trench Geography & Battles (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "Frontline Trench"
        },
        {
          "label": "Significance",
          "value": "Communication Trench"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 1). Sketch and annotate the zig-zag traverse pattern and low-lying Ypres water table."
    },
    {
      "lessonIndex": 21,
      "lessonId": "lesson_5_2",
      "milestoneBadge": "Western Front Milestone 2",
      "date": "1914",
      "title": "KT5.2: The Trench Environment: Mud, Vermin & Non-Combat Illnesses (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "The physical geography of northern France and Flanders exerted a relentless, hostile pressure on the health of the British Army. The coastal plains of Belgium and northern France were naturally low-lying, reclaimed marshland underlain by im...",
      "sketchPrompt": "Draw soldiers applying whale oil and delousing garments in steam ovens.",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Milestone 2). Draw soldiers applying whale oil and delousing garments in steam ovens."
      ],
      "conceptTitle": "The Trench Environment: Mud, Vermin & Non-Combat Illnesses (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "Trench Foot"
        },
        {
          "label": "Significance",
          "value": "Whale Oil"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 2). Draw soldiers applying whale oil and delousing garments in steam ovens."
    },
    {
      "lessonIndex": 22,
      "lessonId": "lesson_5_3",
      "milestoneBadge": "Western Front Milestone 3",
      "date": "1914",
      "title": "KT5.3: Battlefield Trauma: High Explosive Shrapnel, Gas Attacks & Infection (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "The nature of battlefield wounds on the Western Front was dictated by the catastrophic supremacy of modern industrial artillery. Unlike previous nineteenth-century conflicts where rifle musket balls inflicted the majority of injuries, over ...",
      "sketchPrompt": "Sketch the Brodie steel helmet and British PH gas hood.",
      "sketchIdeas": [
        "🩺 Diagnostic symbol",
        "💊 Treatment breakthrough",
        "🔬 Microscopic pathogen"
      ],
      "conceptTitle": "Battlefield Trauma: High Explosive Shrapnel, Gas Attacks & Infection (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "High-Explosive Shell"
        },
        {
          "label": "Significance",
          "value": "Gas Gangrene"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 2). Sketch the Brodie steel helmet and British PH gas hood."
    },
    {
      "lessonIndex": 23,
      "lessonId": "lesson_5_4",
      "milestoneBadge": "Western Front Milestone 4",
      "date": "1914",
      "title": "KT5.4: The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations & CCS (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In the brutal arithmetic of the Western Front, casualty survival was a desperate race against time. Because the manured soil of Flanders and northern France was teeming with virulent anaerobic bacteria that caused fatal gas gangrene within ...",
      "sketchPrompt": "Draw the 6 sequential stages of the Chain of Evacuation.",
      "sketchIdeas": [
        "Turn to Pages 2–3 (Milestone 5). Draw the 6 sequential stages of the Chain of Evacuation."
      ],
      "conceptTitle": "The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations & CCS (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "Chain of Evacuation"
        },
        {
          "label": "Significance",
          "value": "Regimental Aid Post (RAP)"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 5). Draw the 6 sequential stages of the Chain of Evacuation."
    },
    {
      "lessonIndex": 24,
      "lessonId": "lesson_5_5",
      "milestoneBadge": "Western Front Milestone 5",
      "date": "1914",
      "title": "KT5.5: Surgical Breakthroughs: The Thomas Splint, Wound Debridement & Mobile X-Rays (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "In autumn 1914, British military surgeons confronted an acute sepsis crisis that peacetime civilian training could not resolve. In nineteenth-century hospitals, Joseph Lister’s antiseptic techniques had controlled surface contamination; on ...",
      "sketchPrompt": "Sketch the Thomas Splint groin ring and traction cord.",
      "sketchIdeas": [
        "🩺 Diagnostic symbol",
        "💊 Treatment breakthrough",
        "🔬 Microscopic pathogen"
      ],
      "conceptTitle": "Surgical Breakthroughs: The Thomas Splint, Wound Debridement & Mobile X-Rays (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "Compound Fracture"
        },
        {
          "label": "Significance",
          "value": "Thomas Splint"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 3). Sketch the Thomas Splint groin ring and traction cord."
    },
    {
      "lessonIndex": 25,
      "lessonId": "lesson_5_6",
      "milestoneBadge": "Western Front Milestone 6",
      "date": "1914",
      "title": "KT5.6: Lifesaving Innovations: Blood Storage, Brain Surgery & Plastic Reconstruction (1914–1918)",
      "pageRef": "Workbook Pages 2–3 • Living Timeline",
      "desc": "As artillery firepower intensified across the Western Front between 1914 and 1916, military surgeons confronted forms of trauma that pushed human physiology to its breaking point. The most immediate killer of wounded soldiers was **haemorrh...",
      "sketchPrompt": "Sketch Oswald Robertson’s iced blood chest and Harold Gillies’ tubed pedicle.",
      "sketchIdeas": [
        "🩺 Diagnostic symbol",
        "💊 Treatment breakthrough",
        "🔬 Microscopic pathogen"
      ],
      "conceptTitle": "Lifesaving Innovations: Blood Storage, Brain Surgery & Plastic Reconstruction (1914–1918)",
      "branches": [
        {
          "label": "Date & Context",
          "value": "1914"
        },
        {
          "label": "Medical Concept",
          "value": "Sodium Citrate"
        },
        {
          "label": "Significance",
          "value": "Blood Depot"
        }
      ],
      "fullMissionText": "Turn to Pages 2–3 (Milestone 6). Sketch Oswald Robertson’s iced blood chest and Harold Gillies’ tubed pedicle."
    }
  ]
};
