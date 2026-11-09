// scripts/calibrate_eee.cjs
// Calibrates all 36 exam questions in Early Elizabethan England (eee.json)
// - 24 2m feature questions: strictly 25-35 words (tier_2m)
// - 6 12m causation questions: strictly 208-236 words (tier_12m)
// - 6 16m evaluative essays: strictly 245-275 words (tier_16m)

const eee12m = {
  "lesson_1_1": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Elizabeth’s legitimacy was questioned because Catholics thought Henry VIII’s divorce from Catherine of Aragon was illegal, so Anne Boleyn was not his real wife. Also, Parliament had passed a law saying Elizabeth was illegitimate after Anne was executed. Finally, Mary, Queen of Scots had a strong claim to the throne and Catholics supported her instead.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason Elizabeth's legitimacy was questioned was Catholic rejection of Henry VIII's marriage to Anne Boleyn. Catholics believed marriage was a holy sacrament and only the Pope could dissolve it. Because the Pope refused Henry's annulment from Catherine of Aragon, Catholics viewed Elizabeth as illegitimate.<br><br>Furthermore, English statute law undermined her position. Following Anne Boleyn's execution in 1536, the Second Succession Act declared Elizabeth a bastard. While the 1544 Act restored her to the succession, it never repealed her illegitimacy.<br><br>Finally, Mary, Queen of Scots offered an alternative Catholic claimant. As Henry VII's great-granddaughter, European Catholics saw Mary as the rightful queen.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One major reason Elizabeth’s legitimacy was questioned was Catholic rejection of Henry VIII’s marriage to Anne Boleyn. Roman Catholic doctrine held marriage to be an indissoluble sacrament that only the Pope could dissolve. Because Pope Clement VII refused to annul Henry's marriage to Catherine of Aragon, English Catholics and European powers viewed Henry’s 1533 secret wedding to Anne as adulterous. Therefore, this forced devout Catholics to view Elizabeth as illegitimate by birth because under canon law she was barred from inheriting the royal throne.</p><p>Furthermore, Elizabeth’s legitimacy was undermined by English statute law and Henry VIII’s own succession legislation. Following Anne Boleyn’s execution for treason in 1536, Parliament passed the Second Act of Succession, which legally declared Elizabeth a bastard. Although Henry’s 1544 Act restored Elizabeth to the line of succession behind Edward and Mary, it never repealed the legal declaration of illegitimacy. Therefore, this created severe constitutional instability because legal ambiguity allowed domestic rivals to challenge her legal title to reign in 1558.</p><p>Finally, challenges were magnified by the existence of an alternative legitimate Catholic claimant in Mary, Queen of Scots. As the legitimate great-granddaughter of Henry VII through Margaret Tudor, Mary held an unblemished hereditary claim. In 1558, Mary’s husband, King Francis II of France, openly quartered the English arms with Mary's. Therefore, this resulted in heightened questioning of Elizabeth’s crown because international Catholic monarchies recognised Mary Stuart as the true de jure Queen of England.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  },

  "lesson_1_3": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Puritans challenged the Religious Settlement because they wanted a completely Protestant church without any Catholic decorations. They hated priests wearing white surplices and thought they looked like Catholic vestments. They were also influenced by Calvinist churches in Europe, and they disliked bishops running the church instead of elders.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason Puritans challenged the Settlement was the issue of clerical vestments. Puritans objected to the white linen surplice, calling it a popish rag. In the 1566 Vestiarian Controversy, 37 London clergymen were dismissed by Archbishop Parker for refusing to wear it.<br><br>Furthermore, many Puritans were Marian exiles who had lived in Geneva under John Calvin. They returned to England expecting total reform, but Elizabeth kept organs, crucifixes, and kneeling at Communion.<br><br>Finally, radical Puritans opposed bishops and wanted a Presbyterian system with elected elders, challenging royal control over religion.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One primary reason Puritans challenged the Religious Settlement was the retention of traditional Catholic vestments, which they condemned as unscriptural idolatry. Radical Calvinists believed church services must be purified of all Roman Catholic rituals. In the Vestiarian Controversy of 1566, Archbishop Matthew Parker’s *Book of Advertisements* made the white linen surplice compulsory. When 37 London clergymen refused to comply and were dismissed, Puritans mounted open resistance. Therefore, this provoked a direct liturgical challenge to the Settlement because Puritans placed divine scriptural purity above the Queen's royal authority.</p><p>Furthermore, discontent was driven by the radical theological expectations of returning Marian exiles. Under Mary I, hundreds of English Protestants had fled to European Calvinist cities like Geneva, experiencing churches stripped of hierarchy and ritual. When they returned in 1558, they anticipated a thoroughly reformed church, but Elizabeth insisted on traditional crucifixes, church music, and kneeling at communion to satisfy Catholic moderates. Therefore, this led to active Puritan opposition because zealous reformers felt the Queen had compromised true religion with popish superstition.</p><p>Finally, radical Puritans challenged the governance of the Elizabethan Church by opposing the episcopal structure of bishops. Influenced by Thomas Cartwright, Presbyterians demanded that bishops be abolished and replaced by locally elected elders, removing the Crown’s right to appoint church leaders. Therefore, this resulted in severe Crown hostility because Presbyterian governance threatened Elizabeth's supreme constitutional authority as Supreme Governor of the Church of England.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  },

  "lesson_2_1": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Mary, Queen of Scots was executed in 1587 because she was involved in Catholic plots to kill Elizabeth. The Babington Plot in 1586 had secret letters showing Mary agreed to the assassination. Also, Sir Francis Walsingham’s spy network gathered proof against her. Finally, the threat of a Spanish invasion meant keeping Mary alive was too dangerous.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason Mary was executed was her involvement in Catholic plots like the Ridolfi, Throckmorton, and Babington Plots. In 1586, Anthony Babington used coded letters hidden in beer barrels to plan Elizabeth's murder, and Mary wrote back approving the plan.<br><br>Furthermore, Sir Francis Walsingham’s spy network intercepted the letters and had codebreaker Thomas Phelippes decode them, providing direct written proof of Mary's treason.<br><br>Finally, after the 1584 Bond of Association and the outbreak of war with Spain, Parliament pressured a reluctant Elizabeth to sign Mary’s death warrant to protect Protestant England.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One primary reason Mary, Queen of Scots was executed was her direct complicity in the 1586 Babington Plot to assassinate Elizabeth. Anthony Babington organised a conspiracy with French and Spanish backers to murder the Queen and place Mary on the throne. Crucially, Mary sent coded replies endorsing the assassination plot. Therefore, this led directly to Mary's execution because her written correspondence provided undeniable, treasonous proof of conspiring against the life of an anointed monarch.</p><p>Furthermore, execution was made inevitable by the relentless intelligence operation orchestrated by Sir Francis Walsingham. Walsingham’s double agents intercepted Mary's beer-barrel correspondence, allowing codebreaker Thomas Phelippes to decipher her letters and add a forged gallows symbol. Armed with this conclusive evidence, Parliament tried Mary under the 1585 Act for the Queen’s Safety, finding her guilty of high treason. Therefore, this forced the Privy Council to demand Mary's death because the legal establishment now viewed her continued survival as an existential security risk.</p><p>Finally, Mary’s execution was accelerated by the escalating geopolitical threat of war with Catholic Spain. Following the 1585 Treaty of Nonsuch, Philip II was preparing the Armada to invade England. As long as Mary lived, she served as an inspirational Catholic figurehead for foreign invaders and domestic rebels. Therefore, this resulted in Elizabeth finally signing the death warrant in February 1587 because eliminating Mary permanently removed Spain’s primary political candidate to replace the Protestant regime.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  },

  "lesson_2_3": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>England became involved in the Netherlands in 1585 because the Dutch Protestants were being crushed by the Spanish army. When William the Silent was assassinated, the rebellion was about to collapse. Also, England relied on cloth trade through Antwerp, and Elizabeth feared Spain would use Dutch ports to launch an invasion of England.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason England intervened was the assassination of William of Orange in 1584, which left the Dutch Protestant rebels leaderless against the Duke of Parma's advancing Spanish army.<br><br>Furthermore, the 1584 Treaty of Joinville allied Catholic France with Philip II of Spain, creating a deadly Catholic coalition and ending English hopes of French intervention in the Low Countries.<br><br>Finally, strategic defense drove Elizabeth to act. If Spain controlled the Channel coast, they could easily invade England, so Elizabeth signed the 1585 Treaty of Nonsuch.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One decisive reason England intervened in the Netherlands in 1585 was the imminent military collapse of the Dutch Protestant Revolt. In July 1584, the rebel leader William the Silent was assassinated by a Catholic fanatic, leaving the United Provinces leaderless. Simultaneously, the Spanish commander, the Duke of Parma, made rapid advances, capturing Antwerp in August 1585. Therefore, this forced Elizabeth to intervene with 7,300 troops because the complete destruction of Dutch Protestantism would leave Philip II with unchecked military dominance directly opposite England's coast.</p><p>Furthermore, intervention was triggered by the dangerous diplomatic realignment sealed in the Treaty of Joinville (December 1584). This secret pact united Philip II of Spain with the French Catholic League, neutralizing French opposition and uniting Europe’s two Catholic superpowers against Protestant heresy. Elizabeth could no longer play France off against Spain in the Low Countries. Therefore, this led directly to the 1585 Treaty of Nonsuch because England was isolated and faced a united Catholic front committed to crushing Protestantism.</p><p>Finally, England intervened to safeguard vital national commercial interests and maritime security. English woolen cloth exports were traditionally marketed through Antwerp, and Spanish trade bans had severely harmed the English economy. More critically, deep-water ports like Flushing and Brill could host Spanish invasion fleets. Therefore, this resulted in direct English military intervention under Robert Dudley because garrisoning Dutch ports protected English merchant shipping and prevented an amphibious invasion across the English Channel.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  },

  "lesson_3_1": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Education expanded in Elizabethan England because the Renaissance made people value humanist learning and classical languages like Latin and Greek. Also, merchants and businesses needed people who could read, write, and calculate accounts. Finally, the Protestant Reformation encouraged people to read the English Bible to practice their faith.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason education expanded was the influence of the Renaissance and humanism. Humanists believed education improved character and trained gentlemen for government service, leading to the foundation of over 70 new grammar schools.<br><br>Furthermore, business and trade growth created a practical need for literacy and numeracy. Merchants and Yeomen needed to write contracts and keep accounts, boosting petty schools.<br><br>Finally, Protestantism required believers to read scripture for themselves, so reading the Great Bible became an important religious duty.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One primary reason education expanded was the growing influence of Renaissance humanism. Humanist scholars argued that education cultivated civic virtue and prepared gentlemen for government administration rather than simple military service. Reflecting this philosophy, over 70 new grammar schools were founded, offering classical curricula in Latin, Greek, and rhetoric. Therefore, this caused a major expansion in schooling because the ambitious gentry viewed classical learning as the essential gateway to political office and social status.</p><p>Furthermore, the growth of domestic and international commerce created an urgent demand for a literate workforce. Expanding textile markets and joint-stock trading ventures required merchants and yeomen to draft contracts, maintain double-entry ledgers, and manage currency exchange. To satisfy this functional commercial need, hundreds of fee-paying petty schools opened in market towns. Therefore, this led directly to higher educational enrollment because basic literacy and numeracy became indispensable for commercial prosperity and legal business.</p><p>Finally, the consolidation of the Protestant Reformation provided a powerful religious incentive for mass literacy. Protestantism placed *sola scriptura*—the personal reading of God's Word—at the heart of faith. The 1559 Royal Injunctions ordered every parish to hold an English Great Bible, compelling parents to ensure children could read the catechism. Therefore, this resulted in sustained educational growth because Protestant families viewed literacy as a moral duty essential for personal salvation.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  },

  "lesson_3_3": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Francis Drake circumnavigated the globe between 1577 and 1580 because he wanted to raid Spanish treasure ships along the Pacific coast of South America. He also wanted to find new trade routes to the Spice Islands to buy valuable cloves. Finally, Elizabeth wanted to challenge King Philip II and prove English sailors were world-class.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative description identifying three reasons, but lacking developed causal analysis or specific legal details."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Explanation)",
      "text": "<p>One reason Drake circumnavigated the globe was to plunder Spanish treasure along the unprotected Pacific coast of South America. In 1579, he captured the galleon *Cacafuego*, taking £400,000 of silver.<br><br>Furthermore, English merchants wanted to break Iberian trading monopolies and reach the Spice Islands directly after the Antwerp cloth trade collapsed. Drake signed a trade treaty with the Sultan of Ternate for cloves.<br><br>Finally, Elizabeth secretly backed the voyage to challenge Philip II’s empire and claim lands like Nova Albion for England.</p>",
      "verdict": "AO1/AO2 (6 marks). Two to three reasons identified with accurate context, but links remain descriptive rather than directly explaining the causal mechanism."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One primary reason Drake circumnavigated the globe was the immense financial profit to be gained from raiding unfortified Spanish ports along the Pacific coast of South America. Secretly backed by Elizabeth, Drake entered the Pacific via the Straits of Magellan, surprising undefended Spanish settlements. In 1579, Drake captured the treasure galleon *Cacafuego*, seizing over £400,000 in silver bullion. Therefore, this led directly to Drake's voyage because the lure of vast plundered wealth provided an irresistible financial incentive for royal and private backers.</p><p>Furthermore, Drake sailed to pioneer alternative global trade routes and bypass Spanish and Portuguese commercial monopolies. England’s Antwerp cloth trade had collapsed during the Dutch Revolt, forcing merchants to seek direct access to the wealthy Spice Islands in the East Indies. Reaching Ternate, Drake signed a trade treaty with the local Sultan and secured six tons of cloves. Therefore, this caused the circumnavigation because establishing independent maritime routes allowed English merchants to trade directly without paying Portuguese tariffs.</p><p>Finally, the voyage served as a calculated geopolitical challenge to Philip II’s imperial dominance. Elizabeth sought to repudiate the Treaty of Tordesillas, which divided the New World between Spain and Portugal. Drake claimed 'Nova Albion' (California) and proved English seamanship was world-class. Therefore, this resulted in Drake circumnavigating the earth because returning home across the Indian Ocean demonstrated England’s ability to project naval power globally in defiance of Spain.</p>",
      "verdict": "AO1/AO2 (12 marks). Analytical, sustained explanation with 3 PEEL paragraphs, precise legal evidence, and clear causal links in every paragraph."
    }
  }
};

module.exports = { eee12m };
