/**
 * ARENA STANDOFF REGISTRY
 * Dedicated Master Registry of Historical Shoulder-Partner Duels & Historiographical Debates.
 * 
 * DESIGN PRINCIPLES:
 * 1. 100% Curated Historical Opposing Factions - Eliminates nonsensical pairings like "Israel & Syria vs Nasser".
 * 2. Strict Pedagogical Ethics Guardrail for Sensitive Topics (e.g. The Shoah / Holocaust):
 *    - Pupils NEVER roleplay perpetrators defending atrocities or debate victims.
 *    - Instead, automatically pivots to a "Historiographical Duel" between competing historical schools (e.g. Functionalism vs Intentionalism).
 * 3. Exam Specification Grounding:
 *    - Targets Edexcel GCSE Paper 2, Paper 3, and KS3 disciplinary enquiry questions.
 *    - Provides high-yield terminology, authentic historical objectives, and sharp oral sentence starters.
 */

export const ARENA_STANDOFF_REGISTRY = {
  // ==========================================
  // CME_NEW (Conflict in the Middle East 1945-1995)
  // ==========================================
  cme_new: {
    lesson_1: {
      title: "British Imperial Diplomacy vs. Arab National Sovereignty",
      subtitle: "Imperial Pledges & Conflicting Borders (1915–1945)",
      roleA: {
        name: "Sir Henry McMahon & British Imperial Cabinet",
        title: "Wartime Strategy & Imperial Commitments",
        objective: "Defend British diplomatic promises (McMahon-Hussein & Balfour Declaration) as vital wartime diplomacy to defeat the Ottomans, protect the Suez Canal, and balance competing geopolitical interests.",
        starter: "&ldquo;British imperial policy had to balance conflicting wartime commitments because...&rdquo;",
        keyTerms: ["McMahon-Hussein Correspondence", "Balfour Declaration", "Sykes-Picot Agreement", "League of Nations Mandate"]
      },
      roleB: {
        name: "Sharif Hussein of Mecca & Arab Nationalist Movement",
        title: "Arab Independence & The Betrayal of Imperial Partition",
        objective: "Argue that Britain deliberately misled the Arab Revolt by promising independent sovereignty while secretly dividing Arab lands into European colonial zones.",
        starter: "&ldquo;Britain’s contradictory promises shattered our trust and created generational conflict because...&rdquo;",
        keyTerms: ["Arab Revolt", "Self-Determination", "Secret Partition", "Imperial Betrayal"]
      }
    },
    lesson_2: {
      title: "David Ben-Gurion (Jewish Agency) vs. Arab Higher Committee",
      subtitle: "The End of the Mandate & The 1947 UN Partition Plan",
      roleA: {
        name: "David Ben-Gurion & Jewish Agency",
        title: "Existential Right to a Sovereign Jewish Homeland",
        objective: "Argue that following the Holocaust, a sovereign Jewish state was an existential necessity, and defend acceptance of the 1947 UN Partition Plan (Resolution 181).",
        starter: "&ldquo;After the catastrophic murder of six million European Jews, a sovereign homeland was our only safeguard because...&rdquo;",
        keyTerms: ["UN Resolution 181", "Holocaust Survivors", "Jewish Statehood", "Exodus 1947"]
      },
      roleB: {
        name: "The Arab Higher Committee & Arab League",
        title: "Rejection of Partition & Defense of Palestinian Majority Rights",
        objective: "Argue that the 1947 UN Partition Plan was inherently unjust, allocating over 55% of Palestine to a Jewish minority that owned under 7% of the land without consulting the indigenous population.",
        starter: "&ldquo;The UN Partition Plan was illegitimate and completely unfair to the indigenous Arab majority because...&rdquo;",
        keyTerms: ["Self-Determination", "Unfair Land Allocation", "Colonial Imposition", "Rejection of Partition"]
      }
    },
    lesson_3: {
      title: "Palestinian Arab Refugees vs. Israeli Provisional Government",
      subtitle: "The 1948–49 War & The Palestinian Refugee Crisis (Nakba)",
      roleA: {
        name: "Palestinian Arab Refugees & Arab Delegations",
        title: "The Right of Return & The Tragedy of the Nakba",
        objective: "Argue that 700,000 Palestinians were forcibly expelled or fled in terror from their ancestral homes (under UN Resolution 194) and must be granted the right to return and compensation.",
        starter: "&ldquo;Our people were driven from their ancestral villages by military force and terror, and international law demands our return because...&rdquo;",
        keyTerms: ["The Nakba", "UN Resolution 194", "Right of Return", "Deir Yassin"]
      },
      roleB: {
        name: "The Israeli Government & IDF Command",
        title: "National Survival & Security of the New State",
        objective: "Argue that Arab leaders provoked the 1948 war by invading Israel, and that admitting hundreds of thousands of hostile refugees would destroy the newly born Jewish state from within.",
        starter: "&ldquo;Israel fought a desperate war for survival provoked by five invading Arab armies, and we cannot absorb hostile populations because...&rdquo;",
        keyTerms: ["Arab Invasion", "War for Survival", "Absorbing Jewish Refugees", "State Security"]
      }
    },
    lesson_4: {
      title: "President Gamal Abdel Nasser vs. Prime Minister Anthony Eden",
      subtitle: "The 1956 Suez Crisis & Nationalisation of the Canal",
      roleA: {
        name: "President Gamal Abdel Nasser (Egypt)",
        title: "Nationalisation of the Suez Canal & Anti-Imperialism",
        objective: "Defend nationalising the Suez Canal as a sovereign Egyptian right to fund the Aswan High Dam and eliminate Western colonial domination.",
        starter: "&ldquo;The Suez Canal runs through Egyptian soil, was dug by Egyptian labor, and our national sovereignty gave us the right to take it because...&rdquo;",
        keyTerms: ["Nationalisation", "Aswan High Dam", "Anti-Imperialism", "Pan-Arab Leadership"]
      },
      roleB: {
        name: "Prime Minister Anthony Eden (Britain & France)",
        title: "Defense of International Waterways & Protocol of Sèvres",
        objective: "Argue that Nasser was an aggressive dictator threatening vital global trade routes and oil supplies to Europe, justifying Anglo-French military intervention.",
        starter: "&ldquo;An unprovoked seizure of an international maritime artery by a hostile dictator could not be tolerated because...&rdquo;",
        keyTerms: ["Freedom of Navigation", "Protocol of Sèvres", "Oil Lifeline", "Aggressive Dictatorship"]
      }
    },
    // Lesson 5 in course flow (ID: lesson_6 in data.js) - THE USER'S SCREENSHOT ISSUE!
    lesson_6: {
      title: "President Nasser (Egypt & Arab League) vs. Prime Minister Levi Eshkol (State of Israel)",
      subtitle: "The Battle for Water, Arab Mobilisation & The Straits of Tiran (1964–1967)",
      roleA: {
        name: "President Gamal Abdel Nasser (Egypt & Arab League)",
        title: "Pan-Arab Sovereignty & River Jordan Water Diversion",
        objective: "Defend Arab rights to divert the River Jordan headwaters, rally Arab solidarity around the newly founded PLO, and assert legitimate regional leadership against Israeli military expansion.",
        starter: "&ldquo;Arab sovereignty and the security of our people demanded that we stop Israeli expansion because...&rdquo;",
        keyTerms: ["1964 Cairo Conference", "PLO Founded", "River Jordan Diversion", "Pan-Arab Unity"]
      },
      roleB: {
        name: "Prime Minister Levi Eshkol & IDF Command (State of Israel)",
        title: "The National Water Carrier & Freedom of Navigation",
        objective: "Argue that cutting off Israel's National Water Carrier was an existential threat to national survival, and cross-border guerrilla raids justified decisive military defense.",
        starter: "&ldquo;Your attempt to cut off our nation's water supply and sponsor terrorist raids was an intolerable provocation because...&rdquo;",
        keyTerms: ["National Water Carrier", "Water Security", "Fatah Cross-Border Raids", "Casus Belli"]
      }
    },
    lesson_5: { // Alias for lesson_6 to handle 1-based index lookups
      title: "President Nasser (Egypt & Arab League) vs. Prime Minister Levi Eshkol (State of Israel)",
      subtitle: "The Battle for Water, Arab Mobilisation & The Straits of Tiran (1964–1967)",
      roleA: {
        name: "President Gamal Abdel Nasser (Egypt & Arab League)",
        title: "Pan-Arab Sovereignty & River Jordan Water Diversion",
        objective: "Defend Arab rights to divert the River Jordan headwaters, rally Arab solidarity around the newly founded PLO, and assert legitimate regional leadership against Israeli military expansion.",
        starter: "&ldquo;Arab sovereignty and the security of our people demanded that we stop Israeli expansion because...&rdquo;",
        keyTerms: ["1964 Cairo Conference", "PLO Founded", "River Jordan Diversion", "Pan-Arab Unity"]
      },
      roleB: {
        name: "Prime Minister Levi Eshkol & IDF Command (State of Israel)",
        title: "The National Water Carrier & Freedom of Navigation",
        objective: "Argue that cutting off Israel's National Water Carrier was an existential threat to national survival, and cross-border guerrilla raids justified decisive military defense.",
        starter: "&ldquo;Your attempt to cut off our nation's water supply and sponsor terrorist raids was an intolerable provocation because...&rdquo;",
        keyTerms: ["National Water Carrier", "Water Security", "Fatah Cross-Border Raids", "Casus Belli"]
      }
    },
    lesson_7: {
      title: "President Nasser (Egypt) vs. General Moshe Dayan (Israel)",
      subtitle: "Countdown to War & Operation Focus (May–June 1967)",
      roleA: {
        name: "President Gamal Abdel Nasser (Egypt)",
        title: "Sinai Mobilisation & Blockade of the Straits of Tiran",
        objective: "Defend expelling UNEF peacekeepers and closing the Straits of Tiran as legitimate responses to Soviet warnings and a necessary show of deterrence in solidarity with Syria.",
        starter: "&ldquo;Egypt was bound by treaty and national honor to defend our Syrian allies against reported Israeli troop buildup because...&rdquo;",
        keyTerms: ["UNEF Expulsion", "Straits of Tiran Closed", "Sinai Mobilisation", "Deterrence"]
      },
      roleB: {
        name: "General Moshe Dayan & Israeli Air Force Command",
        title: "Operation Focus & The Pre-emptive Strike",
        objective: "Argue that the maritime blockade of Eilat and 100,000 Egyptian troops on Israel's border was an open act of war (casus belli), making a pre-emptive strike vital to prevent national destruction.",
        starter: "&ldquo;The naval blockade of Eilat and the massing of Egyptian armies on our border was an immediate casus belli because...&rdquo;",
        keyTerms: ["Operation Focus", "Casus Belli", "Pre-emptive Strike", "Existential Threat"]
      }
    },
    lesson_8: {
      title: "The Khartoum Summit (Arab League) vs. Abba Eban (Israeli Foreign Ministry)",
      subtitle: "The Aftermath of 1967 & UN Resolution 242 (Land for Peace)",
      roleA: {
        name: "Arab League States (Khartoum Conference 'Three No's')",
        title: "Rejection of Annexation & Demanding Immediate Withdrawal",
        objective: "Argue that Israel must unconditionally withdraw from all territories seized in the Six-Day War (Gaza, West Bank, East Jerusalem, Sinai, Golan Heights) before any diplomacy can occur.",
        starter: "&ldquo;Military conquest cannot be rewarded with territorial theft, and we will not negotiate under military occupation because...&rdquo;",
        keyTerms: ["Khartoum Resolution", "Three No's", "Occupied Territories", "Inadmissibility of Land Seizure"]
      },
      roleB: {
        name: "Abba Eban & Israeli Diplomatic Delegation",
        title: "UN Resolution 242 & Secure Recognized Borders",
        objective: "Argue that Israel can only return conquered territories in exchange for permanent Arab recognition, direct peace treaties, and guaranteed secure boundaries.",
        starter: "&ldquo;We cannot return to the indefensible 1967 armistice lines without permanent Arab recognition of our right to exist because...&rdquo;",
        keyTerms: ["UN Resolution 242", "Land for Peace", "Secure and Recognized Borders", "Direct Negotiations"]
      }
    },
    lesson_9: {
      title: "Yasser Arafat (PLO & Fatah) vs. King Hussein of Jordan",
      subtitle: "Palestinian Guerrilla Resistance & Black September (1968–1972)",
      roleA: {
        name: "Yasser Arafat & PLO Guerrilla Leadership (Fatah)",
        title: "Armed Struggle & Independent Palestinian Liberation",
        objective: "Argue that Arab state armies failed in 1948 and 1967, proving that only independent Palestinian armed struggle can liberate the homeland and put their cause on the global stage.",
        starter: "&ldquo;Conventional Arab state armies failed our people, proving that armed resistance by Palestinians themselves is the only path because...&rdquo;",
        keyTerms: ["Battle of Karameh", "Fatah Fedayeen", "Armed Struggle", "Palestinian Identity"]
      },
      roleB: {
        name: "King Hussein of Jordan (Black September 1970)",
        title: "Sovereign Authority & Rejection of a 'State Within a State'",
        objective: "Argue that armed PLO militias were undermining Jordanian law, attempting to assassinate the monarchy, and creating lawless chaos that threatened Jordan's national sovereignty.",
        starter: "&ldquo;No sovereign nation can permit an armed militia to operate above the law and hijack international planes on its soil because...&rdquo;",
        keyTerms: ["Black September", "State Within a State", "Dawson's Field Hijackings", "Jordanian Sovereignty"]
      }
    },
    lesson_10: {
      title: "President Anwar Sadat (Egypt) vs. Prime Minister Golda Meir (Israel)",
      subtitle: "The 1973 Yom Kippur / Ramadan War & Operation Badr",
      roleA: {
        name: "President Anwar Sadat & Arab Coalition Command",
        title: "Operation Badr: Shattering the Diplomatic Stalemate",
        objective: "Defend the surprise crossing of the Suez Canal as necessary to shatter the myth of Israeli invincibility, force diplomatic negotiations, and recover lost Arab territory.",
        starter: "&ldquo;Six years of Israeli occupation and diplomatic arrogance left us with no alternative but military action to break the status quo because...&rdquo;",
        keyTerms: ["Operation Badr", "Bar-Lev Line", "OPEC Oil Embargo", "Shattering the Stalemate"]
      },
      roleB: {
        name: "Prime Minister Golda Meir & General Ariel Sharon",
        title: "Counter-Offensive Defense & Encirclement of the Third Army",
        objective: "Argue that the treacherous surprise attack on the holiest day of the Jewish year threatened national existence, justifying the massive counter-offensive and encirclement of Egypt's Third Army.",
        starter: "&ldquo;Attacking our nation on Yom Kippur while our citizens were praying was a cynical act of aggression that forced us to mobilize because...&rdquo;",
        keyTerms: ["Yom Kippur Surprise Attack", "Canal Crossing Counter-Attack", "Third Army Encircled", "US Airlift"]
      }
    },
    lesson_11: {
      title: "President Anwar Sadat (Egypt) vs. Rejectionist Arab States & PLO",
      subtitle: "From Shuttle Diplomacy to the 1978 Camp David Accords",
      roleA: {
        name: "President Anwar Sadat (Egypt - Camp David Signatory)",
        title: "Courageous Statesmanship & Recovery of the Sinai",
        objective: "Defend travelling to Jerusalem and signing the 1979 Egypt-Israel Peace Treaty as courageous statesmanship that regained every inch of the Sinai and brought peace to Egyptian families.",
        starter: "&ldquo;Thirty years of war and bleeding brought our people only ruin; true courage was breaking the psychological barrier for peace because...&rdquo;",
        keyTerms: ["Jerusalem Speech", "Camp David Accords", "Sinai Returned", "Nobel Peace Prize"]
      },
      roleB: {
        name: "Rejectionist Arab States & Yasser Arafat (PLO)",
        title: "Condemnation of a Separate Peace & Betrayal of Palestinians",
        objective: "Argue that Sadat betrayed the wider Arab cause and abandoned three million Palestinians to eternal Israeli military occupation in exchange for a selfish separate peace.",
        starter: "&ldquo;Sadat broke Arab solidarity and abandoned three million occupied Palestinians just to get back his own desert territory because...&rdquo;",
        keyTerms: ["Separate Peace", "Arab League Boycott", "Betrayal of Palestinians", "Occupation Entrenched"]
      }
    },
    lesson_12: {
      title: "Grassroots Palestinian Youth (First Intifada) vs. Defense Minister Yitzhak Rabin",
      subtitle: "The Lebanon War (1982) & The First Intifada (1987–1993)",
      roleA: {
        name: "Grassroots Palestinian Youth (The Stone-Throwers)",
        title: "Popular Civil Uprising Against Military Rule",
        objective: "Argue that twenty years of military occupation, land confiscations, and Israeli settlements left unarmed civilians no choice but civil disobedience, commercial strikes, and stones.",
        starter: "&ldquo;Generations of living under military checkpoints and settlement expansion forced ordinary teenagers to rise up with stones because...&rdquo;",
        keyTerms: ["First Intifada", "Civil Disobedience", "Stone-Throwing", "Opposing Settlements"]
      },
      roleB: {
        name: "Defense Minister Yitzhak Rabin & Israeli Security Forces",
        title: "Restoring Public Order & Stopping Violent Insurrection",
        objective: "Argue that Israel had a fundamental duty to restore public order, protect Israeli civilians from petrol bombs and riots, and prevent terrorist cells from seizing control of the streets.",
        starter: "&ldquo;No democratic state can allow violent mobs to throw petrol bombs at soldiers and shut down commercial transport without enforcement because...&rdquo;",
        keyTerms: ["Public Order", "Counter-Riot Measures", "Security Enforcement", "Preventing Chaos"]
      }
    },
    lesson_13: {
      title: "Prime Minister Yitzhak Rabin vs. Opponents of Oslo (Netanyahu & Hardliners)",
      subtitle: "The Oslo Peace Process & The 1993–1995 Accords",
      roleA: {
        name: "Prime Minister Yitzhak Rabin & Shimon Peres (Peace Camp)",
        title: "The Historic Compromise of the Oslo Accords",
        objective: "Defend recognizing the PLO and trading land for peace as the only realistic path to end the cycle of bloodshed and preserve Israel as both Jewish and democratic.",
        starter: "&ldquo;You do not make peace with your friends, you make it with enemies; continuing to rule over two million Palestinians would destroy our democracy because...&rdquo;",
        keyTerms: ["Oslo Accords", "Handshake on White House Lawn", "Palestinian Authority", "Land for Peace"]
      },
      roleB: {
        name: "Opponents of Oslo (Benjamin Netanyahu & Hardline Critics)",
        title: "Security Risk & Failure to Stop Terrorist Violence",
        objective: "Argue that the Oslo framework surrendered vital strategic land and gave authority to an armed PLO that could not or would not prevent horrific suicide bombings in Israeli cities.",
        starter: "&ldquo;Giving territorial control to an organisation that fails to prevent suicide bombings endangers the lives of our citizens because...&rdquo;",
        keyTerms: ["Security Compromise", "Suicide Bombings", "Strategic Vulnerability", "Rejection of Oslo"]
      }
    }
  },

  // ==========================================
  // MEDIEVAL_ENGLAND (1066–1485)
  // ==========================================
  medieval_england: {
    lesson_1: {
      title: "Duke William of Normandy vs. King Harold Godwinson",
      subtitle: "1066 & The Battle of Hastings",
      roleA: {
        name: "Duke William of Normandy & Norman Cavalry",
        title: "The Legitimate Crown & Papal Blessing",
        objective: "Argue that Edward the Confessor promised you the English throne and Harold swore a sacred oath on holy relics; victory was granted by God due to Norman tactical brilliance and feigned retreats.",
        starter: "&ldquo;The English crown was rightfully mine by sacred oath and Edward’s promise, and God granted us victory because...&rdquo;",
        keyTerms: ["Sacred Relic Oath", "Papal Banner", "Feigned Retreat", "Norman Cavalry"]
      },
      roleB: {
        name: "King Harold Godwinson & Anglo-Saxon Shield Wall",
        title: "Elected King by the Witan & Defender of England",
        objective: "Argue that the Witan legally elected you King of England, and having just marched 200 miles to defeat the Viking invasion at Stamford Bridge, your exhausted warriors fought bravely for freedom.",
        starter: "&ldquo;I was the rightful, crowned king chosen by the English Witan, and we fought with unmatched valor because...&rdquo;",
        keyTerms: ["The Witan", "Stamford Bridge", "Shield Wall", "Defending the Realm"]
      }
    },
    lesson_2: {
      title: "King William I (The Conqueror) vs. Hereward the Wake (Saxon Resistance)",
      subtitle: "Castles, Terror & The Domesday Survey",
      roleA: {
        name: "King William I & Norman Baronial Authority",
        title: "State Security, Castles & Royal Governance",
        objective: "Defend building motte-and-bailey castles, the Harrying of the North, and the Domesday audit as harsh but necessary measures to pacify a rebellious country and protect England from Danish invasion.",
        starter: "&ldquo;Decisive and unbending force was essential to suppress rebellion and secure the realm against invasion because...&rdquo;",
        keyTerms: ["Motte-and-Bailey Castles", "Harrying of the North", "Domesday Book", "Feudal Subjugation"]
      },
      roleB: {
        name: "Hereward the Wake & Anglo-Saxon Rebellion",
        title: "Popular Resistance to Norman Tyranny & Devastation",
        objective: "Expose the catastrophic brutality of the Harrying of the North, the seizure of ancestral English estates by foreign barons, and the reduced status of free men to feudal serfdom.",
        starter: "&ldquo;Your brutal conquest brought starvation, destroyed hundreds of villages, and stole our ancestral inheritance because...&rdquo;",
        keyTerms: ["Fenland Resistance", "Famine in the North", "Dispossession of Saxons", "Norman Oppression"]
      }
    },
    lesson_3: {
      title: "King Henry II vs. Archbishop Thomas Becket",
      subtitle: "Crown vs. Church & The Constitutions of Clarendon (1164–1170)",
      roleA: {
        name: "King Henry II (Royal Legal Supremacy)",
        title: "One Law for the Realm & Punishing Criminous Clerks",
        objective: "Argue that Church courts allow corrupt priests and 'criminous clerks' to escape justice for murder and theft, and the King's royal courts must hold supreme legal authority over all subjects.",
        starter: "&ldquo;No subject in my realm can be placed above the King's law, and Church courts are shielding murderers because...&rdquo;",
        keyTerms: ["Constitutions of Clarendon", "Criminous Clerks", "Royal Law", "Equal Justice"]
      },
      roleB: {
        name: "Archbishop Thomas Becket (Papal Supremacy)",
        title: "The Liberty of the Church & Sacred Canon Law",
        objective: "Defend the absolute independence of God's Holy Church, the authority of the Pope in Rome, and the sacred rights of clergy to be tried solely under Christian canon law.",
        starter: "&ldquo;The authority of God and the Holy Father is superior to any earthly king, and the Church cannot surrender its freedom because...&rdquo;",
        keyTerms: ["Canon Law", "Papal Authority", "Sanctuary", "Freedom of the Church"]
      }
    },
    lesson_4: {
      title: "King John vs. Robert Fitzwalter & Rebel Barons",
      subtitle: "Magna Carta (1215) & Medieval Kingship",
      roleA: {
        name: "King John (Royal Prerogative)",
        title: "Defending the Crown's Authority & War Taxation",
        objective: "Defend high scutage taxes and royal fines as necessary to fund armies to recover lost ancestral lands in Normandy, arguing that the rebel barons are selfish traitors trying to strip the crown of its power.",
        starter: "&ldquo;The King requires taxation to defend England and recover our lands in France, and your rebellion is treason because...&rdquo;",
        keyTerms: ["Scutage", "War in Normandy", "Royal Prerogative", "Baronial Rebellion"]
      },
      roleB: {
        name: "Robert Fitzwalter & Rebel Barons",
        title: "The Rule of Law & Clause 39 (Trial by Jury)",
        objective: "Expose King John's arbitrary extortion, unlawful imprisonments, and military failures, arguing that even the King is bound by the law of the land and cannot abuse his feudal vassals.",
        starter: "&ldquo;No free man shall be seized or stripped of his rights without the lawful judgment of his equals, because...&rdquo;",
        keyTerms: ["Magna Carta", "Clause 39", "Rule of Law", "End to Arbitrary Fines"]
      }
    },
    lesson_5: {
      title: "Wat Tyler & Rebel Commoners vs. King Richard II & The Royal Court",
      subtitle: "The Black Death (1348) & The Peasants' Revolt (1381)",
      roleA: {
        name: "Wat Tyler & Rebel Commoners",
        title: "Abolition of Serfdom & End to the Poll Tax",
        objective: "Argue that the Black Death proved the labor of common peasants is what keeps England alive, and demand the total abolition of serfdom, free trade in wages, and the cancellation of the corrupt Poll Tax.",
        starter: "&ldquo;We are born free men, not cattle; our labor sustains the realm, and we will no longer tolerate serfdom because...&rdquo;",
        keyTerms: ["Abolition of Serfdom", "Poll Tax Rebellion", "Mile End Demands", "Statute of Labourers"]
      },
      roleB: {
        name: "King Richard II & Feudal Landowners",
        title: "Preserving Social Order & Divine Hierarchy",
        objective: "Argue that God established a fixed social hierarchy with kings and nobles to protect the realm, and that violent mobs burning London records and murdering royal officials threatens total anarchy.",
        starter: "&ldquo;God created the three estates to preserve order, and a violent mob cannot overturn the laws of the realm because...&rdquo;",
        keyTerms: ["Feudal Order", "Divine Hierarchy", "Smithfield Meeting", "Suppressing Anarchy"]
      }
    }
  },

  // ==========================================
  // THE_SHOAH (STRICT HISTORIOGRAPHICAL DEBATES - ZERO PERPETRATOR ROLEPLAY)
  // ==========================================
  the_shoah: {
    lesson_1: {
      category: "historiographical",
      title: "Historical Enquiry: Pre-War European Jewish Life",
      subtitle: "Diversity of Culture vs. Vulnerability to Persecution",
      roleA: {
        name: "Historian of Cultural Integration & Vibrancy",
        title: "Interpretation 1: Flourishing, Integrated & Diverse Communities",
        objective: "Argue that pre-war European Jewish communities were exceptionally diverse, deeply patriotic, culturally flourishing, and economically integrated into their home nations.",
        starter: "&ldquo;The historical evidence proves that European Jews were not passive outsiders, but deeply integrated citizens because...&rdquo;",
        keyTerms: ["Shtetl Culture", "Urban Integration", "Patriotic Service", "Cultural Renaissance"]
      },
      roleB: {
        name: "Historian of Enduring Anti-Semitic Marginalisation",
        title: "Interpretation 2: Deep-Rooted Prejudice & Structural Vulnerability",
        objective: "Argue that centuries of deep-seated European religious, political, and racial anti-Semitism meant that legal emancipation was fragile and prejudice remained ubiquitous.",
        starter: "&ldquo;That perspective overlooks the pervasive vulnerability of Jewish communities, because deep-rooted anti-Semitism...&rdquo;",
        keyTerms: ["Racial Anti-Semitism", "Pogroms in the East", "Fragile Emancipation", "Scapegoating"]
      }
    },
    lesson_2: {
      category: "historiographical",
      title: "Historical Enquiry: The Stripping of Rights (1933–1939)",
      subtitle: "State Coercion vs. Societal Complicity & Aryanisation",
      roleA: {
        name: "Historian of State Coercion & Totalitarian Terror",
        title: "Interpretation 1: Police Terror, Gestapo & Legal Subjugation",
        objective: "Argue that the systematic stripping of rights was driven top-down by totalitarian state terror, police decrees, and the crushing of democratic legal protections.",
        starter: "&ldquo;The primary driver was the terrifying apparatus of the totalitarian police state, because ordinary citizens were intimidated by...&rdquo;",
        keyTerms: ["Nuremberg Laws", "Reichstag Fire Decree", "Gestapo Surveillance", "Legal Disenfranchisement"]
      },
      roleB: {
        name: "Historian of Societal Complicity & Economic Opportunism",
        title: "Interpretation 2: Popular Complicity, Indifference & Aryanisation",
        objective: "Argue that the regime could not have isolated German Jews without widespread public indifference, active participation in boycotts, and widespread greed for 'Aryanised' businesses.",
        starter: "&ldquo;The state could not have succeeded without the quiet consent of society, because ordinary Germans actively profited from...&rdquo;",
        keyTerms: ["Aryanisation of Property", "Bystander Indifference", "Boycott of Jewish Shops", "Social Exclusion"]
      }
    },
    lesson_3: {
      category: "historiographical",
      title: "Historical Enquiry: The Outbreak of WWII & Ghettos (1939–1941)",
      subtitle: "Wartime Radicalisation: Improvised Chaos vs. Ideological Step",
      roleA: {
        name: "Historian of Escalating Wartime Radicalisation",
        title: "Interpretation 1: Total War as Catalyst for Rapid Radicalisation",
        objective: "Argue that the invasion of Poland and the onset of total war created logistical chaos and military brutality that radicalised policy far beyond pre-war plans.",
        starter: "&ldquo;Total war shattered all existing boundaries and served as the direct catalyst for ghettoisation because...&rdquo;",
        keyTerms: ["Invasion of Poland", "Ghettoisation", "Einsatzgruppen", "Logistical Radicalisation"]
      },
      roleB: {
        name: "Historian of Premeditated Ideological Segregation",
        title: "Interpretation 2: Ghettos as Deliberate Stepping Stones to Murder",
        objective: "Argue that ghettoisation was part of a long-standing ideological obsession with racial purification, designed to concentrate and slowly decimate the Jewish population.",
        starter: "&ldquo;Ghettoisation was never an improvised accident; it was a deliberate ideological strategy designed to...&rdquo;",
        keyTerms: ["Racial Purification", "Starvation Rations", "Enclosed Ghettos", "Ideological Imperative"]
      }
    },
    lesson_4: {
      category: "historiographical",
      title: "Historical Debate: The Shift to Systematic Mass Murder (1941–1942)",
      subtitle: "The Functionalist / Structuralist vs. Intentionalist Controversy",
      roleA: {
        name: "Functionalist / Structuralist Historian (e.g. Broszat, Mommsen)",
        title: "Interpretation 1: Cumulative Radicalisation & Bureaucratic Chaos",
        objective: "Argue that systematic extermination evolved from military deadlock in the USSR, chaotic deportations, and competing Nazi bureaucracies 'working towards the Führer'.",
        starter: "&ldquo;The historical evidence demonstrates that the 'Final Solution' emerged from cumulative radicalisation on the ground, because...&rdquo;",
        keyTerms: ["Cumulative Radicalisation", "Bureaucratic Competition", "Working Towards the Führer", "Wannsee Conference"]
      },
      roleB: {
        name: "Intentionalist Historian (e.g. Fleming, Dawidowicz)",
        title: "Interpretation 2: Hitler's Unwavering Ideological Blueprint",
        objective: "Argue that Adolf Hitler had an unbroken ideological intention to annihilate European Jewry since Mein Kampf, issuing orders as soon as world war provided cover.",
        starter: "&ldquo;The extermination of European Jews was the ultimate goal of Nazi ideology from the very beginning, because Hitler consistently...&rdquo;",
        keyTerms: ["Ideological Intent", "Hitler's Prophecy (1939)", "Mein Kampf Blueprint", "Centralised Directives"]
      }
    },
    lesson_5: {
      category: "historiographical",
      title: "Historical Enquiry: Resistance in the Face of Annihilation",
      subtitle: "Armed Partisan Defiance vs. Spiritual & Cultural Resistance",
      roleA: {
        name: "Historian of Armed & Physical Resistance",
        title: "Interpretation 1: Armed Defiance & Camp Insurrections",
        objective: "Argue that armed uprisings (such as the Warsaw Ghetto Uprising, Sobibor revolt, and partisan warfare) were profound acts of military courage that shattered the myth of passivity.",
        starter: "&ldquo;Armed defiance in the ghettos and death camps proved that victims fought back with extraordinary heroism against impossible odds because...&rdquo;",
        keyTerms: ["Warsaw Ghetto Uprising", "Sobibor Revolt", "Partisan Warfare", "Physical Defiance"]
      },
      roleB: {
        name: "Historian of Spiritual, Cultural & Documented Resistance",
        title: "Interpretation 2: Moral Defiance, Archives & Human Dignity",
        objective: "Argue that secret archives (Ringelblum's Oneg Shabbat), clandestine schools, religious observance, and mutual aid were equally decisive forms of resistance that defeated Nazi dehumanisation.",
        starter: "&ldquo;Resistance cannot be measured by weapons alone; preserving human dignity and recording the truth was an equally powerful victory because...&rdquo;",
        keyTerms: ["Ringelblum Archive", "Oneg Shabbat", "Spiritual Resistance", "Preserving Human Dignity"]
      }
    },
    lesson_6: {
      category: "historiographical",
      title: "Historical Enquiry: Responsibility, Collaboration & Rescue",
      subtitle: "Continental Collaboration vs. Moral Agency of Rescuers",
      roleA: {
        name: "Historian of Continental Collaboration & Complicity",
        title: "Interpretation 1: Essential Role of European Collaborationist Regimes",
        objective: "Argue that the Nazi regime could never have murdered six million people across a whole continent without the active military, police, and bureaucratic collaboration of occupied nations.",
        starter: "&ldquo;The continental scale of the Holocaust was only possible because governments, police, and citizens across Europe collaborated by...&rdquo;",
        keyTerms: ["Vichy France", "Local Auxiliary Police", "Continental Complicity", "Deportation Bureaucracy"]
      },
      roleB: {
        name: "Historian of Rescue & 'Righteous Among the Nations'",
        title: "Interpretation 2: Moral Courage & Individual Agency",
        objective: "Argue that the actions of individual rescuers, diplomats, and communities prove that individuals retained moral agency and that rescue was possible despite mortal risk.",
        starter: "&ldquo;The courage of rescuers and the 'Righteous Among the Nations' proves that choice was always possible, because brave individuals...&rdquo;",
        keyTerms: ["Righteous Among the Nations", "Diplomatic Visas", "Hidden Children", "Moral Agency"]
      }
    },
    lesson_7: {
      category: "historiographical",
      title: "Historical Enquiry: Justice, Memory & Survivor Testimony",
      subtitle: "Legal Accountability vs. Historical Memory & Education",
      roleA: {
        name: "Historian of Post-War International Law & Nuremberg",
        title: "Interpretation 1: The Precedent of International Criminal Justice",
        objective: "Argue that the Nuremberg Trials established the vital principle that 'following orders' is no defense and created the modern international legal framework against genocide.",
        starter: "&ldquo;The Nuremberg Trials fundamentally transformed human history by establishing that individual leaders can be held criminally accountable because...&rdquo;",
        keyTerms: ["Nuremberg Trials", "Crimes Against Humanity", "Genocide Convention", "Rule of Law"]
      },
      roleB: {
        name: "Historian of Survivor Testimony & Living Memory",
        title: "Interpretation 2: The Primacy of Survivor Voice in Reshaping Memory",
        objective: "Argue that legal trials alone cannot convey the true loss; only survivor testimony, education, and collective remembrance can safeguard future generations from hatred.",
        starter: "&ldquo;Legal verdicts are cold and incomplete; the true barrier against genocide is hearing the voices and trauma of survivors because...&rdquo;",
        keyTerms: ["Survivor Testimony", "Eichmann Trial (1961)", "Oral History", "Never Again"]
      }
    }
  },

  // ==========================================
  // COLD_WAR (1945–1991)
  // ==========================================
  cold_war: {
    lesson_1: {
      title: "President Harry S. Truman vs. General Secretary Joseph Stalin",
      subtitle: "Capitalist Democracy vs. Soviet Communism (1945)",
      roleA: {
        name: "President Harry S. Truman & Western Allies",
        title: "Defending Free Markets & Democratic Self-Determination",
        objective: "Argue that American capitalist democracy guarantees individual freedom, human rights, and self-determination, while Soviet totalitarianism seeks to impose satellite puppet states.",
        starter: "&ldquo;Free peoples have a right to choose their own democratic governments, and totalitarian communism threatens world freedom because...&rdquo;",
        keyTerms: ["Truman Doctrine", "Containment", "Free Market Democracy", "Marshall Plan"]
      },
      roleB: {
        name: "General Secretary Joseph Stalin & Soviet Leadership",
        title: "Soviet Security Zone & Marxist-Leninist Liberation",
        objective: "Argue that the USSR lost 27 million citizens defeating Nazi Germany and requires a defensive buffer zone of friendly socialist states in Eastern Europe to prevent future capitalist aggression.",
        starter: "&ldquo;Our nation sacrificed 27 million lives to crush fascism, and we have an absolute right to secure borders because...&rdquo;",
        keyTerms: ["Soviet Buffer Zone", "27 Million War Dead", "Anti-Imperialism", "Capitalist Encirclement"]
      }
    },
    lesson_2: {
      title: "Western Diplomats (Churchill & Truman) vs. Soviet Delegation (Stalin & Molotov)",
      subtitle: "From Yalta to Potsdam: The Breakdown of the Grand Alliance (1945)",
      roleA: {
        name: "Western Delegations (Churchill & Truman)",
        title: "Demanding Free Elections in Poland & Eastern Europe",
        objective: "Argue that Stalin violated the Yalta Agreement by installing communist puppet regimes in Poland, Romania, and Bulgaria rather than permitting free and fair elections.",
        starter: "&ldquo;The Grand Alliance was built on the promise of free elections in liberated Europe, and Soviet unilateral control has broken faith because...&rdquo;",
        keyTerms: ["Yalta Pledges", "Declaration of Liberated Europe", "Free Elections", "Potsdam Disagreements"]
      },
      roleB: {
        name: "Soviet Delegations (Stalin & Molotov)",
        title: "Protecting Soviet Borders & War Reparations from Germany",
        objective: "Argue that the Western powers are reneging on German industrial reparations and hypocritically demanding anti-Soviet governments directly on Russia’s most vulnerable border.",
        starter: "&ldquo;Poland has twice been the corridor through which Germany invaded our homeland; we will not allow hostile governments on our frontier because...&rdquo;",
        keyTerms: ["Friendly Border States", "German Reparations", "Red Army Liberation", "Security Guarantee"]
      }
    },
    lesson_3: {
      title: "General Lucius Clay (US Military Governor) vs. Soviet Military Administration",
      subtitle: "The 1948–1949 Berlin Blockade & Operation Vittles",
      roleA: {
        name: "General Lucius Clay & Western Allied Command",
        title: "The Berlin Airlift: Defending Two Million West Berliners",
        objective: "Argue that the Soviet ground blockade of West Berlin is an inhumane attempt to starve two million civilians into submission, justifying the round-the-clock Allied airlift of food and coal.",
        starter: "&ldquo;We will not abandon the people of West Berlin to communist starvation, and our airlift proves that democracy will stand firm because...&rdquo;",
        keyTerms: ["Berlin Airlift", "Operation Vittles", "Defending West Berlin", "NATO Founded"]
      },
      roleB: {
        name: "Soviet Military Administration in Germany",
        title: "Rejection of the Deutsche Mark & Western Division of Germany",
        objective: "Argue that the Western powers violated the Potsdam Agreement by introducing a separate capitalist currency (the Deutsche Mark) to split Germany into a hostile Western bloc.",
        starter: "&ldquo;The Western powers illegally created a separate West German state and currency inside the Soviet occupation zone because...&rdquo;",
        keyTerms: ["Currency Reform", "Potsdam Violations", "Berlin Island", "Western Division"]
      }
    },
    lesson_4: {
      title: "President John F. Kennedy vs. Premier Nikita Khrushchev",
      subtitle: "The 1962 Cuban Missile Crisis & Thirteen Days of Brinkmanship",
      roleA: {
        name: "President John F. Kennedy & EXCOMM",
        title: "Naval Quarantine & Monroe Doctrine Security",
        objective: "Argue that the secret deployment of Soviet nuclear missiles just 90 miles from Florida is an intolerable direct threat to American security that must be removed immediately.",
        starter: "&ldquo;The secret placement of nuclear strike weapons on our doorstep transforms the global balance of terror and cannot stand because...&rdquo;",
        keyTerms: ["Naval Quarantine", "EXCOMM", "Soviet Missiles in Cuba", "Mutually Assured Destruction"]
      },
      roleB: {
        name: "Premier Nikita Khrushchev & Soviet Presidium",
        title: "Defending Socialist Cuba & Strategic Parity with US Jupiter Missiles",
        objective: "Argue that missiles were placed to deter another US invasion of Cuba following the Bay of Pigs, and that the US already positioned nuclear Jupiter missiles directly on the USSR border in Turkey.",
        starter: "&ldquo;You placed nuclear Jupiter missiles on our border in Turkey and attempted to overthrow Castro; our deployment creates fair strategic equality because...&rdquo;",
        keyTerms: ["Bay of Pigs Threat", "Jupiter Missiles in Turkey", "Defending Cuba", "Strategic Parity"]
      }
    },
    lesson_5: {
      title: "US Administration (Containment Policy) vs. Ho Chi Minh & Vietcong",
      subtitle: "Proxy Wars: The Vietnam War & Anti-Imperialism",
      roleA: {
        name: "US Administration & General William Westmoreland",
        title: "The Domino Theory & Defending the Free World",
        objective: "Argue that communist expansion across Southeast Asia must be halted to prevent neighboring nations from falling like dominoes, justifying US military intervention in South Vietnam.",
        starter: "&ldquo;If South Vietnam falls to communist aggression, the entire region will collapse like a row of dominoes because...&rdquo;",
        keyTerms: ["Domino Theory", "Containment", "Gulf of Tonkin", "Defending Democracy"]
      },
      roleB: {
        name: "Ho Chi Minh & National Liberation Front (Vietcong)",
        title: "National Self-Determination & Expelling Foreign Invaders",
        objective: "Argue that the Vietnamese people have fought French and Japanese imperialists for decades, and that American intervention is merely a foreign colonial occupation dividing their homeland.",
        starter: "&ldquo;Our struggle is for national independence and the reunification of our homeland against foreign imperialist invaders because...&rdquo;",
        keyTerms: ["Anti-Imperialism", "National Liberation", "Ho Chi Minh Trail", "Guerrilla Warfare"]
      }
    },
    lesson_6: {
      category: "historiographical",
      title: "Historical Enquiry: The Collapse of the Soviet Union (1989–1991)",
      subtitle: "Reagan's Military Pressure vs. Soviet Economic Exhaustion",
      roleA: {
        name: "Historian of Western Pressure & Reagan's Strategy",
        title: "Interpretation 1: The Impact of American Military Escalation",
        objective: "Argue that President Ronald Reagan's arms buildup (SDI 'Star Wars') and ideological firmness economically out-spent and bankrupted the Soviet Union, forcing its collapse.",
        starter: "&ldquo;The decisive factor was American firmness and military economic pressure, which forced the Soviet system to realize that...&rdquo;",
        keyTerms: ["SDI / Star Wars", "Arms Race Expense", "Tear Down This Wall", "Bankrupting the USSR"]
      },
      roleB: {
        name: "Historian of Internal Soviet Crisis & Gorbachev's Reforms",
        title: "Interpretation 2: Economic Stagnation, Glasnost & Perestroika",
        objective: "Argue that the Soviet Union collapsed from internal economic exhaustion, corruption, the Afghan war quagmire, and Gorbachev's decision not to use military force in 1989.",
        starter: "&ldquo;The Soviet collapse was an inside job driven by chronic economic stagnation and popular desire for democratic freedom because...&rdquo;",
        keyTerms: ["Glasnost & Perestroika", "Economic Stagnation", "Sinatra Doctrine", "Fall of Berlin Wall"]
      }
    },
    lesson_7: {
      category: "historiographical",
      title: "Historical Assessment: Was the Cold War Ever Truly 'Cold'?",
      subtitle: "The Long Peace in Europe vs. Carnage in the Global South",
      roleA: {
        name: "Historian of Superpower Stability ('The Long Peace')",
        title: "Interpretation 1: Nuclear Deterrence Prevented World War III",
        objective: "Argue that nuclear deterrence (MAD) successfully prevented a direct clash between superpowers, keeping Europe peaceful for over forty years and avoiding nuclear annihilation.",
        starter: "&ldquo;The Cold War was remarkably successful in maintaining stability, because nuclear deterrence guaranteed that...&rdquo;",
        keyTerms: ["The Long Peace", "Nuclear Deterrence", "MAD", "Avoiding World War III"]
      },
      roleB: {
        name: "Historian of Proxy Wars & The Global South",
        title: "Interpretation 2: Devastating Bloodshed Across Asia, Africa & Latin America",
        objective: "Argue that calling the conflict 'cold' is a Eurocentric myth; millions died in brutal proxy wars, coups, and civil wars across Korea, Vietnam, Angola, and Afghanistan.",
        starter: "&ldquo;To call the Cold War 'cold' ignores the millions of lives destroyed in the developing world, where the superpowers fought brutally by...&rdquo;",
        keyTerms: ["Proxy Carnage", "Global South", "Korea & Vietnam", "Covert Interventions"]
      }
    }
  },

  // ==========================================
  // WEIMAR_NAZI_GERMANY (1918–1939)
  // ==========================================
  weimar_nazi_germany: {
    lesson_1_1: {
      category: "historiographical",
      title: "Historical Enquiry: The Birth of the Weimar Republic",
      subtitle: "Democratic Triumph vs. The 'Dolchstoß' Stigma",
      roleA: {
        name: "Friedrich Ebert & Weimar Constitutionalists",
        title: "Interpretation 1: The Most Progressive Democratic Constitution",
        objective: "Argue that the creation of the Republic saved Germany from military collapse and communist civil war, establishing universal suffrage, free speech, and proportional representation.",
        starter: "&ldquo;The Weimar Constitution established Germany as one of the most progressive democracies in the world because...&rdquo;",
        keyTerms: ["Universal Suffrage", "Reichstag Proportionality", "Weimar Democracy", "Ebert-Groener Pact"]
      },
      roleB: {
        name: "Right-Wing Nationalists & Military High Command",
        title: "Interpretation 2: 'November Criminals' & The Dolchstoß Legend",
        objective: "Argue that the army was 'undefeated in the field' and betrayed from behind by socialist politicians who signed the shameful Armistice and created a fatally weak state.",
        starter: "&ldquo;The Republic was born in national disgrace and treason against our fighting soldiers because...&rdquo;",
        keyTerms: ["Dolchstoß / Stab-in-the-back", "November Criminals", "Armistice Shame", "Constitutional Weakness"]
      }
    },
    lesson_1_2: {
      category: "historiographical",
      title: "Historical Enquiry: The Crisis Year of 1923",
      subtitle: "French Occupation vs. Incompetent Hyperinflation Printing",
      roleA: {
        name: "Historian of Foreign Aggression & Ruhr Invasion",
        title: "Interpretation 1: The Decisive Impact of French Military Invasion",
        objective: "Argue that France's aggressive invasion of the industrial Ruhr provoked passive resistance and economic collapse that made catastrophic hyperinflation inevitable.",
        starter: "&ldquo;The catastrophe of 1923 was triggered directly by French imperialist invasion of the Ruhr because...&rdquo;",
        keyTerms: ["Ruhr Occupation", "Passive Resistance", "Reparations Pressure", "External Shock"]
      },
      roleB: {
        name: "Historian of Fiscal Irresponsibility & Currency Printing",
        title: "Interpretation 2: Government Recklessness in Printing Paper Money",
        objective: "Argue that Weimar politicians recklessly printed trillions of paper marks instead of balancing the budget or collecting fair taxes from industrial magnates.",
        starter: "&ldquo;The collapse of the mark was caused by government financial incompetence and unrestrained printing presses because...&rdquo;",
        keyTerms: ["Printing Paper Money", "Hyperinflation", "Wiping Out the Middle Class", "Fiscal Recklessness"]
      }
    },
    lesson_1_3: {
      category: "historiographical",
      title: "Historical Enquiry: The Golden Years of Weimar (1924–1929)",
      subtitle: "Genuine Economic Stability vs. Precarious Foreign Loans",
      roleA: {
        name: "Historian of Stresemann's Diplomatic & Economic Realism",
        title: "Interpretation 1: Genuine Recovery & International Rehabilitation",
        objective: "Argue that Gustav Stresemann successfully stabilised the currency with the Rentenmark, secured billions in Dawes Plan investments, and brought Germany into the League of Nations.",
        starter: "&ldquo;Stresemann pulled Germany back from the brink of total collapse and restored prosperity because...&rdquo;",
        keyTerms: ["Rentenmark", "Dawes Plan (1924)", "Locarno Treaties", "League of Nations"]
      },
      roleB: {
        name: "Historian of Structural Economic Fragility",
        title: "Interpretation 2: Dancing on a Volcano / Addicted to US Loans",
        objective: "Argue that Germany’s recovery was an artificial illusion financed entirely by short-term American loans that could be recalled at any moment, leaving the economy fatally vulnerable.",
        starter: "&ldquo;Germany was dancing on a volcano, because the entire recovery was built on fragile American loans that...&rdquo;",
        keyTerms: ["Dancing on a Volcano", "Short-Term US Loans", "Agricultural Recession", "Over-Reliance on Wall Street"]
      }
    },
    lesson_2_3: {
      category: "historiographical",
      title: "Historical Debate: Why Did Nazi Support Surge (1929–1932)?",
      subtitle: "The Great Depression vs. Goebbels' Propaganda Machine",
      roleA: {
        name: "Economic Historian (Focus on the Great Depression)",
        title: "Interpretation 1: Mass Unemployment & Economic Despair",
        objective: "Argue that without the Wall Street Crash and six million unemployed Germans, the Nazi party would have remained a fringe extremist sect on the margins of politics.",
        starter: "&ldquo;The historical evidence proves that economic misery was the decisive driver of Nazi electoral breakthrough because...&rdquo;",
        keyTerms: ["Wall Street Crash", "Six Million Unemployed", "Banking Collapse", "Despair & Poverty"]
      },
      roleB: {
        name: "Political Historian (Focus on Propaganda & Fear of Communism)",
        title: "Interpretation 2: Targeted Propaganda, Hitler's Charisma & Anti-Communism",
        objective: "Argue that economic crisis alone did not automatically mean voting Nazi; it was Goebbels' modern campaigning, rallies, and promises to crush communism that won votes.",
        starter: "&ldquo;Economic crisis was the condition, but Nazi propaganda and anti-communist fear were the decisive engine because...&rdquo;",
        keyTerms: ["Hitler over Germany", "Fear of Communism", "Goebbels' Propaganda", "Targeted Messaging"]
      }
    },
    lesson_3_2: {
      category: "historiographical",
      title: "Historical Debate: Control in Nazi Germany (1933–1939)",
      subtitle: "Omnipresent Police Terror vs. Popular Consent & Informers",
      roleA: {
        name: "Historian of Totalitarian Terror & The Police State",
        title: "Interpretation 1: The Terror Apparatus of the SS and Gestapo",
        objective: "Argue that ordinary Germans were coerced into silence by the brutal machinery of the Gestapo, SS, arbitrary arrest, and the early concentration camps.",
        starter: "&ldquo;The primary weapon of control was the pervasive fear of the Gestapo and concentration camps because...&rdquo;",
        keyTerms: ["Gestapo Terror", "Dachau Camp", "Arbitrary Arrest", "SS Control"]
      },
      roleB: {
        name: "Social Historian of Consent & Denunciation",
        title: "Interpretation 2: Popular Consent, Economic Benefits & Denunciation",
        objective: "Argue that the Gestapo had remarkably few officers and relied overwhelmingly on voluntary denunciations by ordinary citizens who genuinely supported the regime’s economic revival.",
        starter: "&ldquo;The regime rested far more on genuine popular consent and voluntary citizen denunciations because...&rdquo;",
        keyTerms: ["Voluntary Denunciations", "Popular Consent", "Economic Recovery Appeal", "Limited Gestapo Numbers"]
      }
    }
  },

  // ==========================================
  // USA (1954–1975: Civil Rights & Vietnam)
  // ==========================================
  usa: {
    lesson_1_3: {
      title: "Rosa Parks & Dr Martin Luther King Jr vs. Montgomery City Officials",
      subtitle: "The 1955–1956 Montgomery Bus Boycott",
      roleA: {
        name: "Dr Martin Luther King Jr & MIA Boycott Organisers",
        title: "Non-Violent Direct Action & Christian Moral Power",
        objective: "Defend the 381-day bus boycott and carpools as an inspiring, peaceful display of non-violent collective resistance that successfully bankrupted the segregated bus company and struck down Jim Crow transit laws.",
        starter: "&ldquo;Our non-violent boycott proved that ordinary citizens united in moral conviction could defeat segregation because...&rdquo;",
        keyTerms: ["Montgomery Bus Boycott", "Non-Violent Resistance", "Browder v. Gayle", "Economic Pressure"]
      },
      roleB: {
        name: "Montgomery City Officials & Bus Company Leadership",
        title: "Southern Legal Order & Defense of Local Segregation Laws",
        objective: "Argue that local custom and municipal ordinances required segregation to preserve public peace, and claim that outside agitators were disrupting traditional race relations.",
        starter: "&ldquo;Local municipal laws were established to preserve community order, and private businesses have a right to operate under city codes because...&rdquo;",
        keyTerms: ["Municipal Codes", "Southern Custom", "Maintaining Order", "Anti-Boycott Injunctions"]
      }
    },
    lesson_2_2: {
      title: "Dr Martin Luther King Jr (SCLC) vs. Eugene 'Bull' Connor (Birmingham Police)",
      subtitle: "Project C in Birmingham & The Children's Crusade (1963)",
      roleA: {
        name: "Dr Martin Luther King Jr & Civil Rights Marchers",
        title: "Confronting Segregation & Forcing Federal Action",
        objective: "Argue that confronting Bull Connor's brutality on television was necessary to expose the ugly reality of Southern racism to the world and force President Kennedy to pass civil rights legislation.",
        starter: "&ldquo;Exposing the moral ugliness of segregation before television cameras was necessary to shock the conscience of the nation because...&rdquo;",
        keyTerms: ["Project C", "Children's Crusade", "Letter from Birmingham Jail", "Civil Rights Act 1964"]
      },
      roleB: {
        name: "Police Commissioner Bull Connor & Segregationist Authorities",
        title: "Law Enforcement & Preventing Unlawful Street Demonstrations",
        objective: "Defend using high-pressure fire hoses and police attack dogs to disperse unpermitted street demonstrations, accusing King of recklessly putting young children in harm's way.",
        starter: "&ldquo;Unlawful parades and marches designed to paralyze city commerce cannot be tolerated by law enforcement because...&rdquo;",
        keyTerms: ["Enforcing Public Order", "Unlawful Assembly", "Dispersing Riots", "Parental Neglect"]
      }
    },
    lesson_2_3: {
      category: "historiographical",
      title: "Historical Debate: Non-Violence vs. Black Power",
      subtitle: "Dr Martin Luther King Jr vs. Malcolm X & The Black Panthers",
      roleA: {
        name: "Dr Martin Luther King Jr & SCLC Advocates",
        title: "Interpretation 1: Non-Violent Civil Disobedience & Integration",
        objective: "Argue that non-violence, Christian love, and integration into the American democratic mainstream won the Civil Rights and Voting Rights Acts and won the moral high ground.",
        starter: "&ldquo;Non-violent direct action is the only enduring path to true freedom, because violence begets violence and integration...&rdquo;",
        keyTerms: ["Non-Violent Direct Action", "Beloved Community", "Civil Rights Act 1964", "Voting Rights Act 1965"]
      },
      roleB: {
        name: "Malcolm X & Black Power Advocates (Black Panthers)",
        title: "Interpretation 2: Self-Defense, Black Nationalism & Economic Self-Reliance",
        objective: "Argue that non-violence left Black communities vulnerable to police violence and white terrorism, and that Black people have the human right to self-defense 'by any means necessary'.",
        starter: "&ldquo;Asking Black Americans to turn the other cheek while being attacked by dogs and mobs is criminal; we must defend ourselves because...&rdquo;",
        keyTerms: ["By Any Means Necessary", "Black Power", "Armed Self-Defense", "Economic Self-Sufficiency"]
      }
    },
    lesson_3_2: {
      title: "President Lyndon B. Johnson vs. Anti-War Senators (Wayne Morse & Gruening)",
      subtitle: "The Gulf of Tonkin Resolution & Escalation in Vietnam (1964)",
      roleA: {
        name: "President Lyndon B. Johnson & Military Advisors",
        title: "Defending American Troops & Halting Communist Aggression",
        objective: "Defend the Gulf of Tonkin Resolution as a necessary constitutional measure to protect US naval vessels from unprovoked North Vietnamese torpedo attacks and prevent Southeast Asia from falling to communism.",
        starter: "&ldquo;Unprovoked attacks against the United States Navy on the high seas required immediate congressional authority to retaliate because...&rdquo;",
        keyTerms: ["Gulf of Tonkin Resolution", "USS Maddox", "Retaliatory Strikes", "Defending Freedom"]
      },
      roleB: {
        name: "Senator Wayne Morse & Anti-War Critics",
        title: "Opposing an Unconstitutional Blank Cheque for War",
        objective: "Argue that the administration manipulated ambiguous radar reports to obtain an unconstitutional blank cheque for undeclared war, dragging the country into an unwinnable civil war in Asia.",
        starter: "&ldquo;Congress is handing the President a blank cheque for war based on dubious intelligence, violating our Constitution because...&rdquo;",
        keyTerms: ["Blank Cheque for War", "Dubious Intelligence", "Undeclared War", "Constitutional Violation"]
      }
    },
    lesson_3_3: {
      category: "historiographical",
      title: "Historical Enquiry: Why Did US Military Tactics Fail in Vietnam?",
      subtitle: "Technological Firepower vs. Guerrilla Asymmetric Strategy",
      roleA: {
        name: "Military Historian of Conventional Warfare Constraints",
        title: "Interpretation 1: Political Limitations & Enemy Cross-Border Sanctuaries",
        objective: "Argue that the US military was handcuffed by political restrictions that prevented invading North Vietnam or cutting off the Ho Chi Minh Trail in Cambodia and Laos.",
        starter: "&ldquo;American forces won every major conventional engagement, but were fatally constrained by political restrictions because...&rdquo;",
        keyTerms: ["Search and Destroy", "Air Superiority", "Cross-Border Sanctuaries", "Political Handcuffs"]
      },
      roleB: {
        name: "Historian of Guerrilla & Asymmetric Warfare",
        title: "Interpretation 2: Guerrilla Resilience, Tunnel Networks & Winning Peasant Hearts",
        objective: "Argue that heavy bombing (Operation Rolling Thunder) and Agent Orange alienated ordinary Vietnamese peasants, ensuring that the Vietcong's tunnel networks and knowledge of terrain triumphed.",
        starter: "&ldquo;Heavy bombing and search-and-destroy missions completely alienated the civilian population, while the Vietcong used guerrilla tactics to...&rdquo;",
        keyTerms: ["Cu Chi Tunnels", "Hearts and Minds Lost", "Napalm and Agent Orange", "Asymmetric Warfare"]
      }
    }
  },

  // ==========================================
  // GREAT_WAR & GREAT_WAR_PART2
  // ==========================================
  great_war: {
    lesson_1: {
      title: "Otto von Bismarck (Imperial Germany) vs. French Diplomatic Vanguard",
      subtitle: "German Unification, Alsace-Lorraine & The Balance of Power (1871–1890)",
      roleA: {
        name: "Chancellor Otto von Bismarck (Realpolitik)",
        title: "Preserving the Balance of Power & Isolating France",
        objective: "Argue that Germany is a 'satiated' power desiring peace in Europe, and that careful diplomatic alliances with Russia and Austria-Hungary prevent another European war.",
        starter: "&ldquo;Germany seeks no further European territory; our alliances are purely defensive to preserve peace and prevent encirclement because...&rdquo;",
        keyTerms: ["Realpolitik", "Three Emperors' League", "Satiated Power", "Defensive Alliances"]
      },
      roleB: {
        name: "French Diplomatic Vanguard & Revanchists",
        title: "The Humiliation of 1871 & Alsace-Lorraine",
        objective: "Argue that Germany's brutal annexation of Alsace-Lorraine and crowning of the Kaiser in Versailles was an intolerable insult that permanently shattered European stability.",
        starter: "&ldquo;Europe will never know genuine peace until the stolen provinces of Alsace-Lorraine are returned to the French Republic because...&rdquo;",
        keyTerms: ["Alsace-Lorraine", "Revanchism", "Loss of Territory", "Versailles Humiliation"]
      }
    },
    lesson_3: {
      title: "Admiral Alfred von Tirpitz (Germany) vs. Admiral Jackie Fisher (Britain)",
      subtitle: "The Anglo-German Naval Arms Race & HMS Dreadnought (1898–1914)",
      roleA: {
        name: "Admiral Alfred von Tirpitz & Kaiser Wilhelm II",
        title: "The Risk Fleet Theory & Germany's 'Place in the Sun'",
        objective: "Argue that Germany is a booming industrial superpower entitled to an imperial navy to protect world commerce and ensure Britain treats Germany as an equal partner.",
        starter: "&ldquo;A global economic power cannot allow its commercial shipping to be at the mercy of the British Navy; we require a battlefleet because...&rdquo;",
        keyTerms: ["Risk Fleet", "Place in the Sun", "Naval Laws", "Weltpolitik"]
      },
      roleB: {
        name: "Admiral Jackie Fisher & Winston Churchill (Royal Navy)",
        title: "The Two-Power Standard & Defense of an Island Nation",
        objective: "Argue that for Britain, naval supremacy is an existential requirement for island survival and food imports, whereas for Germany, a high-seas fleet is a luxury and a provocation.",
        starter: "&ldquo;For Britain, the fleet is an absolute necessity of survival, but for Germany, it is an aggressive luxury designed to...&rdquo;",
        keyTerms: ["HMS Dreadnought", "Two-Power Standard", "Island Survival", "Food Imports"]
      }
    },
    lesson_5: {
      title: "Chancellor Theobald von Bethmann-Hollweg vs. Sir Edward Grey",
      subtitle: "The July Crisis & The Outbreak of War (July–August 1914)",
      roleA: {
        name: "Chancellor Bethmann-Hollweg & Austro-German Alliance",
        title: "The 'Blank Cheque' & Deterring Slavic Terrorism",
        objective: "Argue that Austria-Hungary had a sovereign right to crush Serbian state-sponsored terrorism after the assassination of Archduke Franz Ferdinand, and Russia had no right to mobilize.",
        starter: "&ldquo;Austria-Hungary had an absolute right to punish state-sponsored assassination on its borders, and Russian mobilisation caused the catastrophe because...&rdquo;",
        keyTerms: ["Assassination at Sarajevo", "Blank Cheque", "Punishing Serbia", "Russian Mobilisation"]
      },
      roleB: {
        name: "Sir Edward Grey & British Foreign Office",
        title: "Defending Belgian Neutrality & Opposing Militarism",
        objective: "Argue that Germany launched an unprovoked war by invading neutral Belgium under the Schlieffen Plan, tearing up the 1839 Treaty of London like a 'scrap of paper'.",
        starter: "&ldquo;Great Britain could not stand by while the solemn treaty of Belgian neutrality was treated as a worthless scrap of paper because...&rdquo;",
        keyTerms: ["Belgian Neutrality", "Treaty of London (1839)", "Schlieffen Plan", "Scrap of Paper"]
      }
    }
  },

  great_war_part2: {
    lesson_2_trenches_haig: {
      category: "historiographical",
      title: "Historical Enquiry: The Reputation of Field Marshal Douglas Haig",
      subtitle: "'The Butcher of the Somme' vs. 'The Master of the Western Front'",
      roleA: {
        name: "Traditional / Revisionist Military Historian",
        title: "Interpretation 1: The Inevitable War of Attrition & Ultimate Victory",
        objective: "Argue that Haig faced an unprecedented technological stalemate with no easy flank, and his stubborn attrition on the Western Front broke the German army, culminating in the victorious Hundred Days of 1918.",
        starter: "&ldquo;Haig had to fight the main German army where it stood, and his attritional strategy was the painful but necessary path to victory because...&rdquo;",
        keyTerms: ["Attritional Strategy", "Hundred Days Offensive (1918)", "Breaking the German Army", "Learning Curve"]
      },
      roleB: {
        name: "Critical / Popular Historian (Lions Led by Donkeys)",
        title: "Interpretation 2: Rigid Incompetence & Senseless Slaughter at the Somme",
        objective: "Argue that Haig clung obstinately to outdated cavalry tactics, ordering infantry to walk across no-man's-land into machine guns at the Somme and mud at Passchendaele.",
        starter: "&ldquo;Haig demonstrated fatal obstinacy by repeating catastrophic frontal assaults that cost 420,000 British casualties at the Somme alone because...&rdquo;",
        keyTerms: ["First Day on the Somme (57,000 casualties)", "Passchendaele Mud", "Lions Led by Donkeys", "Rigid Frontal Assaults"]
      }
    },
    lesson_5_versailles: {
      category: "historiographical",
      title: "Historical Assessment: The Treaty of Versailles (1919)",
      subtitle: "A Carthaginian Peace vs. A Just and Moderate Settlement",
      roleA: {
        name: "Georges Clemenceau & French Revisionists",
        title: "Interpretation 1: Legitimate Reparations & French Security",
        objective: "Argue that Germany invaded France twice in 50 years, devastated French industry and farmland, and that Article 231 and reparations were completely justified to prevent future German aggression.",
        starter: "&ldquo;France bore the brunt of German destruction, losing 1.4 million young men; our demands for security and reparations were entirely just because...&rdquo;",
        keyTerms: ["War Guilt (Article 231)", "Devastated French Land", "Demilitarised Rhineland", "£6.6 Billion Reparations"]
      },
      roleB: {
        name: "J.M. Keynes & Moderate Critics",
        title: "Interpretation 2: Economic Folly & Planting Seeds of Future Conflict",
        objective: "Argue that the harsh financial reparations and 'Diktat' stripped Germany of the economic means to pay, embittered 65 million Germans, and planted the lethal seeds of European vengeance.",
        starter: "&ldquo;The treaty was economically unworkable and politically disastrous, because stripping Germany of vital industrial areas ensured that...&rdquo;",
        keyTerms: ["The Economic Consequences of the Peace", "Diktat", "Embittering German Democracy", "Planting Seeds of 1939"]
      }
    }
  }
};

