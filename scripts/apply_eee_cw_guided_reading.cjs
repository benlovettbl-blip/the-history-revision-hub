const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const eeeGuidedReading = {
  lesson_1_1: [
    {
      question: "According to paragraph [1.1], what financial crisis did Elizabeth I inherit upon ascending the throne in November 1558?",
      answer: "Crown debt of £300,000 and annual crown revenues of only £110,000, worsened by high inflation and debased silver currency."
    },
    {
      question: "Using paragraph [2.1], what was the role of the 19-man Privy Council and who was Elizabeth's chief secretary?",
      answer: "To advise the Queen on royal policy, run daily administration, and enforce laws; led by Sir William Cecil."
    },
    {
      question: "According to paragraph [3.1], why did sixteenth-century European society view female monarchical rule with deep patriarchal suspicion?",
      answer: "Belief that women lacked the physical and mental capacity to govern or command armies, popularized by John Knox's pamphlet attacking female rule."
    },
    {
      question: "Using paragraph [5.1], what humiliating territorial loss had England suffered to France under Queen Mary in January 1558?",
      answer: "The loss of Calais, England's last military and trading foothold on continental European soil."
    }
  ],
  lesson_1_2: [
    {
      question: "According to paragraph [2.1], what title was granted to Queen Elizabeth by the Act of Supremacy (May 1559)?",
      answer: "Supreme Governor of the Church of England, pacifying Catholics who believed only the Pope or Christ was supreme head."
    },
    {
      question: "Using paragraph [3.1], what penalty did the Act of Uniformity impose on recusants who refused to attend Sunday church?",
      answer: "A fine of one shilling (12 pence) per week, a heavy sum for ordinary commoners."
    },
    {
      question: "According to paragraph [4.1], what did Elizabeth's 57 Royal Injunctions order regarding church decoration and vestments?",
      answer: "Every parish had to possess an English Bible, destroy monuments of fake miracles, and ensure clergy wore white linen surplices."
    },
    {
      question: "Using paragraph [5.1], how many Catholic bishops refused to swear the Oath of Supremacy during royal visitations in 1559?",
      answer: "All Marian bishops except one (27 out of 28 bishops) refused and were stripped of their offices."
    }
  ],
  lesson_1_3: [
    {
      question: "According to paragraph [1.1], what did radical Puritans demand regarding church practices and decoration?",
      answer: "The total removal of all Catholic idols, crucifixes, organs, stained glass, and unbiblical holy days."
    },
    {
      question: "Using paragraph [2.1], what was the 'Vestments Controversy' of 1566 and how did Archbishop Parker respond?",
      answer: "Thirty-seven Puritan clergy refused to wear traditional surplice vestments and were dismissed from the Church by Archbishop Parker's Book of Advertisements."
    },
    {
      question: "According to paragraph [3.1], what were 'Church Papists' in Elizabethan England?",
      answer: "Moderate Catholics who attended compulsory Protestant services to avoid recusancy fines while practicing Catholic mass secretly at home."
    },
    {
      question: "Using paragraph [5.1], what was the 'Genoese Loan' incident of 1568 and how did it damage Anglo-Spanish relations?",
      answer: "Elizabeth seized 400,000 florins of Spanish gold from storm-driven ships in English ports, prompting King Philip II to impose a trade embargo."
    }
  ],
  lesson_1_4: [
    {
      question: "According to paragraph [1.1], why did Mary, Queen of Scots, represent an existential dynastic challenge to Elizabeth I?",
      answer: "As the granddaughter of Henry VIII's sister Margaret, Catholics viewed Mary as the legitimate, rightful Catholic Queen of England."
    },
    {
      question: "Using paragraph [2.1], what scandalous event in Edinburgh in February 1567 destroyed Mary's standing in Scotland?",
      answer: "The gunpowder explosion and murder of her husband, Lord Darnley, at Kirk o' Field, followed by her marriage to the chief suspect, the Earl of Bothwell."
    },
    {
      question: "According to paragraph [3.1], where was Mary imprisoned in Scotland before her dramatic escape across the Solway Firth to England in 1568?",
      answer: "Lochleven Castle, where Scottish Protestant lords forced her to abdicate in favour of her infant son, James VI."
    },
    {
      question: "Using paragraph [4.1], what were the 'Casket Letters' presented at the 1568–69 York Inquiry?",
      answer: "Love letters and sonnets allegedly written by Mary to Bothwell, used by Scottish lords to prove her complicity in Darnley's murder."
    }
  ],
  lesson_2_1: [
    {
      question: "According to paragraph [1.1], what action did the Catholic Earls of Northumberland and Westmorland take at Durham Cathedral in November 1569?",
      answer: "They tore up the English Bible and Book of Common Prayer and celebrated traditional Latin Catholic Mass, launching the Northern Rebellion."
    },
    {
      question: "Using paragraph [2.1], what did Pope Pius V decree in his 1570 papal bull Regnans in Excelsis?",
      answer: "He excommunicated Elizabeth as a heretic and released all English subjects from their oaths of allegiance to her."
    },
    {
      question: "According to paragraph [3.1], what was the 1583 Throckmorton Plot and who was backing it?",
      answer: "A planned French Catholic invasion financed by Spain and the Papacy to overthrow Elizabeth and crown Mary, Queen of Scots."
    },
    {
      question: "Using paragraph [5.1], how did Sir Francis Walsingham uncover the 1586 Babington Plot?",
      answer: "He intercepted, decoded, and resealed encrypted letters smuggled in beer barrels, obtaining Mary's written approval to assassinate Elizabeth."
    }
  ],
  lesson_2_2: [
    {
      question: "According to paragraph [1.1], what two core sources of conflict brought England and Spain to the brink of war in the 1570s?",
      answer: "Religious differences (Catholic crusade vs Protestant haven) and commercial rivalry over illegal trade in the Spanish New World."
    },
    {
      question: "Using paragraph [2.1], what did Francis Drake achieve during his 1577–1580 circumnavigation of the globe?",
      answer: "He plundered Spanish silver treasure ships on the Pacific coast, brought home £400,000 of booty on the Golden Hind, and was knighted by Elizabeth."
    },
    {
      question: "According to paragraph [3.1], why did the Dutch Revolt in the Spanish Netherlands threaten English national security?",
      answer: "The Spanish Duke of Alba stationed a veteran army of 50,000 troops directly across the English Channel, capable of launching an invasion of England."
    },
    {
      question: "Using paragraph [5.1], what treaty did Elizabeth sign in August 1585, officially committing English troops to the Netherlands?",
      answer: "The Treaty of Nonsuch, sending 7,400 English soldiers under the Earl of Leicester to support Dutch rebels against Spain."
    }
  ],
  lesson_2_3: [
    {
      question: "According to paragraph [1.1], what legal act passed in 1584 mandated the execution of anyone who plotted to assassinate Queen Elizabeth?",
      answer: "The Bond of Association, drafted by Cecil and Walsingham after the assassination of William of Orange."
    },
    {
      question: "Using paragraph [2.1], where was Mary, Queen of Scots, put on trial for high treason in October 1586?",
      answer: "Fotheringhay Castle in Northamptonshire, before a court of 46 English peers, judges, and Privy Councillors."
    },
    {
      question: "According to paragraph [3.1], why was Elizabeth deeply reluctant to sign Mary’s death warrant?",
      answer: "She feared executing an anointed, divinely appointed monarch set a dangerous precedent and would unite Catholic France and Spain against England."
    },
    {
      question: "Using paragraph [4.1], on what date was Mary, Queen of Scots, beheaded inside the Great Hall of Fotheringhay Castle?",
      answer: "8 February 1587, dressed in liturgical crimson—the Catholic colour of martyrdom."
    }
  ],
  lesson_2_4: [
    {
      question: "According to paragraph [1.1], what was King Philip II’s grand strategic plan for the 1588 Spanish Armada?",
      answer: "Sail 130 warships through the English Channel to rendezvous with the Duke of Parma’s 30,000 veteran invasion troops in Flanders."
    },
    {
      question: "Using paragraph [2.1], what tactical advantages did the English royal fleet possess over the Spanish galleons?",
      answer: "Faster, lower 'race-built' galleons equipped with culverin cannon mounted on four-wheeled truck carriages that could reload three times faster."
    },
    {
      question: "According to paragraph [3.1], what decisive tactic did the English deploy against the anchored Spanish fleet off Calais on 7 August 1588?",
      answer: "Eight hell-burner fireships packed with pitch, tar, and gunpowder, causing Spanish captains to panic, cut their anchor cables, and scatter."
    },
    {
      question: "Using paragraph [4.1], what decisive naval battle was fought on 8 August 1588 where English cannon battered Spanish galleons?",
      answer: "The Battle of Gravelines, forcing the battered Armada into the hostile North Sea to circumnavigate Scotland and Ireland."
    }
  ],
  lesson_3_1: [
    {
      question: "According to paragraph [1.1], how did the development of printing and humanism impact Elizabethan grammar school education?",
      answer: "Literacy expanded among the gentry and merchant classes, with grammar schools teaching Latin grammar, rhetoric, and classical philosophy."
    },
    {
      question: "Using paragraph [2.1], how did education for girls differ from boys in Elizabethan society?",
      answer: "Girls were excluded from grammar schools and universities, receiving home education in needlework, French, music, and domestic household management."
    },
    {
      question: "According to paragraph [3.1], what were the most popular blood sports enjoyed by all social classes in Elizabethan England?",
      answer: "Bear-baiting, bull-baiting, and cockfighting in purpose-built circular arenas on London's Southwark bank."
    },
    {
      question: "Using paragraph [4.1], why did the construction of purpose-built theatres (like James Burbage's The Theatre in 1576) revolutionize drama?",
      answer: "It replaced travelling vagabond actors with professional playhouses charging tiered ticket prices, from one-penny groundlings to cushioned galleries."
    }
  ],
  lesson_3_2: [
    {
      question: "According to paragraph [1.1], what economic pressures caused a dramatic rise in Elizabethan poverty and vagrancy?",
      answer: "Rapid population growth from 2.8m to 4m, bad harvests, debased coinage, and agricultural enclosure converting arable land to sheep farming."
    },
    {
      question: "Using paragraph [2.1], how did Elizabethan society distinguish between the 'impotent poor' and the 'idle poor'?",
      answer: "The impotent poor were genuinely unable to work due to age or disability; the idle poor were able-bodied vagrants seen as dangerous criminals."
    },
    {
      question: "According to paragraph [3.1], what harsh punishments did the 1572 Vagrancy Act impose on unlicensed beggars?",
      answer: "Public whipping, burning a hole through the gristle of the right ear with a hot iron, and execution on the third offence."
    },
    {
      question: "Using paragraph [4.1], what was the historic significance of the 1601 Act for the Relief of the Poor?",
      answer: "It created a compulsory national poor rate collected by parish Overseers, providing parish relief for the impotent and materials for the able-bodied to work."
    }
  ],
  lesson_3_3: [
    {
      question: "According to paragraph [1.1], how did John Hawkins pioneer the English transatlantic triangular slave trade in the 1560s?",
      answer: "He kidnapped enslaved Africans on the Guinea coast and sold them illegally to Spanish colonists in the Caribbean for pearls, hides, and sugar."
    },
    {
      question: "Using paragraph [2.1], what technological innovations enabled Elizabethan sailors to undertake long-distance oceanic navigation?",
      answer: "Magnetic compasses, navigational astrolabes, Mercator projection sea charts, and faster, highly manoeuvrable caravel and galleon hulls."
    },
    {
      question: "According to paragraph [3.1], why did Elizabeth issue privateering 'Letters of Marque' to sea captains like Francis Drake?",
      answer: "To legally sanction private attacks on Spanish treasure ships and colonies, enriching the royal treasury while denying open warfare."
    },
    {
      question: "Using paragraph [4.1], what chartered monopoly trading companies were founded in the Elizabethan era to open global commerce?",
      answer: "The Muscovy Company (Russia), the Levant Company (Ottoman Empire), and the East India Company (chartered in 1600 for Asian spice trade)."
    }
  ],
  lesson_3_4: [
    {
      question: "According to paragraph [1.1], what royal patent did Queen Elizabeth grant to Sir Walter Raleigh in March 1584?",
      answer: "A charter authorizing him to discover, search, and colonize remote 'heathen and barbarous lands' not possessed by any Christian prince."
    },
    {
      question: "Using paragraph [2.1], where was England’s first experimental colony established in 1585 and who commanded the voyage?",
      answer: "Roanoke Island off the coast of North Carolina, commanded by Sir Richard Grenville and led by governor Ralph Lane."
    },
    {
      question: "According to paragraph [3.1], why did the first 1585 Roanoke colony collapse within a year?",
      answer: "Loss of food supplies when the flagship Tiger ran aground, hostile relations with Chief Wingina's Secotan tribe, and colonists' refusal to farm."
    },
    {
      question: "Using paragraph [4.1], what mystery confronted Governor John White when he returned to Roanoke in 1590 after the Armada crisis?",
      answer: "The entire colony of 115 settlers had vanished without trace, with only the word 'CROATOAN' carved into a wooden palisade post."
    }
  ]
};

