/**
 * scripts/build_eee_model_tiers.cjs
 *
 * Populates Pearson Edexcel 4-Tier Examiner Ladders across all 12 lessons (36 exam questions)
 * of Early Elizabethan England (Paper 2 Option B4) and updates Medicine Lesson 2.2 in:
 * - units/eee/data.js
 * - public/units/eee/data.js
 * - src/engine/mock_exam_bank_data.js
 * - units/edexcel_medicine/data.js
 * - public/units/edexcel_medicine/data.js
 */

const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Updating Medicine Lesson 2.2 in data.js ---');

function updateMedicineFiles() {
  const files = [
    'C:/Projects/the-history-revision-hub/units/edexcel_medicine/data.js',
    'C:/Projects/the-history-revision-hub/public/units/edexcel_medicine/data.js'
  ];

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace **carefully observing...** with <strong>...</strong>
    content = content.replace(
      /\*\*carefully observing the patient's symptoms at their bedside\*\*/g,
      '<strong>carefully observing the patient\'s symptoms at their bedside</strong>'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated bolding in ${path.basename(filePath)}`);
  }
}

updateMedicineFiles();

// Load KT1, KT2, KT3 models
const KT2_MODELS = require('./generate_eee_kt2_kt3.cjs');
const KT3_MODELS = require('./generate_eee_kt3.cjs');

const KT1_MODELS = {
  lesson_1_1: {
    q1: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Privy Council in 1558 was that they were a group of nobles who advised Queen Elizabeth on important decisions about running the country.</p>",
        verdict: "AO1 (1 mark). Identifies a valid general function of the Privy Council but lacks specific supporting historical detail, named personnel, numbers, or administrative mechanisms."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Privy Council in 1558 was that it was a core body of approximately 19 trusted noble advisers (significantly reduced from Mary I's unwieldy council of 50) led by Principal Secretary William Cecil. They met almost daily to manage royal finances, military defence, and law enforcement, advising Elizabeth on policy while respecting her royal prerogative.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Accurately identifies a key feature and supports it with precise historical detail (19 members, William Cecil, daily administrative remit, relationship to royal prerogative)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Privy Council served as the constitutional engine of conciliar governance, mediating between the monarch's supreme prerogative and the administrative machinery of the Tudor state. By streamlining membership from Mary Tudor’s factional assembly of 50 down to 19 trusted statesmen dominated by William Cecil, Elizabeth institutionalized a highly efficient, Protestant-leaning bureaucratic executive capable of maintaining crown security, orchestrating parliamentary strategy, and overseeing provincial lieutenancies.</p>",
        verdict: "Scholar Distinction. Exceptional analytical depth exploring Tudor constitutional theory and conciliar streamlining."
      }
    },
    q2: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the financial weaknesses Elizabeth faced in 1558 was that the Crown was heavily in debt and did not have enough money to pay for wars.</p>",
        verdict: "AO1 (1 mark). General statement identifying Crown debt, but provides zero precise statistics, foreign lenders, or underlying fiscal causes."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the financial weaknesses Elizabeth faced in 1558 was that she inherited a crippling Crown debt of £300,000 from Mary I, largely owed to foreign financiers on the Antwerp Exchange at punishing 14% interest rates. This was compounded by falling royal revenues caused by decades of Crown land sales and the debasement of the silver coinage.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Precise historical knowledge deployed (£300,000 debt, Antwerp Exchange, 14% interest, debasement of coinage)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Tudor fiscal apparatus suffered from structural insolvency and an archaic tax assessment infrastructure. Inheriting £300,000 in short-term continental liabilities at 14% interest alongside an annual Crown income of under £290,000, Elizabeth was severely constrained in military expenditure, forcing William Cecil and Sir Thomas Gresham to pursue deflationary retrenchment, re-coinage, and Antwerp debt retirement before independent foreign policy could be contemplated.</p>",
        verdict: "Scholar Distinction. Masterful examination of Tudor fiscal constraints and international capital markets."
      }
    },
    q3: {
      stimulus: ["Anne Boleyn's marriage", "Papal authority"],
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 (Simple Statement)",
        text: "<p>Elizabeth’s legitimacy was questioned because people did not think her mother Anne Boleyn was properly married to Henry VIII. Catholics believed only the Pope could allow a divorce, so they thought Henry was still married to Catherine of Aragon. Because of this, Catholics said Elizabeth was born out of wedlock and could not be queen.</p>",
        verdict: "Level 1 (3/12 marks). Basic descriptive narrative addressing one factor in a generalized way, lacking structured PEEL development or breadth across multiple causes."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 (Descriptive Narrative)",
        text: "<p>One reason Elizabeth’s legitimacy was questioned was because Catholics did not accept Henry VIII's divorce from Catherine of Aragon. The Pope refused to grant an annulment, so Henry broke with Rome and married Anne Boleyn. Catholics viewed this marriage as illegal, meaning Elizabeth was illegitimate.<br><br>Another reason was that Henry VIII himself had declared Elizabeth illegitimate in 1536 after Anne Boleyn was executed. Although she was later put back in the succession, Henry never canceled her illegitimacy. Furthermore, Catholics believed Mary, Queen of Scots had a better claim.</p>",
        verdict: "Level 2 (6/12 marks). Identifies relevant factors with some historical knowledge, but remains primarily descriptive with limited explanation of how these factors actively undermined Elizabeth's authority."
      },
      tier_12m: {
        title: "12/12 Pearson Benchmark ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: "<p>One major reason Elizabeth’s legitimacy was questioned was Catholic rejection of Henry VIII’s marriage to Anne Boleyn. Roman Catholic doctrine held that marriage was a holy sacrament indissoluble by secular authorities, meaning Henry’s 1533 marriage to Anne could only be valid if Pope Clement VII annulled his first marriage to Catherine of Aragon. Because the Papacy adamantly refused to grant an annulment, Catholics viewed Henry’s break from Rome as heresy and his union with Anne as invalid. Consequently, devout Catholics in England and across Europe viewed Elizabeth as illegitimate by birth, making her ineligible to inherit the crown under canon law.<br><br>Furthermore, Elizabeth’s legitimacy was undermined by English statute law and Henry VIII’s own succession legislation. Following the execution of Anne Boleyn for treason in 1536, Parliament passed the Second Act of Succession, which legally declared Elizabeth illegitimate and barred her from the royal succession. Although Henry’s Third Succession Act of 1544 subsequently restored Elizabeth to the line of inheritance behind Edward and Mary, it crucially never repealed the legal declaration of her bastardy. This created a dangerous legal contradiction that domestic opponents and foreign rivals readily exploited to challenge her constitutional right to reign in 1558.<br><br>Finally, Elizabeth’s legitimacy was questioned because of the existence of a formidable alternative Catholic claimant in Mary, Queen of Scots. As the great-granddaughter of Henry VII through his eldest daughter Margaret Tudor, Mary held an unimpeachable claim under dynastic hereditary law. Catholic powers such as France, along with English Catholic traditionalists, argued that if Elizabeth was illegitimate, Mary Stuart was the lawful Queen of England. In 1558, Mary’s French husband Francis II openly quartered the English royal coat of arms with Mary’s, demonstrating that international Catholic powers viewed Elizabeth as a usurper and creating an immediate geopolitical and dynastic threat to her throne.</p>",
        verdict: "Level 4 (12/12 marks). Analytical explanation directed consistently at the question. Examines three distinct aspects of content with precise historical evidence (canon law/papal annulment, 1536/1544 Succession Acts, Mary Stuart/Francis II quartering arms) and sustained PEEL causal links throughout."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The contestation of Elizabeth’s legitimacy in 1558 represented an existential convergence of canon law, statutory ambiguity, and European dynastic rivalry.<br><br>First, ecclesiastical jurisprudence fundamentally delegitimized Elizabeth’s birth. The Petrine supremacy claimed by Rome dictated that Henry VIII’s marriage to Catherine of Aragon remained sacramental, rendering Cranmer's Dunstable annulment null and void. In the eyes of Catholic Europe, Elizabeth was not merely born out of wedlock; her very existence symbolized schism and her accession embodied heresy.<br><br>Second, Tudor statutory contradictions provided legal ammunition for sceptics. The 1536 Succession Act had established her bastardy in common law, a stigma never formally expunged by the 1544 Act. This legal anomaly compromised her royal prerogative, leaving her vulnerable to challenges in Parliament and courts of law.<br><br>Third, this ideological dispute was weaponized by the Franco-Scottish alliance. With Mary Stuart asserting her status as the legitimate de jure Catholic heir, the question of legitimacy ceased to be an academic theological dispute and became the focal point of a geopolitical campaign to unseat the Tudor settlement.</p>",
        verdict: "Scholar Distinction. Superb synthesis evaluating canon law, common law contradictions, and European dynastic geopolitics."
      }
    }
  },

  lesson_1_2: {
    q1: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Act of Supremacy (1559) was that Elizabeth made herself the head of the Church of England instead of the Pope.</p>",
        verdict: "AO1 (1 mark). Basic identification of the monarch replacing the Pope, but misstates the title (she was Supreme Governor, not Head) and lacks supporting statutory detail."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Act of Supremacy (1559) was that it revived 10 statutes from Henry VIII's reign, making Elizabeth 'Supreme Governor' of the Church of England rather than 'Supreme Head'. This deliberately tactful phrasing appeased Catholics who believed only Christ or the Pope could be head of the Church, while requiring all clergy and royal officials to swear an Oath of Supremacy under penalty of treason.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Accurately identifies the feature with precise detail (Supreme Governor vs Head, Oath of Supremacy, Henrician statute revival)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Act of Supremacy (1559) engineered an Erastian ecclesiastical settlement by establishing the English crown as the supreme jurisdictional governor of the national church. By deliberately adopting the title 'Supreme Governor' rather than Henry VIII's 'Supreme Head', Cecil and Elizabeth accommodated both Catholic ecclesiological sensibilities regarding papal Petrine primacy and Calvinist objections to female clerical authority, whilst enforcing an Oath of Supremacy that purged all 15 Marian Catholic bishops who refused to submit.</p>",
        verdict: "Scholar Distinction. Exceptional analysis of Erastian supremacy and the political optics of the Supreme Governor title."
      }
    },
    q2: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Royal Injunctions (1559) was that they gave instructions to priests about how to conduct church services.</p>",
        verdict: "AO1 (1 mark). Vague assertion without specific details about the 57 instructions, liturgical items, vestments, or Cecil's administration."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Royal Injunctions (1559) was that they comprised 57 detailed administrative instructions drafted by William Cecil to enforce the Settlement locally. They ordered every parish church to purchase an English Bible, condemned 'fake miracles' and superstitious pilgrimages, and mandated that clergy wear traditional vestments (the surplice), ensuring visual continuity for conservative worshippers.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Detailed knowledge deployed (57 rules, William Cecil, English Bible, condemnation of fake miracles, surplice requirement)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Royal Injunctions of 1559 functioned as the administrative enforcement arm of the Elizabethan Settlement, translating broad statutory principles into micro-level parish conformity. Comprising 57 directives overseen by visiting royal commissioners, the Injunctions enforced Protestant liturgical uniformity—requiring the Great Bible and Erasmus's Paraphrases in every parish—while tactically preserving visual conservative elements such as kneeling at the altar and traditional vestments to maintain social tranquility.</p>",
        verdict: "Scholar Distinction. Sophisticated evaluation of bureaucratic surveillance and visual traditionalism."
      }
    },
    q3: {
      stimulus: ["The Book of Common Prayer (1559)", "Recusancy fines"],
      tier_4m: {
        title: "4/16 One-Sided Assertion",
        score: "4 / 16 Marks",
        level: "Level 1 (Simple Statement)",
        text: "<p>I agree that the Religious Settlement was successful because Elizabeth created a middle way that stopped religious conflict. She introduced the Book of Common Prayer in 1559 which allowed both Catholics and Protestants to worship together. However, some Catholics still refused to go to church and had to pay fines. Overall it was successful because there was no civil war.</p>",
        verdict: "Level 1 (4/16 marks). Basic one-sided assertion with limited historical detail and an unsubstantiated conclusion."
      },
      tier_8m: {
        title: "8/16 Descriptive Narrative",
        score: "8 / 16 Marks",
        level: "Level 2 (Descriptive Narrative)",
        text: "<p>On the one hand, the Religious Settlement of 1559 was successful because it was a compromise known as the 'Middle Way'. Elizabeth made herself Supreme Governor instead of Supreme Head, which satisfied people who didn't want a woman leading the church. The Book of Common Prayer merged the 1549 and 1552 prayer books so that the wording about Communion could mean the real presence or just a memorial. This stopped most ordinary people from rebelling.<br><br>On the other hand, the Settlement was not completely successful because strict Catholics and Puritans were unhappy. Catholics who refused to attend Protestant services were called recusants and had to pay a fine of one shilling (12d) per week. Puritans also disliked the settlement because priests still had to wear surplices and churches kept organs and stained glass. Therefore, divisions still existed.</p>",
        verdict: "Level 2 (8/16 marks). Descriptive account covering both sides with some accurate knowledge, but lacks sustained analytical criteria, weighing of factors, or a rigorous evaluation of 'how successful'."
      },
      tier_16m: {
        title: "16/16 Pearson Benchmark ★",
        score: "16 / 16 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: "<p>The Religious Settlement of 1559 was largely successful in establishing a pragmatic, moderate compromise (the Via Media) that achieved broad compliance among the vast majority of ordinary English parishioners. Through the Act of Uniformity and the 1559 Book of Common Prayer, Elizabeth deliberately engineered a theological ambiguity that allowed traditionalists and moderate Protestants to worship side-by-side. Crucially, the 1559 Communion service combined the wording of Edward VI’s 1549 prayer book (which implied the Catholic doctrine of transubstantiation) with that of the 1552 book (which presented Communion purely as a Protestant act of remembrance). Furthermore, Elizabeth’s calculated adoption of the title 'Supreme Governor' rather than 'Supreme Head' in the Act of Supremacy appeased conservative nobles. By tolerating outward liturgical conformity while declining to 'make windows into men's souls', the Settlement successfully averted the violent confessional civil wars that consumed contemporary France and the Netherlands.<br><br>However, it can be strongly argued that the Settlement was fundamentally unsuccessful in resolving deep ideological divisions among devout Catholics. Almost the entire Marian episcopate—all 15 bishops except the Bishop of Llandaff—refused to swear the Oath of Supremacy and were forcibly deprived of their sees. Moreover, among the landed Catholic gentry, especially in the conservative North and West, compliance was merely superficial. Devout Catholics became recusants, paying the 12d weekly fine and sheltering Marian priests who celebrated illicit Latin Masses in secret chapel chambers. This ideological fracture remained a simmering domestic danger, ultimately providing the fertile ground for the 1569 Northern Rebellion and paving the way for the Pope's formal excommunication of Elizabeth in 1570.<br><br>Furthermore, the Settlement failed to satisfy radical Protestants (Puritans), who viewed the compromise as an incomplete, dangerous half-reformation. Having spent Mary’s reign in exile in Calvinist Geneva and Zurich, returning Puritan clergy were outraged by the retention of 'popish dregs' in the 1559 Royal Injunctions. They fiercely opposed the requirement for ministers to wear the surplice, the use of wedding rings, kneeling to receive Communion, and the preservation of church decoration and bishops. This discontent erupted openly in the Vestiarian Controversy of 1566, demonstrating that the Settlement had failed to assimilate the zealous Protestant wing of the English church.<br><br>In conclusion, when assessed against the criterion of short-term civil stability, the Religious Settlement was an undeniable political triumph: it prevented civil conflict, consolidated Elizabeth’s throne, and secured passive conformity from the vast majority of the population. However, when judged against the higher criterion of achieving genuine theological reconciliation, the Settlement was unsuccessful, as it permanently alienated both committed Catholics and zealous Puritans, institutionalizing religious divisions that would destabilize the remainder of Elizabeth’s reign.</p>",
        verdict: "Level 4 (16/16 marks). Comprehensive, analytical, and criteria-driven evaluation directed consistently at the question. Deploys three distinct aspects of content (theological ambiguity/Via Media, Catholic recusancy/episcopal purge, Puritan discontent/Vestiarian Controversy) supported by precise historical detail, and reaches a nuanced, sustained judgement."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The historiographical debate regarding the Elizabethan Religious Settlement turns upon the distinction between institutional containment and ideological unification.<br><br>From an institutional and Erastian perspective, the Settlement was a masterpiece of political statecraft. By deliberately crafting liturgical ambiguity within the 1559 Book of Common Prayer—juxtaposing the 1549 and 1552 Eucharistic formulae—and decoupling external civic conformity from private theological conviction, Elizabeth neutralized immediate mass rebellion, securing four decades of internal peace while the rest of Western Europe disintegrated into religious slaughter.<br><br>Conversely, from a theological perspective, the Settlement was inherently unstable. It institutionalized an uneasy hybrid: a Calvinist soteriology encapsulated in the Thirty-Nine Articles grafted onto a conservative, pre-Reformation episcopal hierarchy and traditional liturgical vestments. This structural contradiction ensured that the English Church remained perpetually contested from its inception, besieged simultaneously by Catholic Counter-Reformation treason and Puritan Presbyterian insurgency.</p>",
        verdict: "Scholar Distinction. Masterclass in historiographical analysis distinguishing between Erastian political containment and structural theological tension."
      }
    }
  },

  lesson_1_3: {
    q1: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Puritan challenge was that they refused to wear the vestments that the Queen told them to wear.</p>",
        verdict: "AO1 (1 mark). Basic identification of the vestment issue without specific dates, key figures, publications, or consequences."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Puritan challenge to the Religious Settlement was the Vestiarian Controversy of 1566, in which Archbishop Matthew Parker issued the 'Book of Advertisements' requiring all clergy to wear the white linen surplice. When 110 London priests were summoned to Lambeth Palace to conform, 37 refused to wear what they condemned as 'popish rags' and were summarily deprived of their livings.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Rich, precise detail deployed (1566, Matthew Parker, Book of Advertisements, white linen surplice, 37 London priests deprived)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Puritan challenge represented an ideological dispute over adiaphora (matters of faith deemed unessential to salvation). In the 1566 Vestiarian Crisis, radical ministers argued that because clerical vestments were not commanded in scripture, enforcing them constituted an illegitimate exercise of royal supremacy that compromised Christian conscience, prompting Archbishop Parker's disciplinary purge at Lambeth and laying the foundations for the Presbyterian movement.</p>",
        verdict: "Scholar Distinction. Nuanced theological framing analyzing adiaphora and scriptural authority."
      }
    },
    q2: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Papal Bull of 1570 was that Pope Pius V excommunicated Queen Elizabeth from the Catholic Church.</p>",
        verdict: "AO1 (1 mark). Correct identification of excommunication, but omits the title (Regnans in Excelsis), the release of Catholic subjects from loyalty, and the political fallout."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Papal Bull (Regnans in Excelsis), issued by Pope Pius V in February 1570, was that it declared Elizabeth a heretic and 'pretended Queen', released all English Catholics from their oaths of allegiance to her, and commanded them to disobey her laws under pain of excommunication. This transformed practicing English Catholics in the eyes of the Crown from religious dissenters into potential political traitors.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Precise historical knowledge deployed (Regnans in Excelsis, Pope Pius V, Feb 1570, released allegiance, legal transformation to treason)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>Regnans in Excelsis (1570) represented the ultimate deployment of papal plenitudo potestatis (fullness of power) against an Erastian monarch. By formally deposing Elizabeth and absolving her subjects of their feudal and civic allegiance, Pius V shattered the delicate compromise of passive conformity, compelling the English state to codify severe treason legislation (the 1571 Treason Act) and effectively defining Roman Catholicism as incompatible with political loyalty.</p>",
        verdict: "Scholar Distinction. Deep legal and political analysis of papal plenitudo potestatis and the 1571 Treason Act."
      }
    },
    q3: {
      stimulus: ["The Vestiarian Controversy (1566)", "Archbishop Matthew Parker"],
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 (Simple Statement)",
        text: "<p>Puritans challenged the Religious Settlement because they thought the Church of England still had too many Catholic things in it. They did not want to wear surplices and hated church music, crucifixes, and bishops. When the Archbishop of Canterbury tried to make them dress properly, they refused because they believed only the Bible should be followed.</p>",
        verdict: "Level 1 (3/12 marks). Generalized narrative without precise dates, specific theological context, or structured causal paragraphs."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 (Descriptive Narrative)",
        text: "<p>One reason Puritans challenged the Religious Settlement was the issue of church vestments. In 1566, the Vestiarian Controversy happened because Puritans refused to wear the surplice, calling it a 'popish rag'. Archbishop Matthew Parker published the Book of Advertisements to make them wear it, and 37 priests in London were suspended for refusing.<br><br>Another reason was that Puritans had returned from exile in Europe during Mary's reign. They had lived in Geneva where John Calvin's ideas were followed, so they wanted England to be completely reformed without bishops, altars, or holy days. Therefore, they challenged Elizabeth’s church.</p>",
        verdict: "Level 2 (6/12 marks). Descriptive account identifying two factors with some good details, but lacks analytical explanation of why these theological issues escalated into a direct challenge to royal supremacy."
      },
      tier_12m: {
        title: "12/12 Pearson Benchmark ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: "<p>One primary reason Puritans challenged the Religious Settlement was the persistence of ritualistic Catholic practices and vestments, which they viewed as idolatrous and unscriptural. Influenced by radical Calvinist theology, Puritans believed that any practice not explicitly commanded in the Bible was an offense to God. They fiercely objected to clerical vestments—particularly the white linen surplice—condemning them as 'popish rags' and relics of the Antichrist. This discontent culminated in the Vestiarian Controversy of 1566, when Archbishop Matthew Parker issued the 'Book of Advertisements' enforcing clerical dress. When 37 London clergymen chose to forfeit their livelihoods rather than conform, it demonstrated that Puritans placed divine scriptural command above royal liturgical mandates, provoking an open confrontation with the Crown.<br><br>Furthermore, Puritans challenged the Settlement because of the profound theological expectations shaped by their experiences as Marian exiles. During the reign of Mary I, hundreds of English Protestants had fled to European Calvinist strongholds such as Geneva, Zurich, and Frankfurt. There, they experienced churches that were completely cleansed of Catholic hierarchy, ornamentation, and ritual. When they returned upon Elizabeth's accession in 1558, they anticipated establishing a thoroughly purified Calvinist church. Instead, Elizabeth’s 1559 Settlement preserved crucifixes, church organs, kneeling at Communion, and traditional feast days to appease conservative Catholics. Feeling betrayed by this compromise, Puritan ministers and members of Parliament actively campaigned to purge what they viewed as dangerous remnants of Roman superstition.<br><br>Finally, Puritans challenged the Settlement because they fundamentally opposed the hierarchy and governance of the Elizabethan Church. While Elizabeth insisted upon the episcopal system of bishops and archbishops to enforce royal authority and crown control, radical Puritans advocated for a Presbyterian structure modelled on Geneva. Under Presbyterianism, the church would be governed by local elders and elected assemblies, stripping the Queen of her power to appoint bishops and dictate liturgy. By questioning the legitimacy of bishops and royal authority over spiritual matters, Puritans were not merely seeking liturgical reform, but mounting a direct constitutional challenge to the Queen's royal prerogative and Supreme Governorship.</p>",
        verdict: "Level 4 (12/12 marks). Excellent analytical explanation covering three distinct aspects (Vestiarian Controversy/scriptural purity, Marian exile expectations, Presbyterian challenge to episcopacy) with precise evidence and consistent PEEL links back to the question stem."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Puritan insurgency of the 1560s exposed the irreconcilable ontological divide between the Erastian statecraft of the Tudor monarchy and the covenantal theology of radical Reformed Protestantism.<br><br>For Elizabeth, religious uniformity was an instrument of civic cohesion; external obedience in matters of adiaphora (indifferent ceremonies) was a non-negotiable duty of royal subjecthood. For returning Marian exiles steeped in Bezan and Bullingerian covenantal theology, however, the survival of Catholic visual culture represented an ongoing spiritual pollution that jeopardized England's status as an elect nation.<br><br>Consequently, what commenced as a parochial squabble over linen vestments rapidly transmuted into an ecclesiological assault upon episcopal hegemony. By seeking to substitute royal conciliar oversight with Presbyterian synods, Puritans struck at the very core of Tudor monarchical sovereignty, transforming liturgical dissent into a constitutional crisis.</p>",
        verdict: "Scholar Distinction. Masterful exploration of Erastian civic uniformity versus Calvinist covenantal theology."
      }
    }
  },

  lesson_1_4: {
    q1: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of Mary, Queen of Scots' claim to the English throne was that she was Elizabeth's Catholic cousin and had a strong royal bloodline.</p>",
        verdict: "AO1 (1 mark). General statement regarding cousinship and Catholic support without naming Henry VII, Margaret Tudor, or the issue of Elizabeth's illegitimacy."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of Mary, Queen of Scots' claim to the English throne was that she was the great-granddaughter of Henry VII through his eldest daughter, Margaret Tudor. Because European Catholics and the Pope did not recognize Henry VIII's marriage to Anne Boleyn, they viewed Elizabeth as illegitimate, making Mary the lawful, legitimate Catholic heir to the English crown by strict hereditary descent.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Accurately details Mary's lineage (Henry VII, Margaret Tudor) and explains the Catholic canon law rationale regarding Elizabeth's illegitimacy."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>Mary Stuart's claim was anchored in the principle of primogeniture and unimpeachable legitimate descent from Margaret Tudor, elder sister of Henry VIII. Under strict Catholic canon law, which repudiated Cranmer’s annulment of Catherine of Aragon's marriage, Mary was not merely the presumptive heir, but the de jure ruling monarch of England, rendering Elizabeth a usurper and providing European powers with a legitimate figurehead for dynastic intervention.</p>",
        verdict: "Scholar Distinction. Superb legal and dynastic framing contrasting primogeniture with statutory Henrician succession."
      }
    },
    q2: {
      tier_1m: {
        title: "1/2 Vague Feature",
        score: "1 / 2 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>One key feature of the Casket Letters affair was that letters were investigated to see if Mary had murdered her husband Lord Darnley.</p>",
        verdict: "AO1 (1 mark). Basic identification of the Darnley murder inquiry without naming Bothwell, the commissions at York and Westminster, or Cecil's political manipulation."
      },
      tier_2m: {
        title: "2/2 Pearson Benchmark ★",
        score: "2 / 2 Marks",
        level: "Level 1 Top (Full Marks)",
        badge: "Edexcel Benchmark",
        text: "<p>One key feature of the Casket Letters affair (1568–69) was an official inquiry held at York and Westminster to examine eight love letters and sonnets allegedly written by Mary to the Earl of Bothwell, presented by Scottish Protestant lords to prove her complicity in the murder of Lord Darnley. Elizabeth used the inconclusive verdict to justify keeping Mary imprisoned under house arrest in England without formally finding her guilty.</p>",
        verdict: "AO1 (2 marks). Maximum marks awarded. Precise historical details deployed (1568-69, York/Westminster inquiry, Bothwell, Darnley murder, political outcome of indefinite detention)."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The Casket Letters inquiry was a triumph of Machiavellian diplomacy orchestrated by William Cecil. By staging quasi-judicial hearings at York and Westminster that evaluated disputed epistolary evidence without allowing Mary to inspect the documents or appear in her own defense, Elizabeth preserved Scottish Protestant regency under the Earl of Moray while creating a legal pretext for Mary’s extra-judicial, indefinite domestic internment.</p>",
        verdict: "Scholar Distinction. Penetrating analysis of Machiavellian diplomatic theatre and extra-judicial detention."
      }
    },
    q3: {
      stimulus: ["Mary's arrival at Workington (May 1568)", "The Duke of Norfolk"],
      tier_4m: {
        title: "4/16 One-Sided Assertion",
        score: "4 / 16 Marks",
        level: "Level 1 (Simple Statement)",
        text: "<p>I agree that Mary Queen of Scots caused all the instability when she arrived in 1568. When she fled Scotland after her husband was murdered, she came to England and Catholics wanted her to replace Elizabeth. There was also a plan for her to marry the Duke of Norfolk which caused trouble. Therefore she was the main cause of instability.</p>",
        verdict: "Level 1 (4/16 marks). Simple narrative statement with minimal factual depth, lacking balance or analysis of alternative factors."
      },
      tier_8m: {
        title: "8/16 Descriptive Narrative",
        score: "8 / 16 Marks",
        level: "Level 2 (Descriptive Narrative)",
        text: "<p>On the one hand, Mary’s arrival in May 1568 caused huge instability. She arrived in a fishing boat at Workington in Cumberland after escaping from Lochleven Castle. Because she was Catholic and had a strong claim to the throne, Catholic nobles in England immediately saw her as an alternative to Elizabeth. This led to a plot where the Duke of Norfolk planned to marry Mary and overthrow William Cecil, which almost caused a rebellion.<br><br>On the other hand, there were other reasons for instability in 1568–69. The Northern Earls, Northumberland and Westmorland, were very unhappy because they had lost their power in the North to Protestant leaders. There was also tension with Spain because Elizabeth seized Spanish bullion ships in 1568. Therefore, Mary was not the only cause of instability.</p>",
        verdict: "Level 2 (8/16 marks). Identifies multiple valid factors on both sides with some accurate facts, but remains predominantly descriptive without evaluating which factor was primary."
      },
      tier_16m: {
        title: "16/16 Pearson Benchmark ★",
        score: "16 / 16 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: "<p>The arrival of Mary, Queen of Scots in May 1568 at Workington was undeniably a profound catalyst for domestic instability, as it provided disaffected English Catholics with an immediate, legitimate, and physically present alternative monarch. Previously, Catholic opposition had lacked a unified leader and a credible dynastic successor. Mary’s sudden presence transformed theoretical Catholic grievances into active political conspiracies. Most notably, it inspired the 1569 Norfolk Marriage Plot, in which Thomas Howard, the Duke of Norfolk—England’s premier peer—conspired with courtiers, foreign ambassadors, and the Earls of Northumberland and Westmorland to marry Mary and force Elizabeth to name her successor. This direct threat to the royal prerogative exposed deep factional fractures at court and created widespread anxiety regarding a Catholic restoration.<br><br>However, it can be strongly argued that the primary cause of instability in 1568–69 was the deep-seated political, economic, and religious alienation of the ancient Catholic nobility in the North of England. Long before Mary crossed the Solway Firth, the Earls of Northumberland and Westmorland resented the relentless expansion of Tudor centralisation under William Cecil. Elizabeth had systematically stripped these magnates of their traditional feudal authority, replacing them with southern Protestant loyalists like Lord Hunsdon and James Pilkington, the militant Bishop of Durham. Economically, Northumberland had been deprived of lucrative copper mines found on his estates. Therefore, the simmering resentment of the Northern nobility created a combustible domestic climate that was ready to explode irrespective of Mary’s arrival.<br><br>Furthermore, international religious tensions and foreign intervention significantly amplified instability during these critical years. In 1567, King Philip II of Spain dispatched the Duke of Alba with 10,000 veteran Spanish troops to the nearby Netherlands to crush the Dutch Protestant rebellion. The presence of a formidable Catholic army across the Channel terrified the Elizabethan regime. This panic escalated dramatically in November 1568 when Elizabeth seized Spanish ships carrying 400,000 florins of Genoese loan bullion that had sheltered in English ports, prompting an immediate Spanish trade embargo. These geopolitical flashpoints convinced English Catholics that foreign military assistance was imminent, emboldening domestic plotters to challenge Elizabeth.<br><br>In conclusion, while Mary’s arrival acted as the immediate spark that crystallized opposition around a viable Catholic figurehead, it was not the sole or fundamental cause of instability. Without the preexisting socio-political alienation of the northern magnates and the menacing geopolitical threat of Alba’s army, Mary would have remained merely an isolated Scottish fugitive. It was the volatile combination of long-standing northern feudal grievances and external Spanish pressure that turned Mary's arrival into a catastrophic crisis of state.</p>",
        verdict: "Level 4 (16/16 marks). Exceptional criteria-driven evaluation weighing three distinct aspects (Mary's arrival/Norfolk Plot, Northern feudal alienation, Alba's army/Genoese bullion crisis) with rich factual evidence and a sustained, nuanced verdict."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p>The crisis of 1568–69 illustrates the structural volatility of the mid-Elizabethan polity, wherein domestic dynastic insecurity became entangled with European confessional warfare.<br><br>Mary Stuart's arrival at Workington functioned as a constitutional solvent. By presenting an anointed, legitimate Catholic sovereign within English borders, Mary demolished the regime’s central ideological defense—that obedience to Elizabeth was the only safeguard against civil chaos. Her presence galvanized the reactionary aristocratic faction led by Norfolk, Arundel, and Pembroke, who sought to purge Cecil’s Protestant administrative clique.<br><br>Yet, attributing the instability solely to Mary overlooks the profound structural disaffection of the northern periphery. The Northern Revolt of 1569 was essentially the final gasp of northern bastard feudalism against the fiscal, religious, and administrative encroachments of the bureaucratic Tudor state. Mary was the catalyst, but the material conditions of rebellion—regional alienation, Catholic recusancy, and Spanish military proximity—were already fully assembled.</p>",
        verdict: "Scholar Distinction. Brilliant structural historiography synthesizing bastard feudalism, conciliar factionalism, and confessional geopolitics."
      }
    }
  }
};

const ALL_EEE_MODELS = {
  ...KT1_MODELS,
  ...KT2_MODELS,
  ...KT3_MODELS
};

console.log('--- Step 2: Updating units/eee/data.js and public/units/eee/data.js ---');

function updateEeeDataFiles() {
  const eeeFiles = [
    'C:/Projects/the-history-revision-hub/units/eee/data.js',
    'C:/Projects/the-history-revision-hub/public/units/eee/data.js'
  ];

  for (const filePath of eeeFiles) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf8');
    const vm = require('vm');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext('unitData = ' + raw.replace(/^export\s+default\s+/, ''), sandbox);
    const unitData = sandbox.unitData;

    let updatedQuestionsCount = 0;

    unitData.lessons.forEach((lesson) => {
      const lessonModels = ALL_EEE_MODELS[lesson.id];
      if (!lessonModels) {
        console.warn(`No models found for lesson ${lesson.id}`);
        return;
      }

      if (!lesson.exam_practice || !Array.isArray(lesson.exam_practice.questions)) {
        console.warn(`No exam_practice.questions in ${lesson.id}`);
        return;
      }

      const questions = lesson.exam_practice.questions;

      // Q1 (feature 2m)
      if (questions[0] && lessonModels.q1) {
        questions[0].model_tiers = lessonModels.q1;
        questions[0].model = lessonModels.q1.tier_2m.text.replace(/<\/?p>/g, '');
        updatedQuestionsCount++;
      }

      // Q2 (feature 2m)
      if (questions[1] && lessonModels.q2) {
        questions[1].model_tiers = lessonModels.q2;
        questions[1].model = lessonModels.q2.tier_2m.text.replace(/<\/?p>/g, '');
        updatedQuestionsCount++;
      }

      // Q3 (12m causation or 16m essay)
      if (questions[2] && lessonModels.q3) {
        questions[2].model_tiers = {
          ...(lessonModels.q3.tier_3m ? { tier_3m: lessonModels.q3.tier_3m } : {}),
          ...(lessonModels.q3.tier_4m ? { tier_4m: lessonModels.q3.tier_4m } : {}),
          ...(lessonModels.q3.tier_6m ? { tier_6m: lessonModels.q3.tier_6m } : {}),
          ...(lessonModels.q3.tier_8m ? { tier_8m: lessonModels.q3.tier_8m } : {}),
          ...(lessonModels.q3.tier_12m ? { tier_12m: lessonModels.q3.tier_12m } : {}),
          ...(lessonModels.q3.tier_16m ? { tier_16m: lessonModels.q3.tier_16m } : {}),
          ...(lessonModels.q3.tier_20m ? { tier_20m: lessonModels.q3.tier_20m } : {})
        };

        if (lessonModels.q3.tier_12m) {
          questions[2].model = lessonModels.q3.tier_12m.text;
        } else if (lessonModels.q3.tier_16m) {
          questions[2].model = lessonModels.q3.tier_16m.text;
        }

        // Clean up SPaG mention in Paper 2 question stem
        if (questions[2].question) {
          questions[2].question = questions[2].question.replace(/\s*\+\s*4\s*marks\s*SPaG/gi, '');
        }

        if (lessonModels.q3.stimulus && Array.isArray(lessonModels.q3.stimulus)) {
          questions[2].stimulus = lessonModels.q3.stimulus;
        }

        updatedQuestionsCount++;
      }
    });

    const newContent = 'export default ' + JSON.stringify(unitData, null, 2) + ';\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully updated ${path.basename(filePath)} (${updatedQuestionsCount} questions updated).`);
  }
}

