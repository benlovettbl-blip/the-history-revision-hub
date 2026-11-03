const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataJsPath = path.join(root, 'units', 'eee', 'data.js');
const pubDataJsPath = path.join(root, 'public', 'units', 'eee', 'data.js');

const raw = fs.readFileSync(dataJsPath, 'utf8');
const match = raw.match(/const\s+eee_data\s*=\s*(\{[\s\S]*\});?\s*export\s+default\s+eee_data/);
if (!match) {
  console.error("Could not parse eee_data from units/eee/data.js");
  process.exit(1);
}
const eeeData = JSON.parse(match[1]);

// Verified 3-video pathway map for all 12 Early Elizabethan England lessons
const eeeVideoMap = {
  // L1: The Situation on Elizabeth’s Accession, 1558
  "lesson_1_1": [
    {
      type: "youtube",
      id: "dfgeLdXA87I",
      url: "https://www.youtube.com/watch?v=dfgeLdXA87I",
      title: "Elizabeth I (1533-1603) Queen of England | Simple History",
      duration: "4 mins 00 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:00 | Lesson Phase: Starter Hook | Tone Alert: Animated overview of Elizabeth's early life, imprisonment in the Tower under Mary I, and accession in November 1558.",
      viewing_task: "[01:15] Context: Why was Elizabeth imprisoned in the Tower of London during the reign of her half-sister Mary I?\n[03:10] Analysis: What immediate domestic and foreign challenges faced Elizabeth when she inherited the English throne in November 1558?",
      model_answer: "Mary I suspected Elizabeth of involvement in Wyatt's Rebellion (1554), leading to her imprisonment in the Tower. Upon accession in 1558, Elizabeth faced massive national debt (£300,000), war with France, a divided religious nation, and doubts over her legitimacy and ability to rule as a female monarch."
    },
    {
      type: "youtube",
      id: "6QQiBA7fUUA",
      url: "https://www.youtube.com/watch?v=6QQiBA7fUUA",
      title: "Early Elizabethan England: The Problem of Elizabeth's Legitimacy | The History Teacher",
      duration: "9 mins 56 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Enquiry Depth | Tone Alert: Analytical examination of Henry VIII's annulment, papal authority, and why Catholics viewed Elizabeth as illegitimate.",
      viewing_task: "[01:45] Disciplinary Focus: Why did English and European Catholics refuse to recognize Henry VIII's marriage to Anne Boleyn as lawful?\n[04:20] Historical Significance: How did Elizabeth's perceived illegitimacy heighten the political threat posed by Mary, Queen of Scots?",
      model_answer: "Catholics believed Henry VIII's first marriage to Catherine of Aragon was valid before God and could not be annulled by the King; therefore, Anne Boleyn was never Henry's lawful wife, making Elizabeth illegitimate. Under Catholic succession rules, Henry's great-niece, Mary, Queen of Scots, was regarded as the rightful legitimate heir to the English crown."
    },
    {
      type: "youtube",
      id: "niPNzy6X6os",
      url: "https://www.youtube.com/watch?v=niPNzy6X6os",
      title: "GCSE History Rapid Revision: Elizabeth I - The Virgin Queen | MrClokeHistory",
      duration: "10 mins 17 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Synoptic Synthesis | Tone Alert: Focused examination of Elizabeth's royal court, Privy Council, the royal prerogative, and patronage system.",
      viewing_task: "[01:30] Recall: What was the primary constitutional difference between the Privy Council and Parliament in Tudor governance?\n[03:50] Structural Analysis: How did Elizabeth use patronage and monopolies to ensure loyalty among nobility and prevent factional rebellion?",
      model_answer: "The Privy Council was an advisory body of 19 trusted ministers who managed daily government, while Parliament was called occasionally to grant extraordinary taxation and pass statutes. Elizabeth distributed titles, offices, land leases, and lucrative commercial monopolies (patronage) to bind ambitious noble factions directly to her favour."
    }
  ],

  // L2: The 'Settlement' of Religion, 1559
  "lesson_1_2": [
    {
      type: "youtube",
      id: "-GbkZ_Y1AeQ",
      url: "https://www.youtube.com/watch?v=-GbkZ_Y1AeQ",
      title: "Early Elizabethan England: The Religious Settlement of 1559 | The History Teacher",
      duration: "5 mins 48 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:48 | Lesson Phase: Starter Hook | Tone Alert: Step-by-step breakdown of the Act of Supremacy, Act of Uniformity, and Royal Injunctions establishing the Elizabethan 'Via Media'.",
      viewing_task: "[01:50] Recall: Why did Elizabeth adopt the title 'Supreme Governor' rather than 'Supreme Head' of the Church of England in the Act of Supremacy?\n[03:40] Detail: What compromises were included in the 1559 Act of Uniformity to appease both Catholic and Protestant subjects?",
      model_answer: "Elizabeth took the title 'Supreme Governor' to placate Catholics who believed only the Pope was Christ's vicar on earth, and Puritans who believed only Christ was head of the church. The Act of Uniformity compromised by enforcing Cranmer's Book of Common Prayer in English, while allowing priests to wear vestments and wording communion to accept both Catholic real presence and Protestant commemoration."
    },
    {
      type: "youtube",
      id: "J4luTCHc-tc",
      url: "https://www.youtube.com/watch?v=J4luTCHc-tc",
      title: "GCSE History Rapid Revision: The Elizabethan Religious Settlement | MrClokeHistory",
      duration: "12 mins 18 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:00 | Lesson Phase: Enquiry Depth | Tone Alert: Deep dive into the Royal Injunctions, Church Courts, and visitation enforcement across English parishes.",
      viewing_task: "[02:20] Mechanism: How did the 1559 Royal Injunctions regulate parish church practices regarding pilgrimages, images, and licensing of preachers?\n[04:45] Consequence: What penalties did recusants face for refusing to attend weekly Sunday Anglican services?",
      model_answer: "The Royal Injunctions ordered parishes to possess an English Bible, banned pilgrimages and fake monuments of idolatry, and required preachers to hold royal licences. Recusants who refused Sunday church attendance were fined one shilling (twelve pence) per week, which fell heavily on ordinary citizens while wealthier gentry could initially afford to pay."
    },
    {
      type: "youtube",
      id: "cjoSqVyqBnM",
      url: "https://www.youtube.com/watch?v=cjoSqVyqBnM",
      title: "The Tudors: Elizabeth I - The Religious Settlement 1559 | I'm Stuck Revision",
      duration: "4 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Disciplinary Review | Tone Alert: Fast-paced revision summary tracking the legislative battle in the House of Lords and Bishop opposition.",
      viewing_task: "[01:10] Context: Why did the Catholic Marian Bishops in the House of Lords attempt to vote down Elizabeth's settlement bills in early 1559?\n[03:00] Evaluation: How successful was Elizabeth's 'Middle Way' in maintaining religious peace across England during the 1560s?",
      model_answer: "Marian Catholic bishops held a voting majority in the House of Lords and fiercely defended papal supremacy and Catholic liturgy against Protestant reform. Elizabeth arrested two dissenting bishops and gained a narrow majority; the settlement achieved outward conformity and political stability for a decade until the papal bull of 1570."
    }
  ],

  // L3: Challenge to the Religious Settlement
  "lesson_1_3": [
    {
      type: "youtube",
      id: "_tD3KvqCc8g",
      url: "https://www.youtube.com/watch?v=_tD3KvqCc8g",
      title: "Early Elizabethan England: Threats to Elizabeth's Religious Settlement | The History Teacher",
      duration: "6 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Starter Hook | Tone Alert: Explores the dual challenge from Puritan zealots (vestments controversy, crucifix debate) and Catholic recusants.",
      viewing_task: "[01:40] Puritan Challenge: Why did Puritans object so furiously to clerical vestments and crucifixes in parish churches?\n[03:30] Royal Response: How did Archbishop Matthew Parker's 'Book of Advertisements' (1566) enforce clerical uniformity?",
      model_answer: "Puritans viewed ornate vestments (the surplice) and crucifixes as 'popish rags' and unscriptural idols linking the Church of England back to Rome. Parker's 1566 Book of Advertisements commanded all clergy to wear proper vestments or face expulsion, leading 37 London Puritan clergy to be dismissed from their livings."
    },
    {
      type: "youtube",
      id: "2E6nHk-Ovd8",
      url: "https://www.youtube.com/watch?v=2E6nHk-Ovd8",
      title: "Edexcel GCSE History: Puritan Challenge to the Religious Settlement | The EverLearner",
      duration: "12 mins 12 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:30 | Lesson Phase: Enquiry Depth | Tone Alert: Detailed breakdown of the Presbyterian movement, prophesyings, and Elizabeth's clash with Archbishop Grindal.",
      viewing_task: "[02:30] Presbyterians: How did Thomas Cartwright and John Field challenge the hierarchical structure of bishops in the Church of England?\n[05:15] Monarchical Authority: Why did Elizabeth suspend Archbishop Edmund Grindal in 1577 over the issue of 'prophesyings'?",
      model_answer: "Presbyterians sought to abolish bishops and church hierarchy altogether, proposing governance by local elders (presbyters) elected by congregations, which Elizabeth viewed as a direct assault on her royal supremacy. Grindal refused Elizabeth's direct order to suppress Puritan prayer meetings ('prophesyings'), leading Elizabeth to place him under house arrest."
    },
    {
      type: "youtube",
      id: "OHB36Y4LncQ",
      url: "https://www.youtube.com/watch?v=OHB36Y4LncQ",
      title: "From Oxford Scholar to Hunted Priest: The Story of Edmund Campion | Foederis Arca",
      duration: "3 mins 45 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–03:45 | Lesson Phase: Clandestine Resistance | Tone Alert: Cinematic narrative tracing the secret Jesuit mission to England, priest holes, and Campion's capture.",
      viewing_task: "[01:15] Investigation: What was the primary objective of seminary priests and Jesuits trained at Douai when sneaking into Elizabethan England?\n[02:50] Significance: How did the 1581 Act against Jesuits and Seminary Priests transform the legal definition of Catholic missionary work into high treason?",
      model_answer: "Jesuits and seminary priests sought to administer sacraments, celebrate illegal Latin masses, and keep English Catholic recusants loyal to Rome. The 1581 Act declared that attempting to convert any English subject from Anglicanism to Roman Catholicism was an act of high treason punishable by death."
    }
  ],

  // L4: The Problem of Mary, Queen of Scots, 1568–69
  "lesson_1_4": [
    {
      type: "youtube",
      id: "LIZtyIgtVio",
      url: "https://www.youtube.com/watch?v=LIZtyIgtVio",
      title: "The Problem of Mary Queen of Scots: Early Elizabethan England | The History Teacher",
      duration: "6 mins 05 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Starter Hook | Tone Alert: Examines Mary Stuart's arrival in Cumberland in 1568 following her abdication and flight from Scotland.",
      viewing_task: "[01:30] Scottish Crisis: Why was Mary forced to abdicate the Scottish throne in 1567, and why did she seek sanctuary in England?\n[03:45] Elizabeth's Dilemma: What were the three potential courses of action available to Elizabeth regarding Mary in 1568, and why was each dangerous?",
      model_answer: "Mary was forced to abdicate following the murder of Lord Darnley and her rapid marriage to the suspected killer, the Earl of Bothwell, sparking rebellion among Protestant Scottish lords. Elizabeth faced a dilemma: executing Mary would violate the divine right of anointed monarchs; restoring her to Scotland risked French intervention; and keeping her in England made her a figurehead for Catholic plots."
    },
    {
      type: "youtube",
      id: "j8oF4ALOGXo",
      url: "https://www.youtube.com/watch?v=j8oF4ALOGXo",
      title: "EDEXCEL GCSE History: The Threat of Mary Queen of Scots | History Revision",
      duration: "7 mins 15 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Enquiry Depth | Tone Alert: Detailed analysis of the York and Hampton Court conferences (1568–69) and the Duke of Norfolk marriage conspiracy.",
      viewing_task: "[02:15] Analysis: Why was the Duke of Norfolk drawn into the plan to marry Mary Queen of Scots, and how did Elizabeth react?\n[04:30] Historical Consequence: Why was Mary placed under permanent, heavily guarded house arrest under the Earl of Shrewsbury?",
      model_answer: "The Duke of Norfolk, England's premier Catholic peer, believed marrying Mary would secure the English royal succession and restore noble influence at court; Elizabeth forbade the marriage, viewing it as treasonous. To prevent Mary from rallying Catholic rebels or escaping abroad, Elizabeth confined her to remote inland castles under George Talbot, Earl of Shrewsbury."
    },
    {
      type: "youtube",
      id: "qk5HmIJNa_Y",
      url: "https://www.youtube.com/watch?v=qk5HmIJNa_Y",
      title: "Mary Queen of Scots and the Casket Letters | Mickey Mayhew",
      duration: "5 mins 12 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:12 | Lesson Phase: Forensic Evidence | Tone Alert: Explores the famous silver casket containing love sonnets and letters used to implicate Mary in Darnley's murder.",
      viewing_task: "[01:40] Evidence: What were the 'Casket Letters', and who produced them at the York inquiry in 1568?\n[03:30] Historiography: Why did the English inquiry deliver a 'not proven' verdict regarding the authenticity of the casket letters?",
      model_answer: "The Casket Letters were eight unsigned letters and love poems produced by the Scottish Protestant Regent, the Earl of Moray, allegedly proving Mary conspired with Bothwell to murder Darnley. Elizabeth used the ambiguous 'not proven' verdict politically to avoid either declaring Mary guilty (which would justify overthrowing an anointed queen) or declaring her innocent (which would require restoring her to the Scottish throne)."
    }
  ],

  // L5: Plots and Revolts at Home, 1569–1587
  "lesson_2_1": [
    {
      type: "youtube",
      id: "qLuPzcEON6s",
      url: "https://www.youtube.com/watch?v=qLuPzcEON6s",
      title: "GCSE History Rapid Revision: Revolt of the Northern Earls & Plots | MrClokeHistory",
      duration: "7 mins 20 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Fast-paced narrative covering the Northern Earls (1569), Ridolfi (1571), Throckmorton (1583), and Babington (1586) plots.",
      viewing_task: "[01:45] Northern Earls: Why did the Earls of Northumberland and Westmorland march on Durham Cathedral in November 1569?\n[04:10] Papal Escalation: How did Pope Pius V's 1570 papal bull 'Regnans in Excelsis' change the loyalty of English Catholics?",
      model_answer: "The northern Catholic earls sought to re-establish the Catholic mass, rescue Mary Queen of Scots, and remove William Cecil from power; they celebrated Catholic mass in Durham Cathedral and tore up English prayer books. In 1570, Pius V's bull excommunicated Elizabeth and released English Catholics from allegiance to her, meaning Catholics could no longer be loyal both to their Queen and to their faith."
    },
    {
      type: "youtube",
      id: "WWlX79zUEq0",
      url: "https://www.youtube.com/watch?v=WWlX79zUEq0",
      title: "The Cipher Trap That Saved Queen Elizabeth I | ScienceLocker",
      duration: "4 mins 30 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Cryptography & Espionage | Tone Alert: Technical breakdown of the substitution cipher used by Anthony Babington, Walsingham's codebreaker Thomas Phelippes, and the forged postscript.",
      viewing_task: "[01:30] Secret Comm: How did Mary Queen of Scots smuggle encrypted letters in and out of Chartley Manor?\n[03:15] Codebreaking: How did Thomas Phelippes decipher the code and forge a postscript to implicate all co-conspirators?",
      model_answer: "Mary's letters were smuggled inside waterproof leather beer barrels by a brewer working as a double agent for Francis Walsingham. Thomas Phelippes deciphered Mary's substitution cipher and forged a postscript with a gallows mark asking Babington for the names of all conspirators, providing indisputable evidence of Mary's approval of Elizabeth's assassination."
    },
    {
      type: "youtube",
      id: "pQMXqmuj2Zw",
      url: "https://www.youtube.com/watch?v=pQMXqmuj2Zw",
      title: "Francis Walsingham: Elizabethan Spymaster | Extra History",
      duration: "8 mins 10 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–06:00 | Lesson Phase: Intelligence Network | Tone Alert: Animated character study of Sir Francis Walsingham, his trauma during the St. Bartholomew's Day Massacre, and his clandestine spy ring.",
      viewing_task: "[02:10] Motive: How did witnessing the 1572 St. Bartholomew's Day Massacre in Paris shape Walsingham's fanatical determination to protect Elizabeth?\n[05:00] Execution: Why was Elizabeth so reluctant to sign the death warrant for Mary Queen of Scots in February 1587?",
      model_answer: "Walsingham was English ambassador in Paris during the 1572 massacre where thousands of Huguenots were slaughtered, convincing him of an international Catholic conspiracy to exterminate Protestantism. Elizabeth delayed signing Mary's death warrant for months because executing an anointed monarch set a dangerous precedent, outraged Scotland and France, and gave Philip II of Spain religious justification to invade England."
    }
  ],

  // L6: Relations with Spain, 1569–1585
  "lesson_2_2": [
    {
      type: "youtube",
      id: "ldZYD51Ohjo",
      url: "https://www.youtube.com/watch?v=ldZYD51Ohjo",
      title: "Early Elizabethan England: Spain: Political and Religious Rivalry | The History Teacher",
      duration: "5 mins 10 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:10 | Lesson Phase: Starter Hook | Tone Alert: Overview of the three core drivers of conflict: religious divergence, commercial rivalry in the New World, and the Dutch Revolt.",
      viewing_task: "[01:40] Imperial Trade: Why did Philip II forbid English merchant ships from trading directly with Spanish colonies in the Caribbean and Americas?\n[03:30] Dutch Revolt: Why did Elizabeth covertly assist the Dutch Sea Beggars and Protestant rebels fighting the Duke of Alba?",
      model_answer: "Spain enforced a strict mercantilist monopoly prohibiting foreign vessels from trading in the New World without a Spanish royal licence, which was rarely granted. Elizabeth harboured Dutch 'Sea Beggars' in English ports and allowed English volunteers to fight in the Netherlands because Spanish control of the Low Countries directly threatened the English Channel and London's vital wool trade."
    },
    {
      type: "youtube",
      id: "zSXrGr3H4K4",
      url: "https://www.youtube.com/watch?v=zSXrGr3H4K4",
      title: "Pirate Massacre at San Juan de Ulúa: Francis Drake | Past Historical Events",
      duration: "5 mins 15 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:15 | Lesson Phase: Maritime Flashpoint | Tone Alert: Dramatic documentary recounting the 1568 Spanish surprise attack on John Hawkins and Francis Drake at San Juan de Ulúa (Mexico).",
      viewing_task: "[01:50] Treachery: How did Spanish Viceroy Martín Enríquez violate a pledged truce with Hawkins at San Juan de Ulúa in September 1568?\n[04:00] Vengeance: How did the escape of the Judith transform Francis Drake's personal vendetta against the Spanish Empire?",
      model_answer: "Hawkins entered the Mexican harbour under a peace agreement to repair storm damage, but the Spanish viceroy launched a surprise ambush with hidden gunboats, destroying four English ships and slaughtering dozens of sailors. Drake escaped aboard the tiny Judith and vowed personal revenge against Philip II, dedicating the rest of his life to plundering Spanish treasure fleets across the Atlantic and Pacific."
    },
    {
      type: "youtube",
      id: "S78nvATXBf0",
      url: "https://www.youtube.com/watch?v=S78nvATXBf0",
      title: "GCSE History Rapid Revision: Elizabethan England - War with Spain | MrClokeHistory",
      duration: "6 mins 45 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Chronological Turning Point | Tone Alert: Detailed breakdown of the assassination of William the Silent (1584), Treaty of Joinville, and Treaty of Nonsuch (1585).",
      viewing_task: "[02:00] Treaty of Joinville: Why did the secret 1584 pact between Spain and the French Catholic League terrify the English Privy Council?\n[04:15] Treaty of Nonsuch: What terms did Elizabeth agree to in August 1585 that effectively marked the declaration of open war with Spain?",
      model_answer: "The 1584 Treaty of Joinville allied Philip II with the French Catholic Guise family, removing the traditional rivalry between France and Spain and raising the nightmare scenario of a united Catholic invasion of England. In August 1585, Elizabeth signed the Treaty of Nonsuch, pledging to finance and send 7,400 English soldiers under Robert Dudley to aid the Dutch rebels, turning covert conflict into open war."
    }
  ],

  // L7: The Outbreak of War with Spain, 1585–1588
  "lesson_2_3": [
    {
      type: "youtube",
      id: "33zs4b3iyyw",
      url: "https://www.youtube.com/watch?v=33zs4b3iyyw",
      title: "Early Elizabethan England: The Netherlands and Cadiz | The History Teacher",
      duration: "6 mins 10 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Focuses on Robert Dudley's Dutch campaign (1585–87) and Drake's daring amphibious raid on Cádiz (1587).",
      viewing_task: "[01:30] Leicester's Campaign: Why did Robert Dudley's acceptance of the title 'Governor-General of the United Provinces' infuriate Queen Elizabeth?\n[03:45] Drake's Raid: What was the military significance of Drake's raid on Cádiz harbour in April 1587 ('Singeing the King of Spain's Beard')?",
      model_answer: "Elizabeth was furious because Dudley's title implied that she was deposing Philip II and seizing sovereign control over the Netherlands, which she had explicitly promised not to do. Drake sailed directly into Cádiz harbour, sank or captured over 30 Spanish warships and supply vessels, and seized vital seasoned barrel staves, delaying the sailing of the Armada by over twelve months."
    },
    {
      type: "youtube",
      id: "N-GS5WjdVQk",
      url: "https://www.youtube.com/watch?v=N-GS5WjdVQk",
      title: "29th April 1587: Singeing the King of Spain's Beard | HistoryPod",
      duration: "2 mins 45 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–02:45 | Lesson Phase: Tactical Micro-Study | Tone Alert: High-density chronological overview of Drake's raid on Cádiz and the destruction of barrel staves.",
      viewing_task: "[00:50] Tactical Maneuver: How did Drake utilize English galleon maneuverability inside the crowded harbour of Cádiz?\n[02:05] Strategic Impact: Why did the destruction of thousands of seasoned oak barrel staves prove catastrophic for Spanish sailors in 1588?",
      model_answer: "Drake boldly sailed into the narrow bay of Cádiz, outgunning Spanish galleys whose fixed forward guns could not pivot against fast-tacking English race-built galleons. The burning of seasoned oak barrel staves forced the Spanish to construct barrels from unseasoned green wood for the 1588 Armada; the green barrels leaked drinking water and spoiled salted food, causing mass dysentery and disease before the fleet even fought."
    },
    {
      type: "youtube",
      id: "W1TwWKXjUII",
      url: "https://www.youtube.com/watch?v=W1TwWKXjUII",
      title: "Early Elizabethan England: KT 2.3 Outbreak of War with Spain | VHS History",
      duration: "8 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Strategic Assessment | Tone Alert: Examines Philip II's master invasion strategy combining the Medina-Sidonia naval fleet with Parma's army in the Netherlands.",
      viewing_task: "[01:45] Spanish Plan: What was Philip II's grand strategic plan for the Enterprise of England in 1588?\n[04:20] Fatal Flaw: What critical communication and coordination flaw existed between the Duke of Medina-Sidonia and the Duke of Parma?",
      model_answer: "Philip planned for the Armada of 130 ships to sail up the English Channel, anchor off the Flemish coast, and convoy the Duke of Parma's veteran army of 30,000 soldiers across in flat-bottomed barges to invade Kent. The fatal flaw was that Parma possessed no deep-water port in the Netherlands; Dutch flyboats blockaded Parma's shallow canals, and communications by horseback took over 48 hours, leaving Medina-Sidonia stranded without cover."
    }
  ],

  // L8: The Spanish Armada: Strategy, Conflict & Defeat, 1588
  "lesson_2_4": [
    {
      type: "youtube",
      id: "F29glmRlDx0",
      url: "https://www.youtube.com/watch?v=F29glmRlDx0",
      title: "The Battle of Gravelines: How the Spanish Armada Lost Its Chance | Whys & Wows",
      duration: "5 mins 45 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:45 | Lesson Phase: Starter Hook | Tone Alert: Animated tactical breakdown of the Armada's crescent formation, the fireship attack at Calais, and the climactic cannon engagement at Gravelines.",
      viewing_task: "[01:30] Calais Fireships: Why did the launch of eight burning fireships off Calais on the night of 7 August 1588 cause utter panic among the Spanish fleet?\n[03:45] Battle of Gravelines: How did English race-built galleons under Drake and Howard defeat the dispersed Spanish ships on 8 August?",
      model_answer: "The Spanish captains feared the fireships were 'hellburners' packed with explosives like those used in Antwerp; they panicked, cut their anchor cables, and scattered blindly into the North Sea, permanently shattering their protective crescent formation. At Gravelines, English galleons used superior maneuverability and quick-reloading long-range culverin cannon to batter Spanish hulls without coming within range of Spanish grappling hooks or boarding parties."
    },
    {
      type: "youtube",
      id: "O3JvGI4IqHY",
      url: "https://www.youtube.com/watch?v=O3JvGI4IqHY",
      title: "Queen Elizabeth I Speech at Tilbury - Spanish Armada | Screen Tell",
      duration: "3 mins 10 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–03:10 | Lesson Phase: Royal Oratory | Tone Alert: Archival recital of Elizabeth's historic Tilbury address to the English land forces assembled in Essex.",
      viewing_task: "[01:15] Analysis: Identify the famous rhetoric Elizabeth used to reconcile her gender with monarchical military command.\n[02:40] Disciplinary Significance: Why was the Tilbury speech delivered on 9 August 1588, after the Battle of Gravelines had already been fought?",
      model_answer: "Elizabeth famously declared: 'I know I have the body of a weak and feeble woman; but I have the heart and stomach of a king, and of a king of England too.' Although Gravelines had been won on 8 August, news travelled slowly and the government feared the Duke of Parma might still attempt a crossing from Flanders; the speech rallied morale and permanently mythologized Elizabeth as Protestant England's divine protector."
    },
    {
      type: "youtube",
      id: "-W4iFmJQfQw",
      url: "https://www.youtube.com/watch?v=-W4iFmJQfQw",
      title: "Elizabeth: The Golden Age (2007) - The Queen's Speech Scene | Movieclips",
      duration: "2 mins 15 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:15 | Lesson Phase: Cinematic Dramatization | Tone Alert: Cate Blanchett's dramatic interpretation of Elizabeth riding on horseback in silver breastplate at Tilbury.",
      viewing_task: "[00:45] Visual Analysis: How does the cinematography present Elizabeth as both divine sovereign and warrior queen?\n[01:50] Evaluation: How did Protestant propaganda portray the stormy weather ('Protestant Wind') that destroyed Spanish ships off Ireland and Scotland?",
      model_answer: "The film uses low-angle heroic tracking shots of Elizabeth in gleaming armour on a white steed, holding a sword while addressing thousands of cheering troops. Protestant propagandists struck commemorative medals declaring 'He blew with his winds, and they were scattered' (Afflavit Deus et dissipati sunt), claiming that God had directly intervened with storms to destroy the Catholic invaders."
    }
  ],

  // L9: Education and Leisure in Elizabethan England, 1558–1588
  "lesson_3_1": [
    {
      type: "youtube",
      id: "ZdHP5b4Uwbw",
      url: "https://www.youtube.com/watch?v=ZdHP5b4Uwbw",
      title: "Elizabethan Education: Early Elizabethan England | The History Teacher",
      duration: "5 mins 35 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Examines Petty schools, Grammar schools, universities, and social class stratification in Tudor schooling.",
      viewing_task: "[01:30] Social Divide: What was the primary curriculum in Elizabethan Grammar schools, and which social class attended them?\n[03:45] Gender: How did educational opportunities differ dramatically between boys and girls of the Tudor gentry and yeomanry?",
      model_answer: "Grammar schools taught boys from the gentry, professional, and wealthy merchant classes, focusing heavily on Latin grammar, classical literature, Greek, rhetoric, and arithmetic. Girls from wealthy families were educated at home by private governesses in domestic needlework, music, French, and household management, while lower-class girls received no formal schooling."
    },
    {
      type: "youtube",
      id: "D1rbtHchv1g",
      url: "https://www.youtube.com/watch?v=D1rbtHchv1g",
      title: "Shakespeare's Theatre: The Globe & Bankside Spectacles | BBC Teach",
      duration: "4 mins 50 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:50 | Lesson Phase: Cultural Geography | Tone Alert: Explores the commercial theatre boom on London's Southwark Bankside, outside City jurisdiction.",
      viewing_task: "[01:20] Bankside: Why were commercial theatres like The Theatre, The Curtain, and The Rose built outside the City of London walls?\n[03:30] Audience: How did the architecture of public playhouses reflect Elizabethan social hierarchy (Groundlings vs Galleries)?",
      model_answer: "The Puritan-dominated City of London authorities banned theatres within city walls, viewing them as centres of disease, petty crime, prostitution, and sinful distraction from church. The architecture accommodated all social strata: ordinary labourers ('groundlings') paid 1 penny to stand in the open pit exposed to rain, while wealthier merchants and nobles paid 2 to 3 pence for covered seats in the galleries."
    },
    {
      type: "youtube",
      id: "ppK3whoRMDY",
      url: "https://www.youtube.com/watch?v=ppK3whoRMDY",
      title: "Sport, Pastimes, and Theatre in Elizabethan England | The History Teacher",
      duration: "6 mins 25 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Popular Culture | Tone Alert: Explores violent sports (bear baiting, cock fighting, folk football) alongside aristocratic hunting and court masques.",
      viewing_task: "[01:45] Popular Blood Sports: Why were spectacles like bear-baiting and bull-baiting so intensely popular across all social classes in Tudor England?\n[04:00] Class Distinction: How did elite leisure pursuits (hunting, hawking, archery) serve to display status and martial readiness?",
      model_answer: "Blood sports were popular because audiences enjoyed visceral violence, gambling on animal fights was common, and royal figures like Queen Elizabeth actively patronised bear pits at Southwark. Elite pursuits like hawking and hunting required vast private enclosed parklands, expensive pedigree animals, and mastery of horsemanship, serving as exclusive displays of wealth, nobility, and military prowess."
    }
  ],

  // L10: The Problem of the Poor and Vagrancy, 1558–1588
  "lesson_3_2": [
    {
      type: "youtube",
      id: "VZJCIOmwJUg",
      url: "https://www.youtube.com/watch?v=VZJCIOmwJUg",
      title: "Revision Video: Causes of Poverty in Elizabethan England | Tracy Borman",
      duration: "6 mins 40 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Explores the demographic explosion, bad harvests, debasement of currency, and the collapse of the Antwerp cloth trade.",
      viewing_task: "[01:30] Demographics: Why did population growth from 2.8 million to over 4 million cause severe inflation and wage depression?\n[03:45] Agriculture: How did sheep farming and land enclosure accelerate the eviction of tenant farmers and rural unemployment?",
      model_answer: "Rapid population growth caused food demand to outstrip supply, driving up bread prices while creating an oversupply of rural labourers that suppressed wages. Landowners discovered that sheep farming for the wool trade was far more profitable than arable farming; they enclosed common lands with hedges and evicted tenant farming families, leaving thousands of displaced peasants landless and unemployed."
    },
    {
      type: "youtube",
      id: "Odvchz9EVbI",
      url: "https://www.youtube.com/watch?v=Odvchz9EVbI",
      title: "The 1601 Elizabethan Poor Law Explained | Door of the Past",
      duration: "5 mins 05 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:05 | Lesson Phase: Legislative Evolution | Tone Alert: Examines the moral distinction between the 'deserving' (impotent) poor and the 'undeserving' (idle) poor across the 1572, 1576, and 1601 acts.",
      viewing_task: "[01:40] Categorisation: How did Tudor legislation distinguish between the 'impotent poor' and the 'idle vagabond'?\n[03:30] Solutions: What practical relief mechanisms did the 1576 Act for the Relief of the Poor introduce to put the able-bodied to work?",
      model_answer: "The impotent poor (the elderly, sick, orphans, disabled) were recognized as poor through no fault of their own, whereas idle vagabonds were viewed as criminal fraudsters who chose not to work. The 1576 Act ordered town authorities to provide a collective stock of raw materials (wool, hemp, iron) so the able-bodied unemployed could work in Houses of Correction rather than wander the highways."
    },
    {
      type: "youtube",
      id: "l_XAxCQvWZQ",
      url: "https://www.youtube.com/watch?v=l_XAxCQvWZQ",
      title: "Poverty: Causes and Changes - Early Elizabethan England | The History Teacher",
      duration: "7 mins 10 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Social Control & Enforcement | Tone Alert: Explores severe corporal punishments (whipping, ear-boring, hanging) and the introduction of local poor rates.",
      viewing_task: "[02:10] Punishments: What gruesome punishments did the 1572 Vagrancy Act prescribe for convicted beggars caught without a licence?\n[04:30] Taxation: Why was the introduction of a compulsory parish poor rate a revolutionary development in English local government?",
      model_answer: "Under the 1572 Act, vagabonds over fourteen were publicly whipped and burned through the gristle of the right ear with a hot iron for a first offence; repeated offences carried the death penalty by hanging. Compulsory poor rates marked the historic transition from voluntary church charity to statutory local taxation, establishing that the State held legal responsibility for funding welfare support for impoverished citizens."
    }
  ],

  // L11: Exploration and Voyages of Discovery, 1558–1588
  "lesson_3_3": [
    {
      type: "youtube",
      id: "3GkImOV1iaM",
      url: "https://www.youtube.com/watch?v=3GkImOV1iaM",
      title: "13th December 1577: Francis Drake departs Plymouth on his Circumnavigation | HistoryPod",
      duration: "2 mins 37 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:37 | Lesson Phase: Starter Hook | Tone Alert: Crisp chronological breakdown of Drake sailing from Plymouth aboard the Pelican (Golden Hind).",
      viewing_task: "[00:50] Voyage Objectives: What official public purpose and secret royal mission was Drake given when leaving Plymouth in 1577?\n[01:55] Route: Which perilous maritime passage did Drake navigate to enter the Pacific Ocean?",
      model_answer: "Publicly, Drake was sent to explore trade routes to the Nile and South America; privately, Queen Elizabeth and her investors tasked him with plundering unprotected Spanish ports and silver ships along the Pacific coast of South America. Drake navigated the treacherous Straits of Magellan at the southern tip of South America, renaming his flagship the Golden Hind upon entering the Pacific."
    },
    {
      type: "youtube",
      id: "WiwEwSdKh0c",
      url: "https://www.youtube.com/watch?v=WiwEwSdKh0c",
      title: "Francis Drake Sails Around the World | Epic History",
      duration: "14 mins 00 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:30 | Lesson Phase: Enquiry Depth | Tone Alert: Masterpiece cartographic and documentary exploration of the capture of the Cacafuego, exploration of Nova Albion (California), and return across the Indian Ocean.",
      viewing_task: "[02:30] Treasure Raid: What vast treasure did Drake seize from the Spanish galleon Nuestra Señora de la Concepción (Cacafuego) off Ecuador?\n[05:15] Geopolitical Return: When Drake returned to Deptford in 1580, how did Elizabeth's decision to knight him aboard the Golden Hind provoke King Philip II?",
      model_answer: "Drake seized 26 tons of silver, 80 pounds of gold, and thirteen chests of coins and jewels worth over £400,000—more than England's entire annual crown revenue. Philip II demanded Drake's extradition and execution as an illegal pirate; Elizabeth openly defied Spain by boarding the Golden Hind at Deptford and knighting Drake, legitimizing his plunder and sharing in the colossal profits."
    },
    {
      type: "youtube",
      id: "YnZ1GaPo3Wk",
      url: "https://www.youtube.com/watch?v=YnZ1GaPo3Wk",
      title: "Exploration in the Elizabethan Age: Technology & New Trade Routes | Scott Thomas",
      duration: "5 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Technological Revolution | Tone Alert: Explores navigational advances: Mercator projections, astrolabes, cross-staffs, magnetic compasses, and race-built galleons.",
      viewing_task: "[01:30] Navigation Tech: How did instruments like the astrolabe, cross-staff, and quadrant enable oceanic navigators to calculate latitude?\n[03:45] Ship Architecture: How did English 'race-built' galleons designed by John Hawkins differ from bulky Spanish carracks?",
      model_answer: "Navigators used the astrolabe and quadrant to measure the exact angular altitude of the North Star or midday sun above the horizon, allowing accurate calculation of their north-south latitude at sea. John Hawkins stripped away towering fore- and aft-castles, lowered the ship's profile in the water, and increased length-to-beam ratio, creating faster, more maneuverable race-built galleons capable of tacking close to the wind."
    }
  ],

  // L12: Raleigh and the Colonisation of Virginia, 1584–1590
  "lesson_3_4": [
    {
      type: "youtube",
      id: "pNmO9wEqxqU",
      url: "https://www.youtube.com/watch?v=pNmO9wEqxqU",
      title: "Sir Walter Raleigh & the Failure of Roanoke | The History Teacher",
      duration: "5 mins 15 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:15 | Lesson Phase: Starter Hook | Tone Alert: Comprehensive examination of Walter Raleigh's patent, Amadas and Barlowe expedition (1584), and Richard Grenville's 1585 voyage.",
      viewing_task: "[01:45] Royal Patent: What royal privileges did Elizabeth grant Sir Walter Raleigh in March 1584 to establish English settlements in North America?\n[03:50] Colony Location: Why did Raleigh choose Roanoke Island off the coast of modern North Carolina for the first settlement?",
      model_answer: "Elizabeth granted Raleigh a royal patent giving him exclusive proprietary rights to explore, settle, and govern any lands not possessed by Christian princes, with one-fifth of all gold and silver reserved for the Crown. Roanoke Island was chosen because the barrier islands offered natural concealment from roving Spanish naval patrols while providing access to fertile soil and friendly indigenous tribes reported by early scouts."
    },
    {
      type: "youtube",
      id: "mpL0n5WlNDA",
      url: "https://www.youtube.com/watch?v=mpL0n5WlNDA",
      title: "GCSE History Rapid Revision: The Virginia Project - Why Did It Fail? | MrClokeHistory",
      duration: "4 mins 20 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:20 | Lesson Phase: Causal Analysis | Tone Alert: Structured breakdown of the failure of the 1585 and 1587 Roanoke voyages (poor leadership, supplies, conflict with Chief Wingina).",
      viewing_task: "[01:30] Logistical Crisis: Why did the loss of the supply ship Tiger ruin the 1585 expedition before the settlers even landed?\n[03:10] Indigenous Conflict: How did Ralph Lane's aggressive paranoia lead to the murder of Algonquian Chief Wingina in 1586?",
      model_answer: "The flagship Tiger ran aground on shallow shoals, flooding its cargo hold and spoiling virtually all the expedition's seed wheat, food provisions, and livestock, forcing the colonists to depend entirely on local tribes for survival. Ralph Lane suspected the local Secotan tribe planned to starve the colonists; he launched a preemptive strike, ambush-murdering Chief Wingina and decapitating him, making peaceful co-existence impossible."
    },
    {
      type: "youtube",
      id: "sckzQiXapk8",
      url: "https://www.youtube.com/watch?v=sckzQiXapk8",
      title: "The Colony of Roanoke’s Mysterious Disappearance | The UnXplained (HISTORY)",
      duration: "4 mins 35 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:35 | Lesson Phase: Archival Mystery | Tone Alert: Investigates the 1587 'Lost Colony' under John White and the cryptic carving 'CROATOAN' found in 1590.",
      viewing_task: "[01:20] Delayed Relief: Why was John White unable to return with relief supplies to Roanoke between 1587 and 1590?\n[03:30] The Clue: What clues did White discover carved into the palisade post upon finally reaching the deserted settlement in August 1590?",
      model_answer: "White was trapped in England because Queen Elizabeth requisitioned all seaworthy vessels to defend the realm against the imminent Spanish Armada in 1588. When White finally returned in 1590, the settlement was deserted with no signs of struggle; carved on a wooden post was the word 'CROATOAN' and on a tree 'CRO', indicating the surviving settlers had relocated peacefully to live with the nearby Croatoan tribe on Hatteras Island."
    }
  ]
};

// Apply video arrays to eeeData
let updatedCount = 0;
eeeData.lessons.forEach(lesson => {
  if (eeeVideoMap[lesson.id]) {
    lesson.video = eeeVideoMap[lesson.id];
    updatedCount++;
    console.log(`Updated lesson ${lesson.id} with ${lesson.video.length} verified videos.`);
  } else {
    console.warn(`No video map for lesson ${lesson.id}`);
  }
});

// Write to units/eee/data.js
const serialized = `// EEE Unit Data - Calibrated with 100% Traceable Quizzes\nconst eee_data = ${JSON.stringify(eeeData, null, 2)};\n\nexport default eee_data;\n`;
fs.writeFileSync(dataJsPath, serialized, 'utf8');
console.log(`Wrote updated data to ${dataJsPath}`);

// Write to public/units/eee/data.js
fs.writeFileSync(pubDataJsPath, serialized, 'utf8');
console.log(`Wrote updated data to ${pubDataJsPath}`);

console.log(`Successfully recalibrated all ${updatedCount} Early Elizabethan England lessons!`);

