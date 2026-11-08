const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

const enrichedLessons = [
  // Lesson 1: The East India Company & Mughal Bengal (1600–1757)
  {
    lessonIndex: 0,
    enquiry_question: "How did a private London trading corporation conquer Mughal Bengal?",
    learning_objectives: {
      overarching: "How did the East India Company transform from Elizabethan merchants into sovereign rulers of Bengal?",
      scaffolded: [
        "Explain why Queen Elizabeth I granted a royal monopoly charter to London merchants on New Year's Eve 1600.",
        "Analyse how Sir Thomas Roe negotiated fortified trading posts from Mughal Emperor Jahangir.",
        "Evaluate how Robert Clive's bribery of Mir Jafar at Plassey and the 1765 Diwani established corporate colonial rule."
      ]
    },
    stages: [
      {
        stageIndex: 0,
        title: "The London Charter & Elizabethan Monopoly (1600–1615)",
        image: "/images/east_india_house.jpg",
        caption: "East India House on Leadenhall Street, London (c. 1800), headquarters of the corporate monopoly chartered by Queen Elizabeth I on New Year's Eve 1600.",
        content: `<p class="prose-p"><span class="para-ref">[1.1]</span> On a freezing New Year’s Eve in 1600, Queen Elizabeth I pressed the Great Seal of England onto a royal charter that would reshape global history. Inside a smoky London guildhall, 218 wealthy merchants and City syndicates gathered to form <em>'The Governor and Company of Merchants of London Trading into the East Indies'</em>. Granted an exclusive fifteen-year royal monopoly over all English trade east of the Cape of Good Hope, the enterprise was founded not for territorial conquest, but out of commercial envy.</p><p class="prose-p">Dutch merchants held a stranglehold over the Indonesian Spice Islands, driving the price of black pepper from three shillings to eight shillings a pound. The London merchants pooled £68,000 to fit out four armed galleons loaded with broadcloth and silver bullion.</p><p class="prose-p">Commanded by privateer James Lancaster, the first fleet set sail into uncharted waters. While English woollen cloth proved useless in tropical Asian markets, the expedition returned laden with precious Malayan peppercorns, netting investors a staggering 300% profit and cementing the corporate foundation of the <strong>East India Company</strong>.</p>`
      },
      {
        stageIndex: 1,
        title: "Coastal Fortresses & Mughal Factories (1615–1700)",
        image: "/images/sir_thomas_roe.jpg",
        caption: "Sir Thomas Roe, English ambassador dispatched by King James I to the Mughal court of Emperor Jahangir (1615–1619) to secure trading rights for Company factories.",
        content: `<p class="prose-p"><span class="para-ref">[1.2]</span> Confronting fierce Dutch naval dominance in the Spice Islands, the Company pivoted westward toward the sprawling, fabulously wealthy Mughal Empire of India. In 1615, King James I dispatched diplomat <strong>Sir Thomas Roe</strong> as England’s first official ambassador to the royal court of Emperor Jahangir in Ajmer. Presenting gilded English clocks and carriage horses, Roe spent three years ingratiating himself with the Mughal sovereign.</p><p class="prose-p">In 1619, Roe secured an imperial <strong>firman</strong> (royal decree) granting the English permission to construct permanent trading posts, known as <strong>'factories'</strong>, at the port of Surat in Gujarat.</p><p class="prose-p">These factories were fortified commercial warehouses managed by Company 'factors' who stockpiled fine Indian silks, saltpetre for gunpowder, and handwoven calicoes. Over the seventeenth century, the Company established heavily fortified coastal enclaves: Fort St George at Madras, Bombay Castle, and Fort William at Calcutta. These tiny merchant enclaves soon grew into militarized corporate city-states protected by Company garrisons.</p>`
      },
      {
        stageIndex: 2,
        title: "The Storm at Calcutta & The Black Hole Myth (1756)",
        image: "/images/siraj_ud_daulah.jpg",
        caption: "Nawab Siraj ud-Daulah of Bengal (c. 1756), who captured Fort William in Calcutta to halt unauthorized British military fortifications.",
        content: `<p class="prose-p"><span class="para-ref">[1.3]</span> By the mid-eighteenth century, the lush river province of Bengal had become the jewel of the Company’s Asian trade, generating over half its global revenue. But in April 1756, twenty-three-year-old <strong>Nawab Siraj ud-Daulah</strong> inherited the throne of Bengal. Furious that British merchants were illegally evading royal customs taxes and fortifying Fort William in Calcutta without imperial consent, Siraj marched an army of 50,000 soldiers against the British settlement.</p><p class="prose-p">In June 1756, Calcutta fell after a three-day siege. British governor Roger Drake fled cowardly downriver, leaving garrison survivors to surrender.</p><p class="prose-p">Following the surrender, British prisoners were held overnight in a cramped, unventilated garrison lock-up known as the <strong>'Black Hole of Calcutta'</strong>. According to survivor John Zephaniah Holwell, dozens perished from suffocation in the blistering tropical heat. While British imperial propagandists inflated the casualties into a sensational atrocity tale of Oriental savagery, the incident ignited ferocious vengeful fury in Madras, setting the stage for total colonial war.</p>`
      },
      {
        stageIndex: 3,
        title: "Treachery at Plassey & Mir Jafar's Betrayal (June 1757)",
        image: "/images/first_british_empire/battle_of_plassey_1757.jpg",
        caption: "Tactical military survey plan and painting of the Battle of Plassey (23 June 1757), where Robert Clive defeated Siraj ud-Daulah through the bribery of Mir Jafar.",
        content: `<p class="prose-p"><span class="para-ref">[1.4]</span> In December 1756, the Company dispatched an expeditionary force under thirty-one-year-old Lieutenant-Colonel <strong>Robert Clive</strong> to recapture Calcutta. Clive recognized that raw British military force could never defeat Bengal’s massive armies alone; victory required conspiracy. Clive partnered with the ultra-wealthy Jagat Seth banking house and secretly bribed Bengal’s disgruntled army commander, <strong>Mir Jafar</strong>, promising him the Nawab’s throne in exchange for military betrayal.</p><p class="prose-p">On the morning of 23 June 1757, Clive’s 3,000 British and sepoy soldiers confronted Siraj’s 50,000-strong army amidst the mango groves of <strong>Plassey</strong> on the Bhagirathi River.</p><p class="prose-p">At midday, a torrential monsoon downpour drenched the battlefield. While Clive’s disciplined gunners covered their powder barrels with waterproof tarpaulins, Siraj’s artillery powder was ruined. When the Nawab’s cavalry charged, British artillery tore them apart, while Mir Jafar’s massive division stood motionless, refusing to fight. Siraj fled and was assassinated, leaving Clive undisputed master of Bengal.</p>`
      },
      {
        stageIndex: 4,
        title: "The Treaty of Allahabad & Corporate Plunder (1765–1770)",
        image: "/images/shah_alam_clive.jpg",
        caption: "Benjamin West's painting depicting Mughal Emperor Shah Alam II granting the Diwani (tax collection rights) of Bengal, Bihar, and Orissa to Robert Clive in August 1765.",
        content: `<p class="prose-p"><span class="para-ref">[1.5]</span> Following further military triumphs at Buxar, Clive achieved the ultimate corporate prize. In August 1765, inside an ornate ceremonial tent at Allahabad, defeated Mughal Emperor Shah Alam II signed the <strong>Treaty of Allahabad</strong>, granting the East India Company the <strong>Diwani</strong>—the sovereign right to collect all land revenues across Bengal, Bihar, and Orissa.</p><p class="prose-p">A commercial merchant corporation was now the autocratic ruler of twenty million Indian peasants, extracting millions of pounds in annual taxes.</p><p class="prose-p">Company officials indulged in unprecedented personal plunder, pocketing astronomical fortunes that earned them the mocking title of 'nabobs' upon returning to England. The human toll was catastrophic: Company agents enforced ruthless tax collection even during the severe drought of 1769–1770, hoarding grain while an estimated ten million Bengali peasants died in the Great Bengal Famine. Corporate greed had transformed a vibrant trading province into an impoverished colonial graveyard.</p>`
      }
    ]
  },

  // Lesson 2: The Transatlantic Slave Trade & The Middle Passage (1619–1807)
  {
    lessonIndex: 1,
    enquiry_question: "How did the Triangular Trade and Middle Passage fuel Britain’s imperial economy?",
    learning_objectives: {
      overarching: "What were the economic mechanics and human horrors of the Transatlantic Slave Trade?",
      scaffolded: [
        "Explain how the Triangular Trade linked British industrial ports, African coastal barracoons, and Caribbean sugar plantations.",
        "Analyse the forensic physical horrors of the Middle Passage and the commodification of human beings aboard the Brookes.",
        "Evaluate the legal depravity of the 1781 Zong massacre and how Olaudah Equiano mobilized British public conscience toward abolition."
      ]
    },
    stages: [
      {
        stageIndex: 0,
        title: "The Triangular Engine & Commercial Capital (1619–1672)",
        image: "/images/triangular_trade.png",
        caption: "Map diagram of the Triangular Trade, illustrating the tripartite exchange of British manufactured goods, enslaved African captives, and Caribbean plantation commodities.",
        content: `<p class="prose-p"><span class="para-ref">[2.1]</span> Throughout the seventeenth and eighteenth centuries, the wealth of the First British Empire was powered by a brutal commercial circuit: the <strong>Transatlantic Triangular Trade</strong>. On the first outward leg, British slave ships departed booming mercantile ports like Liverpool, Bristol, and London packed with manufactured goods: brass pans, Birmingham flintlock muskets, gunpowder, copper bars, and dyed textiles.</p><p class="prose-p">Arriving along the West African coast, captains exchanged these industrial commodities with African coastal monarchs and merchant syndicates for captive African men, women, and children.</p><p class="prose-p">On the second leg—the notorious <strong>Middle Passage</strong>—captains transported human cargo across the stormy Atlantic to the Caribbean and American colonies. On the final homeward leg, ships returned to Britain crammed with lucrative plantation produce: unrefined brown sugar, molasses, rum, tobacco, and raw cotton. This tri-continental engine generated colossal fortunes that funded British merchant banks, insurance houses like Lloyd's of London, and early industrial factories.</p>`
      },
      {
        stageIndex: 1,
        title: "Capture, Barracoons & The Royal African Company (1672–1713)",
        image: "/images/elmina_castle.jpg",
        caption: "Elmina Castle on the Gold Coast (modern Ghana), one of the major fortified coastal slave castles where captive Africans were imprisoned in dark dungeons prior to shipment.",
        content: `<p class="prose-p"><span class="para-ref">[2.2]</span> In 1672, King Charles II granted a royal monopoly to the <strong>Royal African Company</strong>, led by his brother James, Duke of York. The company branded captured Africans with the initials 'DY' on their chests with red-hot irons, demonstrating that under British imperial law, human beings were legally classified as <strong>chattel</strong>—mere commercial property indistinguishable from cattle or timber.</p><p class="prose-p">African captives were torn from inland communities through coordinated raids, inter-tribal warfare, and debt pawning, marched hundreds of miles to the coast in wooden neck yokes.</p><p class="prose-p">At coastal fortresses like Cape Coast Castle and Elmina on the Gold Coast, captives were stripped naked, examined by company surgeons, and jammed into sweltering, windowless stone dungeons known as <strong>barracoons</strong>. Starved in filth and pitch darkness for months beneath cannon batteries, survivors were forced through the narrow stone tunnel known as the <em>'Door of No Return'</em>, rowed through crashing surf into European slave vessels.</p>`
      },
      {
        stageIndex: 2,
        title: "The Agony of the Middle Passage & Slave Ship Brookes (1713–1781)",
        image: "/images/brookes_slave_ship.jpg",
        caption: "The famous 1788 abolitionist plan of the Liverpool slave ship 'Brookes', illustrating the horrific, tightly packed conditions endured by captive Africans during the Middle Passage.",
        content: `<p class="prose-p"><span class="para-ref">[2.3]</span> The six-to-eight-week voyage across the Atlantic was an ordeal of calculated, industrialized torture. Slave ship captains practiced <strong>'tight packing'</strong>, calculating that cramming maximum captives into the lower hold maximized net profit, even if fifteen to twenty percent died from pestilence. In the suffocating hold, men were shackled together in pairs, forced to lie flat on rough pine shelves barely sixteen inches wide and two feet high.</p><p class="prose-p">The stench was overpowering: a toxic mixture of human excrement, vomit, rotting flesh, and gangrene. Epidemics of dysentery ('the bloody flux'), smallpox, and ophthalmia raged through the darkness.</p><p class="prose-p">Enslaved captives fought back with desperate heroism: launching shipboard insurrections when deck hatches opened, or leaping into shark-infested waters to commit suicide rather than endure enslavement. Between 1500 and 1870, over twelve million Africans were forced onto slave ships; over two million perished beneath the waves of the Atlantic.</p>`
      },
      {
        stageIndex: 3,
        title: "The Zong Massacre & Chattel Slavery (1781)",
        image: "/images/first_british_empire/slave_trade_iron_shackles.jpg",
        caption: "Eighteenth-century iron leg shackles and handcuffs used aboard British slave vessels, physical instruments of the brutal dehumanisation that culminated in the 1781 Zong massacre.",
        content: `<p class="prose-p"><span class="para-ref">[2.4]</span> In November 1781, the dehumanizing commercial logic of the slave trade reached its darkest legal manifestation aboard the Liverpool slaver <em>Zong</em>. Navigating incompetence by Captain Luke Collingwood led the vessel off-course in the Caribbean, leaving drinking water dangerously low. Collingwood realized that if sick captives died of dehydration on board, the financial loss fell entirely upon the ship owners; but if cargo was jettisoned to preserve the ship, maritime insurance syndicates would reimburse the full insured value.</p><p class="prose-p">Over three days, Collingwood ordered 133 living, shackled enslaved Africans thrown overboard into the ocean to drown.</p><p class="prose-p">Upon returning to England, the owners sued their insurers for £30 per lost person. In May 1783, Lord Chief Justice Mansfield presided over the infamous insurance trial <em>Gregson v. Gilbert</em>, ruling coldly that <em>'the case of slaves was the same as if horses had been thrown overboard.'</em> The legal horror horrified public conscience, transforming Granville Sharp and Thomas Clarkson into relentless crusaders for legislative abolition.</p>`
      },
      {
        stageIndex: 4,
        title: "Olaudah Equiano & The Awakening Conscience (1788–1807)",
        image: "/images/olaudah_equiano.jpg",
        caption: "Olaudah Equiano, frontispiece portrait from his bestselling 1789 autobiography 'The Interesting Narrative of the Life of Olaudah Equiano, or Gustavus Vassa, the African'.",
        content: `<p class="prose-p"><span class="para-ref">[2.5]</span> The moral crusade against the slave trade was ultimately awakened by the authentic testimony of formerly enslaved Africans themselves. Foremost among them was <strong>Olaudah Equiano</strong>, kidnapped from the Kingdom of Benin as a boy, who survived the horrors of the Middle Passage and bought his freedom in 1766. Settling in London, Equiano joined the 'Sons of Africa' abolitionist collective and in 1789 published his bestselling autobiography: <em>The Interesting Narrative of the Life of Olaudah Equiano</em>.</p><p class="prose-p">Equiano’s powerful eyewitness prose demolished racist myths of African inferiority, giving British readers a harrowing, first-person account of the Middle Passage’s terrors.</p><p class="prose-p">Equiano toured Great Britain relentlessly, selling tens of thousands of copies to packed church halls from Bristol to Edinburgh. Mobilized by Equiano’s voice, the 1788 *Brookes* slave ship diagram, and Josiah Wedgwood’s famous medallion (<em>'Am I Not a Man and a Brother?'</em>), over 300,000 Britons boycotted slave-grown sugar, forcing Parliament to pass the landmark <strong>Slave Trade Act of 1807</strong>, abolishing British participation in the transatlantic trade.</p>`
      }
    ]
  },

  // Lesson 3: Plantation Reality, Queen Nanny & Maroon Resistance (1655–1740)
  {
    lessonIndex: 2,
    enquiry_question: "How did Caribbean sugar monoculture spark fierce Maroon guerrilla resistance?",
    learning_objectives: {
      overarching: "How did enslaved Africans endure and resist the brutal regime of Caribbean sugar plantations?",
      scaffolded: [
        "Explain how Oliver Cromwell's 1655 Western Design seized Jamaica and established the agro-industrial sugar complex.",
        "Analyse the brutal discipline of the gang labour system and daily strategies of sabotage and cultural survival.",
        "Evaluate the military leadership of Queen Nanny and why the British Crown was forced to sign the 1739 Maroon Peace Treaty."
      ]
    },
    stages: [
      {
        stageIndex: 0,
        title: "Cromwell’s Western Design & Seizure of Jamaica (1655)",
        image: "/images/jamaica_maroons.jpg",
        caption: "Contemporary illustration of Jamaican Maroons; escaping Spanish and British plantations, free Black communities established fortified mountain settlements in the Blue Mountains.",
        content: `<p class="prose-p"><span class="para-ref">[3.1]</span> In 1654, Lord Protector Oliver Cromwell launched the <strong>'Western Design'</strong>—an ambitious state strategy to challenge the Spanish Empire’s Catholic monopoly in the Americas by seizing territories in the Caribbean. In May 1655, an English fleet commanded by Admiral William Penn and General Robert Venables captured the lush, mountainous island of Jamaica from its Spanish occupiers.</p><p class="prose-p">During the chaotic fighting, hundreds of enslaved Africans escaped into the rugged interior of the Blue Mountains and Cockpit Country.</p><p class="prose-p">Known as <strong>Maroons</strong> (derived from the Spanish <em>cimarrón</em>, meaning 'wild' or 'untamed'), these free Black communities merged with surviving indigenous Taíno peoples. Possessing expert knowledge of limestone sinkholes, steep ravines, and mountain forests, the Maroons established fortified mountain settlements like Moore Town and Nanny Town, building a formidable society of armed resistance that would defy British colonial rule for over a century.</p>`
      },
      {
        stageIndex: 1,
        title: "The Sugar Industrial Complex & The Gang System (1670–1730)",
        image: "/images/sugar_cane_plantation.jpg",
        caption: "Enslaved Africans harvesting sugarcane under the brutal gang system in the West Indies; sugarcane monoculture drove massive profits for absentee British plantation owners.",
        content: `<p class="prose-p"><span class="para-ref">[3.2]</span> Under British rule, Jamaica and Barbados were rapidly converted into gargantuan, monocultural <strong>sugar industrial complexes</strong>. White absentee planters carved the fertile lowlands into massive estates designed with ruthless capitalist efficiency. Enslaved labour was organized under the draconian <strong>gang system</strong>: the 'Great Gang' of the strongest men and women performed backbreaking field labour, digging thousands of cane holes by hand under the tropical sun.</p><p class="prose-p">Over them stood white overseers armed with heavy rawhide whips, punishing any labourer who fell behind with brutal floggings.</p><p class="prose-p">The human consumption was horrific. Because planters calculated that it was cheaper to work enslaved people to early graves and purchase fresh captives from Africa than to provide adequate food and medical care, the mortality rate exceeded birth rates for over a century. Over 30% of newly arrived Africans died within their first three years of 'seasoning', making Caribbean sugar plantations true engines of industrial slaughter.</p>`
      },
      {
        stageIndex: 2,
        title: "Daily Sabotage, Boiling Houses & Cultural Survival (1680–1720)",
        image: "/images/sugar_boiling_house.jpg",
        caption: "18th-century engraving of a Caribbean sugar plantation boiling house, where enslaved labourers worked day and night boiling sugarcane juice in searing, toxic vats.",
        content: `<p class="prose-p"><span class="para-ref">[3.3]</span> The industrial heart of the plantation was the blistering <strong>boiling house</strong>. During the five-month harvest, boiling houses operated continuously twenty-four hours a day. Enslaved mill-feeders shoved heavy sugarcane between rotating iron rollers; a single exhausted slip meant an arm crushed to splinters, requiring a waiting overseer to sever the limb instantly with a hatchet.</p><p class="prose-p">Boilers stood over copper cauldrons of bubbling, scalding cane syrup exceeding 100°C, choking on thick fumes while skimming crystallizing sugar.</p><p class="prose-p">Despite crushing surveillance and barbaric slave codes, enslaved people mounted relentless day-to-day resistance. They feigned illness, deliberately broke wooden hoe handles, set fire to dry sugarcane fields at night, and practiced botanical poisoning. They safeguarded their humanity through African drum rhythms, spiritual rituals, and <strong>Obeah</strong> healing traditions, preserving an unbreakable counter-culture of defiance beneath the whip.</p>`
      },
      {
        stageIndex: 3,
        title: "Queen Nanny & The Windward Guerrillas (1720–1734)",
        image: "/images/queen_nanny.jpg",
        caption: "National Hero of Jamaica Queen Nanny of the Maroons, spiritual and military leader who led the Windward Maroons in brilliant guerrilla resistance against the British Army.",
        content: `<p class="prose-p"><span class="para-ref">[3.4]</span> In the 1720s, escalating British military incursions into the Blue Mountains ignited the <strong>First Maroon War</strong>. The Windward Maroons found their supreme military commander and spiritual matriarch in <strong>Queen Nanny</strong>, an Ashanti-born spiritual leader and military genius. Operating from her fortified mountain stronghold of <strong>Nanny Town</strong>, perched 2,000 feet above sea level, Nanny orchestrated masterclasses in asymmetric guerrilla warfare.</p><p class="prose-p">Maroon scouts covered themselves in branches and climbing vines, melting invisibly into the dense jungle to ambush advancing British redcoats in narrow mountain passes.</p><p class="prose-p">Using the resonant <strong>abeng</strong> (a hollow cow horn) to transmit encoded musical signals across mountain valleys, Nanny’s fighters outmanoeuvred heavily laden British regiments, capturing supplies, liberating enslaved plantation workers, and driving British soldiers into sickness and retreat. British officers feared her spiritual authority and military brilliance, unable to conquer her mountain sanctuary despite years of bloody expeditions.</p>`
      },
      {
        stageIndex: 4,
        title: "The 1739 Peace Treaty: Triumph and Compromise (1739–1740)",
        image: "/images/first_british_empire/maroon_treaty_cudjoe_1739.jpg",
        caption: "Contemporary engraving 'Old Cudjoe Making Peace' depicting the 1739 Maroon Peace Treaty, which granted territorial autonomy while enforcing the return of future runaway slaves.",
        content: `<p class="prose-p"><span class="para-ref">[3.5]</span> By 1739, after decades of humiliating defeats and spiralling military expenditures, the British colonial government surrendered its goal of crushing the Maroons. Governor Edward Trelawny dispatched emissaries into Cockpit Country to sue for peace, meeting Leeward Maroon leader <strong>Captain Cudjoe</strong> beneath a giant cotton tree to sign the historic <strong>1739 Maroon Peace Treaty</strong>, followed by a separate treaty with Nanny’s Windward Maroons in 1740.</p><p class="prose-p">The treaty was a monumental victory: the British Crown officially recognized Maroon sovereignty, granting them 1,500 acres of tax-free land and legal self-government.</p><p class="prose-p">Yet the peace carried a tragic, painful compromise. In exchange for their independence, the Maroons were compelled to agree to assist the British in suppressing foreign invasions and, crucially, to capture and return future runaway slaves from sugar plantations. This controversial compromise divided Black resistance in Jamaica, cementing Maroon freedom while leaving the horrific plantation complex intact for another century.</p>`
      }
    ]
  },

  // Lesson 4: The Thirteen Colonies, The Proclamation of 1763 & The Boston Tea Party (1763–1773)
  {
    lessonIndex: 3,
    enquiry_question: "Why did imperial taxation push the Thirteen Colonies from protest to revolution?",
    learning_objectives: {
      overarching: "Why did British imperial taxation provoke the American colonies to rebel between 1763 and 1773?",
      scaffolded: [
        "Explain how Seven Years' War debt and the 1763 Proclamation Line shattered the relationship between Britain and the colonies.",
        "Analyse colonial resistance to the Stamp Act and how the 1770 Boston Massacre became a revolutionary rallying cry.",
        "Evaluate why the 1773 Tea Act monopoly led to the Boston Tea Party and the punitive Coercive Acts."
      ]
    },
    stages: [
      {
        stageIndex: 0,
        title: "Victory & The Debt Trap: The 1763 Proclamation (1763)",
        image: "/images/king_george_iii.jpg",
        caption: "Allan Ramsay's coronation portrait of King George III (1762), whose government attempted to levy taxes on the American colonies to pay down massive Seven Years' War debts.",
        content: `<p class="prose-p"><span class="para-ref">[4.1]</span> In February 1763, the Treaty of Paris concluded the Seven Years’ War, leaving Great Britain the undisputed master of North America after expelling the French from Canada. But behind the celebratory bonfires in London lay a terrifying fiscal crisis: the British national debt had doubled to a staggering £133 million. Prime Minister George Grenville and young <strong>King George III</strong> insisted that American colonists must pay their fair share for imperial military defense.</p><p class="prose-p">Simultaneously, following Pontiac’s ferocious Native American uprising on the frontier, George III issued the <strong>Royal Proclamation of 1763</strong>.</p><p class="prose-p">This decree forbade American colonists from settling west of the Appalachian Mountains, designating the interior as an Indian reserve. Colonial land speculators like George Washington and frontiersmen were incandescent with rage: having fought and bled to defeat the French, they found themselves legally barred from claiming western lands by an imperial king across the ocean.</p>`
      },
      {
        stageIndex: 1,
        title: "The Stamp Act & \"No Taxation Without Representation\" (1765–1766)",
        image: "/images/stamp_act_skull_1765.jpg",
        caption: "Colonial Pennsylvania newspaper woodcut (1765) satirizing the British Stamp Act with a skull and crossbones emblem of imperial extortion.",
        content: `<p class="prose-p"><span class="para-ref">[4.2]</span> To raise colonial revenue, Parliament passed the provocative <strong>Stamp Act in March 1765</strong>. Unlike previous customs tariffs on foreign shipping, the Stamp Act was the first direct, internal tax levied on colonists, mandating embossed revenue stamps on all legal documents, newspapers, almanacs, pamphlets, and even decks of playing cards. The act ignited an ideological firestorm across the Thirteen Colonies under the rallying cry: <strong>'No taxation without representation!'</strong></p><p class="prose-p">Colonists argued that under the English Bill of Rights, freeborn British subjects could not be taxed without their own consent granted through elected representatives in Parliament.</p><p class="prose-p">Radical secret societies known as the <strong>Sons of Liberty</strong> formed in Boston and New York, violently intimidating stamp collectors, hanging imperial taxmen in effigy, and tarring and feathering crown officials. Colonial merchants launched an aggressive boycott of British manufactured imports, bringing City of London traders to their knees and forcing Parliament into a humiliating repeal in 1766.</p>`
      },
      {
        stageIndex: 2,
        title: "Blood on King Street: The Boston Massacre (March 1770)",
        image: "/images/boston_massacre.jpg",
        caption: "Paul Revere's celebrated 1770 propaganda engraving 'The Bloody Massacre in King-Street', depicting British redcoats firing into an unarmed crowd of Boston citizens.",
        content: `<p class="prose-p"><span class="para-ref">[4.3]</span> Refusing to concede constitutional authority, Chancellor Charles Townshend imposed new duties on colonial glass, lead, paint, paper, and tea in 1767. To enforce compliance, the British government dispatched four thousand British redcoats to occupy Boston—a proud, rebellious seaport of barely sixteen thousand citizens. Tensions reached boiling point on the freezing night of <strong>5 March 1770</strong> outside the Custom House on King Street.</p><p class="prose-p">An angry crowd of apprentices and dockworkers surrounded a lone British sentry, hurling snowballs packed with sharp ice, oyster shells, and stones.</p><p class="prose-p">Captain Thomas Preston marched eight soldiers to relieve the sentry. In the chaotic deafening roar, a soldier was knocked down, and an order was shouted; British muskets erupted into the unarmed crowd. Five colonists were killed, foremost among them <strong>Crispus Attucks</strong>, a mixed-race sailor of African and Wampanoag descent. Silversmith Paul Revere rushed out a dramatic propaganda engraving christening the tragedy the <strong>'Boston Massacre'</strong>, cementing anti-British hatred across America.</p>`
      },
      {
        stageIndex: 3,
        title: "The 1773 Tea Act & The Monopoly Threat (May 1773)",
        image: "/images/first_british_empire/able_doctor_cartoon_1774.jpg",
        caption: "Contemporary political cartoon 'The Able Doctor, or America Swallowing the Bitter Draught' (1774), satirizing British ministers forcing tea and taxes down America's throat.",
        content: `<p class="prose-p"><span class="para-ref">[4.4]</span> In 1773, imperial policy collided with corporate corruption. The East India Company was tottering on the brink of financial bankruptcy, weighed down by the Bengal famine and eighteen million pounds of unsold tea rotting in London warehouses. To rescue the corporate giant, Lord North’s government passed the <strong>Tea Act in May 1773</strong>, granting the East India Company a direct monopoly to sell tea directly to American consumers duty-free, bypassing colonial merchant middlemen.</p><p class="prose-p">Although this corporate loophole made East India tea cheaper than smuggled Dutch tea, American colonists viewed it as a sinister Trojan Horse.</p><p class="prose-p">Colonial patriots recognized that accepting the cheap tea meant accepting Parliament’s right to tax them without representation, while granting an imperial corporation the power to crush local merchants. Radical leaders like Samuel Adams mobilized resistance, vowing that East India tea ships docking in American ports would never be permitted to unload their cargoes.</p>`
      },
      {
        stageIndex: 4,
        title: "342 Chests in the Harbour: The Boston Tea Party (December 1773)",
        image: "/images/boston_tea_party.jpg",
        caption: "Lithograph depicting the Sons of Liberty disguised as Mohawk warriors dumping 342 chests of British East India Company tea into Boston Harbor on 16 December 1773.",
        content: `<p class="prose-p"><span class="para-ref">[4.5]</span> The showdown reached its dramatic climax on a cold, damp evening on <strong>16 December 1773</strong>. Over five thousand colonists packed into Boston's Old South Meeting House to demand that Royal Governor Thomas Hutchinson order three tea ships—the <em>Dartmouth</em>, <em>Eleanor</em>, and <em>Beaver</em>—to sail back to England. When Hutchinson obstinately refused, Samuel Adams rose and announced: <em>'This meeting can do nothing more to save the country.'</em></p><p class="prose-p">Disguising themselves as Mohawk warriors to conceal their identities and signify American defiance, dozens of Sons of Liberty marched quietly down to Griffin’s Wharf.</p><p class="prose-p">Boarding the three vessels under the watchful eyes of thousands of silent spectators, they systematically split open <strong>342 heavy wooden chests</strong> with tomahawks and dumped forty-five tons of tea into Boston Harbor, turning the salt water black. Furious at this destruction of private property worth £10,000, Parliament retaliated with the authoritarian <strong>Coercive (Intolerable) Acts</strong>, closing Boston Harbor and martialling the colonies toward open revolution.</p>`
      }
    ]
  },

  // Lesson 5: The American Revolution, 1776 Declaration & The Black Loyalists (1775–1783)
  {
    lessonIndex: 4,
    enquiry_question: "How did the American Revolution shatter the First British Empire?",
    learning_objectives: {
      overarching: "How was the American Revolutionary War fought, and why was it a paradox of liberty for Black Loyalists?",
      scaffolded: [
        "Explain how the clashes at Lexington and Concord transformed colonial protest into armed revolutionary war.",
        "Analyse the philosophical paradox between the 1776 Declaration of Independence and the institution of chattel slavery.",
        "Evaluate why General Cornwallis surrendered at Yorktown and how the 1783 Treaty of Paris led to the Black Loyalist exodus."
      ]
    },
    stages: [
      {
        stageIndex: 0,
        title: "The Shot Heard ’Round the World: Lexington & Concord (April 1775)",
        image: "/images/battle_of_lexington_1775.jpg",
        caption: "Contemporary engraving of the Battle of Lexington on 19 April 1775, where colonial Minutemen clashed with British regulars, igniting the American Revolutionary War.",
        content: `<p class="prose-p"><span class="para-ref">[5.1]</span> In the chilly pre-dawn mist of <strong>19 April 1775</strong>, imperial cold war turned into military bloodbath. Seven hundred British redcoats under Lieutenant-Colonel Francis Smith marched out from Boston toward Concord to seize an illegal colonial gunpowder cache. Crossing Lexington Green, they encountered seventy-seven colonial <strong>Minutemen</strong> lined up with muskets under Captain John Parker.</p><p class="prose-p">A British officer yelled: <em>'Throw down your arms, ye villains, and disperse!'</em> Suddenly, an unknown shot cracked out across the green—forever immortalized as the <em>'shot heard 'round the world'</em>.</p><p class="prose-p">British muskets fired disciplined volleys, leaving eight Minutemen dead. But as the redcoats retreated from Concord, thousands of colonial militia ambushed them from behind stone walls, trees, and barns along sixteen miles of road, inflicting 273 British casualties. Colonial protest had irrevocably transformed into armed revolutionary warfare; within months, the Continental Congress appointed Virginia planter <strong>George Washington</strong> Commander-in-Chief of the Continental Army.</p>`
      },
      {
        stageIndex: 1,
        title: "The 1776 Declaration & The Paradox of Liberty (July 1776)",
        image: "/images/declaration_of_independence.jpg",
        caption: "John Trumbull's masterwork 'Declaration of Independence' (1819), depicting Thomas Jefferson and the Committee of Five presenting the draft declaration to Congress in Philadelphia.",
        content: `<p class="prose-p"><span class="para-ref">[5.2]</span> On <strong>4 July 1776</strong> in Philadelphia, the Second Continental Congress adopted the most revolutionary manifesto of the modern age: the <strong>Declaration of Independence</strong>. Drafted by thirty-three-year-old Thomas Jefferson, the document proclaimed the radical Enlightenment principle that <em>'all men are created equal'</em>, endowed with unalienable rights to <em>'Life, Liberty and the pursuit of Happiness'</em>, dissolving all political allegiance to the British Crown.</p><p class="prose-p">Yet at the very core of this noble declaration lay a glaring, profound moral paradox. Jefferson and forty-one of the fifty-six signatories were wealthy slave owners.</p><p class="prose-p">While American revolutionaries loudly decried British taxation as 'enslavement' of free colonists, they held 500,000 African Americans in literal, hereditary chattel bondage. Samuel Johnson bitingly remarked from London: <em>'How is it that we hear the loudest yelps for liberty among the drivers of negroes?'</em> The American Revolution was an inspiring dawn of democratic republicanism, forged upon the foundation of racialised chattel slavery.</p>`
      },
      {
        stageIndex: 2,
        title: "Thomas Paine’s Common Sense & The Global Alliance (1776–1778)",
        image: "/images/first_british_empire/thomas_paine_common_sense_1776.jpg",
        caption: "Title page of Thomas Paine's radical bestselling pamphlet 'Common Sense' (published Philadelphia, January 1776), which galvanized American public opinion toward total independence.",
        content: `<p class="prose-p"><span class="para-ref">[5.3]</span> The ideological momentum for independence was detonated by English immigrant <strong>Thomas Paine</strong>, whose January 1776 pamphlet <strong>Common Sense</strong> sold an astonishing 150,000 copies in months. Written in passionate, plain language for taverns and workshops, Paine ridiculed monarchy as an absurd tyranny, asking: <em>'Is it not ridiculous that an island should rule a continent?'</em></p><p class="prose-p">Militarily, the turning point came in October 1777 at the <strong>Battle of Saratoga</strong> in upstate New York, where American forces forced British General John Burgoyne to surrender six thousand men.</p><p class="prose-p">The victory at Saratoga convinced King Louis XVI of France and the Spanish Bourbon monarchy that American rebels could win. In 1778, France signed a formal military alliance, transforming a colonial rebellion into a global war that forced the British Empire to defend the English Channel, the Caribbean, Gibraltar, and India, stretching the Royal Navy to its breaking point.</p>`
      },
      {
        stageIndex: 3,
        title: "Siege of Yorktown & British Surrender (October 1781)",
        image: "/images/surrender_of_cornwallis_1781.jpg",
        caption: "John Trumbull's oil painting 'Surrender of Lord Cornwallis' at Yorktown, Virginia (19 October 1781), showing American and French armies surrounding British forces.",
        content: `<p class="prose-p"><span class="para-ref">[5.4]</span> By autumn 1781, the British war effort was grinding to disaster on the Virginia peninsula. General <strong>Lord Cornwallis</strong> fortified an eight-thousand-man garrison at <strong>Yorktown</strong> on the Chesapeake Bay, expecting the Royal Navy to evacuate his army or deliver reinforcements. Instead, French Admiral de Grasse’s battlefleet won the naval Battle of the Chesapeake, blockading the mouth of the bay and cutting off British sea rescue.</p><p class="prose-p">On land, Washington’s Continental Army joined forces with French troops under General Rochambeau, laying siege with heavy siege artillery and relentless trench bombardments.</p><p class="prose-p">Trapped with dwindling ammunition and food, Cornwallis surrendered on <strong>19 October 1781</strong>. As redcoats marched out between columns of French and American soldiers to lay down their muskets, British regimental fifes appropriately played the melancholy nursery tune: <em>'The World Turned Upside Down'</em>. When news reached London, Prime Minister Lord North threw up his arms and gasped: <em>'Oh God, it is all over!'</em></p>`
      },
      {
        stageIndex: 4,
        title: "The Treaty of Paris & The Black Loyalists (1783)",
        image: "/images/first_british_empire/book_of_negroes_inspection_1783.png",
        caption: "Original page from 'The Book of Negroes' (1783), the official military ledger recording the 3,000 emancipated Black Loyalists evacuated by the British fleet from New York to Nova Scotia.",
        content: `<p class="prose-p"><span class="para-ref">[5.5]</span> In September 1783, the <strong>Treaty of Paris</strong> formally recognized the sovereign independence of the United States of America, surrendering all territory from the Atlantic to the Mississippi River. The catastrophe brought the First British Empire crashing down in humiliating ruin. Yet amidst the imperial defeat unfolded an extraordinary, poignant exodus: the evacuation of the <strong>Black Loyalists</strong>.</p><p class="prose-p">Thousands of enslaved men and women had fled rebel plantations to fight for the British Crown under Lord Dunmore’s Proclamation and the 1779 Philipsburg Proclamation.</p><p class="prose-p">When victorious Americans demanded the return of their 'slave property', British Commander Sir Guy Carleton refused. In 1783, British officers logged over three thousand free Black men, women, and children into <strong>'The Book of Negroes'</strong>, issuing certificates of freedom and evacuating them aboard British ships to Nova Scotia and later Sierra Leone. Britain had lost its Thirteen Colonies, but in the crucible of defeat, it set its sights east toward India and the Pacific.</p>`
      }
    ]
  }
];