const cwGuidedReading = {
  lesson_1: [
    {
      question: "According to paragraph [1.1], what fundamental ideological difference separated American capitalism from Soviet communism?",
      answer: "The US championed multi-party democracy and free-market private enterprise, while the USSR enforced a one-party communist dictatorship and state-controlled planned economy."
    },
    {
      question: "Using paragraph [1.2], what major agreements were reached by the 'Big Three' at the Tehran Conference in November 1943?",
      answer: "Britain and the US agreed to open a 'Second Front' in Western Europe (D-Day), while Stalin agreed to wage war against Japan after Germany was defeated."
    },
    {
      question: "According to paragraph [1.3], what compromise over post-war elections was agreed at the Yalta Conference in February 1945?",
      answer: "The Declaration of Liberated Europe, promising free, democratic multi-party elections in all liberated European nations."
    },
    {
      question: "Using paragraph [1.5], how did President Harry S. Truman change the dynamic at the Potsdam Conference in July 1945?",
      answer: "Truman adopted a much more aggressive, suspicious stance toward Stalin following the successful Trinity atomic bomb test."
    }
  ],
  lesson_2: [
    {
      question: "According to paragraph [2.1], what geopolitical shock did the atomic bombings of Hiroshima and Nagasaki deliver in August 1945?",
      answer: "They demonstrated absolute American military supremacy, prompting Stalin to accelerate the Soviet atomic bomb project."
    },
    {
      question: "Using paragraph [2.2], what secret telegram did American diplomat George Kennan send from Moscow in February 1946?",
      answer: "The 'Long Telegram', warning that the USSR was fanatically hostile to the West and proposing the strategy of 'containment'."
    },
    {
      question: "According to paragraph [2.3], what counter-report was sent to Moscow by Soviet Ambassador Nikolai Novikov in September 1946?",
      answer: "The Novikov Telegram, claiming the US was pursuing world military domination and using economic power for imperialist expansion."
    },
    {
      question: "Using paragraph [2.5], when did the Soviet Union successfully detonate its first atomic bomb (First Lightning)?",
      answer: "August 1949, shattering America's nuclear monopoly years ahead of Western intelligence estimates."
    }
  ],
  lesson_3: [
    {
      question: "According to paragraph [3.1], what famous phrase was used by Winston Churchill during his Fulton, Missouri speech in March 1946?",
      answer: "That 'an iron curtain has descended across the Continent' dividing free democratic Europe from Soviet totalitarian control."
    },
    {
      question: "Using paragraph [3.2], what commitment did President Truman make under the 1947 Truman Doctrine?",
      answer: "Pledging $400 million in aid to Greece and Turkey, declaring the US would support free peoples resisting subjugation by armed minorities or outside pressures."
    },
    {
      question: "According to paragraph [3.4], how did the Western Allies defeat Stalin’s Berlin Blockade between June 1948 and May 1949?",
      answer: "By launching the Berlin Airlift (Operation Vittles), flying over 2.3 million tons of food, coal, and medicine into West Berlin around the clock."
    },
    {
      question: "Using paragraph [3.5], what military alliance was founded by Western nations in April 1949 to deter Soviet aggression?",
      answer: "The North Atlantic Treaty Organization (NATO), establishing collective defence (an attack on one is an attack on all)."
    }
  ],
  lesson_4: [
    {
      question: "According to paragraph [4.1], why did Fidel Castro ally Cuba with the Soviet Union following the 1959 Cuban Revolution?",
      answer: "After the US imposed economic embargoes and backed the failed CIA Bay of Pigs invasion (1961), Castro sought Soviet military and economic protection."
    },
    {
      question: "Using paragraph [4.2], what evidence was discovered by American U-2 spy plane flights over Cuba on 14 October 1962?",
      answer: "High-resolution photographs showing construction of Soviet medium-range nuclear ballistic missile launch sites capable of striking most US cities."
    },
    {
      question: "According to paragraph [4.3], what military response did President John F. Kennedy choose instead of an immediate air strike?",
      answer: "A naval 'quarantine' (blockade) of Cuba to intercept Soviet ships carrying military equipment, backed by DEFCON 2 nuclear alert."
    },
    {
      question: "Using paragraph [4.5], what secret deal ended the Cuban Missile Crisis and what safety measures were established?",
      answer: "Khrushchev removed missiles from Cuba in return for a US pledge not to invade Cuba and a secret agreement to remove US Jupiter missiles from Turkey; the Moscow-Washington Hotline was established."
    }
  ],
  lesson_5: [
    {
      question: "According to paragraph [5.1], how did the 1949 Chinese Communist victory shift Cold War containment policy in Asia?",
      answer: "It led to the adoption of the 'Domino Theory' and NSC-68, tripling US defence spending to prevent communism spreading across Asia."
    },
    {
      question: "Using paragraph [5.2], how did the United Nations and the US respond when North Korean forces invaded South Korea in June 1950?",
      answer: "The UN Security Council authorized military intervention; General MacArthur landed at Inchon and pushed communist forces back toward the Chinese border."
    },
    {
      question: "According to paragraph [5.3], what decisive defeat did French colonial forces suffer in Vietnam in May 1954?",
      answer: "The Battle of Dien Bien Phu, forcing France to withdraw and dividing Vietnam along the 17th Parallel at the Geneva Conference."
    },
    {
      question: "Using paragraph [5.4], why did American military superiority fail to defeat the Vietcong in the Vietnam War?",
      answer: "The Vietcong used asymmetric guerrilla tactics, underground tunnels, and the Ho Chi Minh Trail, while US bombing and chemical weapons alienated the peasant population."
    }
  ],
  lesson_6: [
    {
      question: "According to paragraph [6.1], why did the East German government erect the Berlin Wall in August 1961?",
      answer: "To stop the catastrophic 'brain drain' of over 2.7 million skilled workers and professionals fleeing from communist East Berlin into West Berlin."
    },
    {
      question: "Using paragraph [6.3], what two radical reform policies were introduced by Soviet leader Mikhail Gorbachev in 1985?",
      answer: "Glasnost (openness and freedom of speech) and Perestroika (economic restructuring and private enterprise)."
    },
    {
      question: "According to paragraph [6.4], what historic event took place in Berlin on the night of 9 November 1989?",
      answer: "Thousands of East Berliners overwhelmed border checkpoints and tore down the Berlin Wall after government travel restrictions were mistakenly announced lifted."
    },
    {
      question: "Using paragraph [6.5], on what date was the hammer-and-sickle Soviet flag lowered for the last time over the Kremlin?",
      answer: "25 December 1991, marking the formal dissolution of the Soviet Union into fifteen independent republics."
    }
  ],
  lesson_7: [
    {
      question: "According to paragraph [7.1], why do historians challenge the traditional Western concept of the 'Long Peace' (1945–1991)?",
      answer: "While direct armed conflict between the superpowers was avoided in Europe, violent proxy wars inflicted devastating slaughter across the Global South."
    },
    {
      question: "Using paragraph [7.2], approximately how many people were killed in Cold War proxy conflicts across Asia, Africa, and Latin America?",
      answer: "Over 20 million people died in proxy wars, including in Korea, Vietnam, Angola, Afghanistan, and Central America."
    },
    {
      question: "According to paragraph [7.3], what covert methods were used by the CIA and KGB during the 'invisible' Cold War?",
      answer: "Espionage, wiretapping, assassinations, propaganda disinformation, and orchestrating foreign military coups (like Iran in 1953 and Chile in 1973)."
    },
    {
      question: "Using paragraph [7.4], how did the Space Race serve as an ideological battleground between the superpowers?",
      answer: "It was a test of technological and ideological superiority, from Sputnik in 1957 and Yuri Gagarin in 1961 to the American Apollo 11 Moon landing in 1969."
    }
  ]
};