/**
 * Retrieves the curated Standoff duel pair for a given unit and lesson.
 * Falls back to an academically rigorous Causal / Historiographical debate if uncurated.
 */
export function getArenaStandoffPair(unitId, lessonId, lesson) {
  const normUnit = (unitId || '').toLowerCase().trim();
  const normLesson = (lessonId || '').toLowerCase().trim();

  // 1. Direct registry lookup
  const unitRegistry = ARENA_STANDOFF_REGISTRY[normUnit];
  if (unitRegistry) {
    if (unitRegistry[normLesson]) {
      return unitRegistry[normLesson];
    }
    // Try matching numeric index (e.g. lesson_1 from 1)
    const numMatch = normLesson.match(/\d+/);
    if (numMatch) {
      const numKey = 'lesson_' + numMatch[0];
      if (unitRegistry[numKey]) return unitRegistry[numKey];
    }
  }

  // 2. Specialized Historiographical Ethics Fallback for Holocaust / The Shoah
  const isHolocaustTopic = normUnit.includes('shoah') || 
                           normUnit.includes('holocaust') || 
                           (lesson && lesson.title && lesson.title.toLowerCase().includes('shoah'));

  if (isHolocaustTopic) {
    return {
      category: 'historiographical',
      title: 'Historical Enquiry: Competing Historical Perspectives',
      subtitle: lesson?.title || 'Historical Interpretations Duel',
      roleA: {
        name: 'Historian of Structural Radicalisation & Context',
        title: 'Interpretation 1: Structural Pressures & Cumulative Process',
        objective: 'Argue that historical events developed through cumulative institutional pressures, bureaucratic actions, and escalating wartime circumstances.',
        starter: '&ldquo;The archival evidence demonstrates that this development emerged primarily from structural pressures and wartime radicalisation because...&rdquo;',
        keyTerms: ['Historical Context', 'Structural Radicalisation', 'Documentary Evidence', 'Institutional Action']
      },
      roleB: {
        name: 'Historian of Ideological Intent & Moral Agency',
        title: 'Interpretation 2: Central Ideological Intent & Human Decisions',
        objective: 'Argue that specific decisions by key individuals and unyielding ideological intent were the decisive drivers of the outcome.',
        starter: '&ldquo;That perspective overlooks the central role of ideological intent and conscious individual choices, because leaders consistently...&rdquo;',
        keyTerms: ['Ideological Driver', 'Human Agency', 'Primary Evidence', 'Intentional Decisions']
      }
    };
  }

  // 3. Robust Disciplinary Fallback (Long-Term Structural Drivers vs Short-Term Triggers)
  // NEVER blindly combines Actor A vs Actor B from chronological steps.
  const lessonTitle = lesson?.title || 'Historical Turning Point';
  const cleanTitle = lessonTitle.replace(/^kt\s*\d+(\.\d+)?[:\-]?\s*/i, '').replace(/^enquiry\s*\d+[:\-]?\s*/i, '');

  return {
    title: 'Disciplinary Debate: Causal Significance',
    subtitle: cleanTitle,
    roleA: {
      name: 'Perspective 1: Long-Term Structural Drivers',
      title: 'Economic, Social & Ideological Foundations',
      objective: 'Argue that deep-rooted structural forces (economic pressures, ideological divisions, and long-term policies) made this historical outcome inevitable.',
      starter: '&ldquo;The evidence proves that long-term structural forces were the primary and decisive factor because...&rdquo;',
      keyTerms: ['Long-Term Causes', 'Economic Pressures', 'Structural Framework', 'Inevitability']
    },
    roleB: {
      name: 'Perspective 2: Short-Term Catalysts & Key Individuals',
      title: 'Crisis Turning Points & Decisive Human Agency',
      objective: 'Argue that this outcome was not inevitable, and that specific trigger crises, tactical mistakes, or decisions by individual leaders directly determined what happened.',
      starter: '&ldquo;That argument ignores the decisive turning points of human agency, because without specific decisions and trigger events...&rdquo;',
      keyTerms: ['Trigger Event', 'Decisive Individuals', 'Turning Point', 'Human Agency']
    }
  };
}