updateEeeDataFiles();

// Step 3: Update mock_exam_bank_data.js
console.log('--- Step 3: Updating src/engine/mock_exam_bank_data.js ---');

function updateMockExamBankData() {
  const mebdPath = 'C:/Projects/the-history-revision-hub/src/engine/mock_exam_bank_data.js';
  let content = fs.readFileSync(mebdPath, 'utf8');

  // 1. Upgrade Medicine Lesson 2.2
  const medQ1Model = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q3 Similarity / Difference [4 Marks])</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1. Valid Comparison:</strong> Must identify a clear comparative criterion (e.g. bedside empirical observation vs humoural uroscopy).<br><strong>2. Evidence from BOTH Periods:</strong> Level 2 (3–4 marks) strictly requires specific historical detail from both the medieval and Renaissance periods.<br><strong>3. The One-Sided Trap:</strong> Describing Sydenham without specific medieval knowledge is capped at Level 1 (maximum 2 marks).</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 1 Top (2/4 Marks — The One-Sided Trap)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">2/4 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "One way Sydenham’s approach to diagnosis was different was that he focused on carefully observing the patient's symptoms at their bedside, rather than relying on ancient books. In contrast, Thomas Sydenham sat by the patient’s bed, recorded their symptoms over time, and showed that different diseases had specific symptom patterns (such as recognizing scarlet fever was different from measles). However, in the other period, medical practitioners did things differently."
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 6px;">
      <strong>Examiner Note:</strong> Identifies a valid comparison and provides excellent detail for Sydenham, but provides zero specific historical knowledge for the medieval period. Capped at 2/4.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-award"></i> Level 2 Top (4/4 Marks — Grade 9 Exemplar)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (4/4)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.6;">
      One way Sydenham’s approach to diagnosis was different was that he focused on <strong>carefully observing the patient's symptoms at their bedside</strong>, rather than relying on ancient books or urine charts. In the Medieval period, doctors rarely examined patients closely, instead checking urine flasks against uroscopy charts and consulting zodiac charts to diagnose an internal humoural imbalance. In contrast, Thomas Sydenham sat directly by the patient’s bed, recorded clinical symptoms systematically over time, and demonstrated that different illnesses possessed distinct symptom patterns (such as proving scarlet fever was separate from measles). Therefore, Sydenham diagnosed diseases through direct empirical bedside observation rather than dogmatic ancient medical texts.
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 6px;">
      <strong>Examiner Note:</strong> Full 4 marks awarded. Direct comparative criterion identified, supported by precise named historical detail from BOTH eras (uroscopy/astrology vs systematic bedside observation/scarlet fever), concluded with an analytical comparison.
    </div>
  </div>