function updateUnit(unitId, guidedMap) {
  console.log(`\nUpdating unit: ${unitId}...`);
  // 1. data/[unitId].json
  const jsonPath = path.join(ROOT, 'data', `${unitId}.json`);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  data.lessons.forEach(l => {
    if (guidedMap[l.id]) {
      l.guided_reading = guidedMap[l.id];
    }
  });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated data/${unitId}.json`);

  // 2. public/data/[unitId].json
  const pubJsonPath = path.join(ROOT, 'public/data', `${unitId}.json`);
  if (fs.existsSync(pubJsonPath)) {
    fs.writeFileSync(pubJsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated public/data/${unitId}.json`);
  }

  // 3. units/[unitId]/data.js
  const unitJsPath = path.join(ROOT, 'units', unitId, 'data.js');
  if (fs.existsSync(unitJsPath)) {
    fs.writeFileSync(unitJsPath, 'window.unitData = ' + JSON.stringify(data, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
    console.log(`Updated units/${unitId}/data.js`);
  }

  // 4. public/units/[unitId]/data.js
  const pubUnitJsPath = path.join(ROOT, 'public/units', unitId, 'data.js');
  if (fs.existsSync(pubUnitJsPath)) {
    fs.writeFileSync(pubUnitJsPath, 'window.unitData = ' + JSON.stringify(data, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
    console.log(`Updated public/units/${unitId}/data.js`);
  }

  // 5. database.json & public/database.json
  [path.join(ROOT, 'database.json'), path.join(ROOT, 'public/database.json')].forEach(p => {
    if (!fs.existsSync(p)) return;
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    const target = db[unitId]?.data?.lessons || db[unitId]?.lessons;
    if (target) {
      target.forEach(l => {
        if (guidedMap[l.id]) {
          l.guided_reading = guidedMap[l.id];
        }
      });
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
      console.log(`Updated ${path.basename(p)} for ${unitId}`);
    }
  });
}

updateUnit('eee', eeeGuidedReading);
updateUnit('cold_war', cwGuidedReading);

console.log('\nALL 5 DATA STORES FOR EEE AND COLD WAR SYNCHRONIZED SUCCESSFULLY!');