function applyEnrichment(unitObj) {
  let modified = false;
  const lessons = unitObj.lessons || (unitObj.curriculum && unitObj.curriculum.lessons) || [];

  enrichedLessons.forEach(el => {
    const l = lessons[el.lessonIndex];
    if (!l) return;

    if (el.enquiry_question) l.enquiry_question = el.enquiry_question;
    if (el.learning_objectives) l.learning_objectives = el.learning_objectives;

    const blocks = l.narrative_blocks || l.stages || [];

    el.stages.forEach(es => {
      if (blocks[es.stageIndex]) {
        blocks[es.stageIndex].title = es.title;
        blocks[es.stageIndex].theme_heading = es.title;
        blocks[es.stageIndex].heading = es.title;
        blocks[es.stageIndex].content = es.content;
        blocks[es.stageIndex].text = es.content;
        blocks[es.stageIndex].body = es.content;
        blocks[es.stageIndex].image = es.image;
        blocks[es.stageIndex].caption = es.caption;
        modified = true;
      }
    });
  });

  return modified;
}

// 1. Update data/first_british_empire.json and public/data/first_british_empire.json
['data/first_british_empire.json', 'public/data/first_british_empire.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (applyEnrichment(json)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath}`);
    }
  }
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (json.first_british_empire && applyEnrichment(json.first_british_empire)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (first_british_empire)`);
    }
  }
});

// 3. Update units/first_british_empire/data.js and public/units/first_british_empire/data.js
['units/first_british_empire/data.js', 'public/units/first_british_empire/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/first_british_empire.json'), 'utf8'));
    const fileContent = 'export default ' + JSON.stringify(json, null, 2) + ';\n';
    fs.writeFileSync(p, fileContent, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});

console.log('First British Empire narrative and visual plate enrichment in Christine Counsell storytelling mode complete!');