</div>`;

  const medQ2Model = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q4 12-Mark Causation)</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1. Three Distinct Aspects:</strong> Must deploy at least three aspects of content (e.g. bedside observation, disease nosology/classification, practical therapeutics).<br><strong>2. PEEL Structure:</strong> Point, Evidence (dates, Latin texts, specific diseases), Explanation of medical significance, Link.<br><strong>3. Sustained Analysis:</strong> Must consistently explain <em>why</em> Sydenham was significant in advancing British medicine rather than giving a biographical story.</p>
  </div>

  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (5/12 Marks — Grade 5 Developing)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">5/12 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      "Thomas Sydenham was significant because he was known as the English Hippocrates. He told doctors that they should stop reading old books by Galen and start observing patients. In the seventeenth century, doctors rarely visited patients, but Sydenham sat by their bedside and took notes on what was happening. He also wrote a book called Observationes Medicae in 1676 where he showed that diseases could be classified. He also gave patients cinchona bark for malaria and cool drinks for smallpox instead of wrapping them in blankets. Therefore, he was an important doctor who changed medicine."
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 6px;">
      <strong>Examiner Note:</strong> Level 2 (5/12). A mostly descriptive narrative covering some relevant facts, but lacks structured PEEL paragraphs and fails to explain <em>how</em> his work changed medical practice over time.
    </div>
  </div>

  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-award"></i> Level 4 Top (12/12 Marks — Grade 9 Exemplar)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (12/12)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.6;">
      <p>Thomas Sydenham was significant primarily because he revolutionized medical diagnosis by introducing direct clinical bedside observation. In the seventeenth century, most university-trained physicians diagnosed illness theoretically by consulting Galenic treatises or analyzing urine charts, rarely examining patients directly. Nicknamed the 'English Hippocrates', Sydenham rejected scholastic dogmatism and insisted that physicians must sit at the patient’s bedside, observe the natural progression of symptoms closely, and maintain meticulous clinical case histories. By encouraging practitioners to base diagnosis upon what they physically observed rather than classical authority, Sydenham established empirical bedside observation as the indispensable foundation of British clinical medicine.</p>
      <p>Furthermore, Sydenham was significant because he pioneered the foundational concept of disease classification (nosology) in his landmark 1676 treatise, <em>Observationes Medicae</em>. Traditional humoural dogma maintained that sickness was entirely unique to each individual’s balance of bodily humours. Sydenham overturned this subjective approach by arguing that illnesses were distinct, external species with fixed symptom patterns, just like plants in a botanical catalogue. This conceptual breakthrough enabled physicians to distinguish between separate conditions that shared similar surface traits, notably allowing Sydenham to prove that scarlet fever and measles were distinct clinical diseases. Therefore, Sydenham was significant because categorizing illnesses into identifiable species laid the groundwork for modern epidemiology and pathology.</p>
      <p>Finally, Sydenham was significant because he introduced practical, common-sense clinical treatments that directly reduced mortality. For smallpox, orthodox medical practice subjected patients to suffocating heat in sealed rooms with heavy blankets to 'sweat out' impurities. Sydenham defied tradition by introducing a revolutionary 'cooling regime' featuring well-ventilated rooms, cool drinks, and light bedclothes, which dramatically improved survival rates. Additionally, he popularized the medicinal use of cinchona bark (quinine) to treat ague (malaria). Although Sydenham still adhered to humoural bloodletting, his insistence on pragmatic therapeutics established an empirical standard that helped liberate British medicine from dangerous medieval orthodoxies.</p>
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 6px;">
      <strong>Examiner Note:</strong> Level 4 (12/12 marks). Deploys three distinct aspects of content (bedside observation, nosology/Observationes Medicae, practical therapeutics/cooling regime), structured with rigorous PEEL paragraphs and sustained causal analysis.
    </div>
  </div>
</div>`;

  // Replace Medicine Lesson 2.2 in mock_exam_bank_data.js
  const medL22Regex = /("id":\s*"lesson_2_2_q1"[\s\S]*?"modelAnswer":\s*")[\s\S]*?(",\s*"pdfUrl")/;
  if (medL22Regex.test(content)) {
    content = content.replace(medL22Regex, (match, p1, p2) => {
      const cleanJsonStr = JSON.stringify(medQ1Model).slice(1, -1);
      return `${p1}${cleanJsonStr}${p2}`;
    });
    console.log('Updated lesson_2_2_q1 in mock_exam_bank_data.js');
  }

  const medL22Q2Regex = /("id":\s*"lesson_2_2_q2"[\s\S]*?"modelAnswer":\s*")[\s\S]*?(",\s*"pdfUrl")/;
  if (medL22Q2Regex.test(content)) {
    content = content.replace(medL22Q2Regex, (match, p1, p2) => {
      const cleanJsonStr = JSON.stringify(medQ2Model).slice(1, -1);
      return `${p1}${cleanJsonStr}${p2}`;
    });
    console.log('Updated lesson_2_2_q2 in mock_exam_bank_data.js');
  }

  // 2. Upgrade Early Elizabethan England in mock_exam_bank_data.js
  Object.keys(ALL_EEE_MODELS).forEach((lessonId) => {
    const lm = ALL_EEE_MODELS[lessonId];
    if (!lm) return;

    // Build Q1 Model
    const q1Container = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q1 Feature Drill [2 Marks])</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1 Mark:</strong> Identifies a valid general feature without specific supporting historical detail.<br><strong>2 Marks:</strong> Feature clearly identified AND supported by precise historical detail (names, dates, acts, numbers).</p>
  </div>
  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-circle-exclamation"></i> 1/2 Vague Feature (Level 1 Bottom)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1/2 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      ${lm.q1.tier_1m.text.replace(/<\/?p>/g, '')}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> ${lm.q1.tier_1m.verdict}
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-award"></i> 2/2 Pearson Benchmark (Full Marks ★)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.55;">
      ${lm.q1.tier_2m.text.replace(/<\/?p>/g, '')}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> ${lm.q1.tier_2m.verdict}
    </div>
  </div>
</div>`;

    // Build Q2 Model
    const q2Container = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q1 Feature Drill [2 Marks])</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1 Mark:</strong> Identifies a valid general feature without specific supporting historical detail.<br><strong>2 Marks:</strong> Feature clearly identified AND supported by precise historical detail (names, dates, acts, numbers).</p>
  </div>
  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-circle-exclamation"></i> 1/2 Vague Feature (Level 1 Bottom)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1/2 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      ${lm.q2.tier_1m.text.replace(/<\/?p>/g, '')}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> ${lm.q2.tier_1m.verdict}
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-award"></i> 2/2 Pearson Benchmark (Full Marks ★)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.55;">
      ${lm.q2.tier_2m.text.replace(/<\/?p>/g, '')}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> ${lm.q2.tier_2m.verdict}
    </div>
  </div>
</div>`;

    // Build Q3 Model (12m or 16m)
    const is12m = Boolean(lm.q3.tier_12m);
    const ruleTitle = is12m
      ? 'Official Edexcel Mark Scheme Rules (Q2 Causation [12 Marks])'
      : 'Official Edexcel Mark Scheme Rules (Q3/Q4 Judgement Essay [16 Marks])';
    const ruleText = is12m
      ? '<strong>1. Three Distinct Aspects:</strong> Must deploy at least three distinct causes/aspects of content.<br><strong>2. Sustained PEEL:</strong> Point, Evidence, Explanation of cause, Link.<br><strong>3. Zero Conclusion Required:</strong> Level 4 (10–12 marks) requires analytical explanation throughout; no separate conclusion needed.'
      : '<strong>1. Three Distinct Aspects:</strong> Must deploy at least three aspects of content weighing both sides.<br><strong>2. Criteria-Driven Evaluation:</strong> Must weigh factors against clear historical criteria.<br><strong>3. Sustained Judgement:</strong> Must reach a reasoned, justified conclusion.<br><strong>4. Zero SPaG:</strong> Paper 2 has NO SPaG marks (16 marks flat).';

    const devScore = is12m ? '6/12 Marks — Grade 5 Developing' : '8/16 Marks — Grade 5 Developing';
    const devBadge = is12m ? '6/12 Marks' : '8/16 Marks';
    const devText = is12m ? lm.q3.tier_6m.text : lm.q3.tier_8m.text;
    const devVerdict = is12m ? lm.q3.tier_6m.verdict : lm.q3.tier_8m.verdict;

    const fullScore = is12m ? '12/12 Marks — Grade 9 Exemplar' : '16/16 Marks — Grade 9 Exemplar';
    const fullBadge = is12m ? 'Full Marks (12/12)' : 'Full Marks (16/16)';
    const fullText = is12m ? lm.q3.tier_12m.text : lm.q3.tier_16m.text;
    const fullVerdict = is12m ? lm.q3.tier_12m.verdict : lm.q3.tier_16m.verdict;

    const q3Container = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> ${ruleTitle}</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;">${ruleText}</p>
  </div>
  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-circle-exclamation"></i> Level 2 Model (${devScore})</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${devBadge}</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.55; font-style: italic;">
      ${devText}
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 6px;">
      <strong>Examiner Verdict:</strong> ${devVerdict}
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.8rem;"><i class="fa-solid fa-award"></i> Level 4 Top (${fullScore})</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${fullBadge}</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.6;">
      ${fullText}
    </div>
    <div style="margin-top: 8px; font-size: 0.8rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 6px;">
      <strong>Examiner Verdict:</strong> ${fullVerdict}
    </div>
  </div>
</div>`;

    // Match each question in mock_exam_bank_data.js for this lesson
    const q1Reg = new RegExp(`("id":\\s*"${lessonId}_q1"[\\s\\S]*?"modelAnswer":\\s*")[\\s\\S]*?(",\\s*"pdfUrl")`);
    if (q1Reg.test(content)) {
      content = content.replace(q1Reg, (m, p1, p2) => `${p1}${JSON.stringify(q1Container).slice(1, -1)}${p2}`);
    }

    const q2Reg = new RegExp(`("id":\\s*"${lessonId}_q2"[\\s\\S]*?"modelAnswer":\\s*")[\\s\\S]*?(",\\s*"pdfUrl")`);
    if (q2Reg.test(content)) {
      content = content.replace(q2Reg, (m, p1, p2) => `${p1}${JSON.stringify(q2Container).slice(1, -1)}${p2}`);
    }

    const q3Reg = new RegExp(`("id":\\s*"${lessonId}_q3"[\\s\\S]*?"modelAnswer":\\s*")[\\s\\S]*?(",\\s*"pdfUrl")`);
    if (q3Reg.test(content)) {
      content = content.replace(q3Reg, (m, p1, p2) => `${p1}${JSON.stringify(q3Container).slice(1, -1)}${p2}`);
    }
  });

  fs.writeFileSync(mebdPath, content, 'utf8');
  console.log('Successfully updated src/engine/mock_exam_bank_data.js');
}

updateMockExamBankData();

console.log('--- EEE Model Tiers Population Complete ---');
