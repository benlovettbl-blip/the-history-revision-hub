const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

const enrichedLessons = [
  // Lesson 1: What powered the Industrial Revolution, and how did a Fareham ironmaster change the world?
  {
    lessonIndex: 0,
    stages: [
      {
        stageIndex: 0,
        title: "The Charcoal Bottleneck & Pig Iron Crisis (1750–1770)",
        content: `<p class="prose-p"><span class="para-ref">[1.1]</span> In the damp, misty dawn of the early eighteenth century, British industry stood trembling on the brink of an energy catastrophe. For centuries, English ironmasters had fed their roaring blast furnaces on timber cut from ancient forests of oak and beech. But by 1750, woodland was exhausted, devoured by domestic hearths, shipbuilders, and charcoal-burners. Ironmasters turned eagerly to Britain’s vast subterranean coal reserves, only to encounter a chemical nightmare: raw coal was choked with yellow sulfur.</p><p class="prose-p">When molten iron absorbed this sulfur, it cooled into impure <strong>'pig iron'</strong>—a substance as brittle as fragile glass. Strike a bar with a blacksmith's hammer, and it shattered into lethal shards. It was utterly useless for forging heavy artillery, steam boilers, or naval anchors.</p><p class="prose-p">To keep the Royal Navy afloat and defend an expanding empire, Britain was forced into humiliating strategic dependency. Every year, over 50,000 tons of premium Swedish and Russian <strong>wrought iron</strong> had to be imported across the stormy Baltic Sea, leaving the island nation vulnerable to naval blockade.</p>`
      },
      {
        stageIndex: 1,
        title: "James Watt & The Rotary Steam Revolution (1769–1781)",
        content: `<p class="prose-p"><span class="para-ref">[1.2]</span> While ironmasters wrestled with brittle ore, an invisible revolution in mechanical power was brewing in the north. Under the ancient <strong>domestic system</strong>, textile spinning and weaving had been tethered to human muscle or sluggish wooden waterwheels that froze in winter and ran dry in summer droughts. Production was slow, seasonal, and dispersed across tiny stone cottages.</p><p class="prose-p">Enter <strong>James Watt</strong>, an instrument maker at the University of Glasgow. In 1769, while walking on Glasgow Green, Watt realized that Thomas Newcomen’s primitive atmospheric steam engines wasted immense heat by repeatedly cooling their main cylinder. Watt invented the separate condenser, quadrupling the engine’s fuel efficiency.</p><p class="prose-p">Partnering with visionary Birmingham entrepreneur Matthew Boulton at the legendary Soho Manufactory, Watt transformed his pumping machine into a rotary engine in 1781. By converting fiery coal energy into continuous rotary shaft motion, Watt liberated factories from rushing river valleys. Massive multi-storey textile mills could now operate day and night, anywhere coal barges could navigate.</p>`
      },
      {
        stageIndex: 2,
        title: "Henry Cort’s Puddling Breakthrough at Funtley (1775–1784)",
        content: `<p class="prose-p"><span class="para-ref">[1.3]</span> Yet Watt’s thunderous steam engines and spinning machines demanded tough, malleable metal that Britain still could not produce. In 1775, <strong>Henry Cort</strong>, a former Royal Navy pay agent from Lancaster, gambled his fortune by leasing an old flour mill at Funtley on the River Meon, just north of Fareham and fifteen miles from Portsmouth Dockyard. Cort was determined to break the foreign iron monopoly.</p><p class="prose-p">Inside his brick forge, Cort constructed an ingenious <strong>reverberatory puddling furnace</strong>. Crucially, he separated the coal firebox from the iron hearth with a low brick bridge. This prevented sulfurous coal smoke from ever touching the metal, while deflecting radiant heat downward at blistering temperatures over 1,200°C.</p><p class="prose-p">Standing before the blinding furnace door, skilled ironworkers known as 'puddlers' plunged long iron bars through a small porthole. In scorching heat, they stirred the boiling pig iron like thick porridge, burning away carbon impurities until the metal transformed into incandescent, sponge-like balls of pure wrought iron.</p>`
      },
      {
        stageIndex: 3,
        title: "Grooved Rollers & The Hampshire Archaeology (1783–1784)",
        content: `<p class="prose-p"><span class="para-ref">[1.4]</span> Having perfected puddling, Cort faced a second crippling bottleneck: how to purge the molten slag trapped inside the glowing iron sponge. Traditionally, teams of burly blacksmiths spent hours swinging heavy sledgehammers to beat out impurities by hand—an exhausting, slow craft. Cort devised a mechanical masterstroke: <strong>grooved iron rollers</strong> driven by the rushing waters of the River Meon.</p><p class="prose-p">In 1784, Cort fed his white-hot puddling balls directly between these spinning grooved cylinders. With thunderous force, the rollers squeezed out liquid slag like water from a sponge, compressing and elongating the metal into uniform structural bars at fifteen times the speed of human hammering.</p><p class="prose-p">The physical archaeology of this world-changing breakthrough still survives quietly along the Meon Valley trail today. At Funtley Ironworks, visitors can trace the stone waterwheel weir, the brick race where the Meon once turned Cort’s rollers, and ancient estate walls embedded with the glassy, iridescent dark green slag pulled from Cort’s 18th-century furnaces.</p>`
      },
      {
        stageIndex: 4,
        title: "The Portsmouth Dockyard Trials & Naval Supremacy (1787–1800)",
        content: `<p class="prose-p"><span class="para-ref">[1.5]</span> In March 1787, Cort staged a high-stakes demonstration before the skeptical commissioners of the <strong>Navy Board</strong> at <strong>Portsmouth Royal Dockyard</strong>. Deep inside the dockyard smithery, surrounded by veteran master smiths and admirals, Cort’s Funtley iron was subjected to punishing forensic stress tests.</p><p class="prose-p">Blacksmiths bent thick Funtley iron bars double while freezing cold, twisted them into corkscrews, and hammered massive anchor shanks with twenty-pound sledges. The iron refused to crack. The Navy Board officially declared Funtley iron superior to any metal ever forged in the British realm and fully equal to the finest Swedish imports.</p><p class="prose-p">British iron output surged by four hundred percent in a generation, transforming Britain from an anxious importer into the undisputed 'Iron Master of the World'. When Nelson’s fleet confronted Napoleon’s navy at Trafalgar, the mighty anchors, cannon mountings, and hull bolts of <em>HMS Victory</em> were forged from tough British wrought iron born in the furnaces of Hampshire.</p>`
      }
    ]
  },

  // Lesson 2: Was industrial work progress or punishment?
  {
    lessonIndex: 1,
    stages: [
      {
        stageIndex: 0,
        title: "The Death of Domestic Crafts & Rise of the Mill (1780–1820)",
        content: `<p class="prose-p"><span class="para-ref">[2.1]</span> For generations before the factory system, British manufacturing had beaten to a natural, human rhythm. In Yorkshire dales and Lancashire cottages, weavers, woolcombers, and spinners operated under the <strong>domestic system</strong>. Families paced their own labour: mothers spun yarn by tallow candlelight, fathers worked handlooms, children wound bobbins, and craftsmen observed 'Saint Monday'—taking a day off to drink and socialise.</p><p class="prose-p">The lightning rise of steam-driven textile mills between 1780 and 1820 shattered this domestic autonomy forever. Mill owners invested fortunes in colossal multi-storey brick factories packed with hundreds of steam-driven powerlooms and spinning mules. Clattering relentlessly, a single steam factory could produce in a day what an entire village took months to weave.</p><p class="prose-p">Handloom weavers fought desperately to survive, cutting their prices until families were starving on pennies a week. Unable to compete against mechanical steam, independent artisans were starved out of their cottages and driven into the roaring brick factories, reduced from autonomous craftsmen to wage-dependent hands.</p>`
      },
      {
        stageIndex: 1,
        title: "The Tyranny of the Factory Clock & Draconian Fines (1800–1830)",
        content: `<p class="prose-p"><span class="para-ref">[2.2]</span> Inside the new cotton mills, workers stepped into an alien world ruled by an unforgiving dictator: the factory clock. In an era when few working-class families owned pocket watches, mill masters controlled time itself, deliberately manipulating the factory bells to extract extra labour. The working day stretched to an exhausting fourteen or sixteen hours, six days a week, in stifling temperatures exceeding 30°C.</p><p class="prose-p">Mill owners imposed sweeping rulebooks enforced by heavy financial fines deducted directly from starvation wages. Opening a window to breathe fresh air meant a sixpence fine; speaking to a fellow worker cost a shilling; being five minutes late after the morning bell cost a quarter of a day’s pay.</p><p class="prose-p">The atmosphere was toxic. The air was thick with flying cotton lint that workers inhaled with every breath, causing 'mill fever' and chronic lung rot. The deafening roar of hundreds of iron looms was so overwhelming that operatives learned to lip-read, leaving thousands deaf by adulthood.</p>`
      },
      {
        stageIndex: 2,
        title: "Pauper Apprentices & Northern Textile Exploitation (1810–1832)",
        content: `<p class="prose-p"><span class="para-ref">[2.3]</span> Because adult male weavers demanded higher wages and resented factory discipline, mill owners turned hungrily to the cheapest and most submissive labour available: children. Mill masters struck cynical deals with London and Birmingham workhouse overseers, carting thousands of orphaned <strong>'pauper apprentices'</strong> north in canal barges, legally bound to work until age twenty-one in exchange for meagre food and lodging.</p><p class="prose-p">Children as young as six were employed as <strong>'scavengers'</strong> and <strong>'piecers'</strong>. Scavengers had to crawl on hands and knees beneath the thunderous, moving carriages of giant spinning mules, sweeping up stray cotton fibers while iron machinery swept back and forth above their heads.</p><p class="prose-p">A single misstep meant agony. Whirring iron cogs tore off fingers, scalped long hair, and crushed limbs; tired children who slipped beneath moving carriages were crushed to death. Overseers paced the aisles clutching heavy leather straps, brutally beating drowsy children to keep them awake through the final, torturous hours of the shift.</p>`
      },
      {
        stageIndex: 3,
        title: "The Sadler Committee & Matthew Crabtree’s Testimony (1832)",
        content: `<p class="prose-p"><span class="para-ref">[2.4]</span> In 1832, amid mounting public outrage, Parliament appointed a select committee chaired by social reformer Michael Sadler to investigate the realities of child factory labour. Sadler summoned dozens of working-class witnesses to London to give sworn eyewitness testimony before a horrified room of Members of Parliament.</p><p class="prose-p">Among them was twenty-two-year-old <strong>Matthew Crabtree</strong>, who had begun working in a Yorkshire woollen mill at the age of eight. Crabtree described walking miles to the mill before dawn, working from 6:00 am until 8:00 pm with only forty minutes for dinner, surviving on dry bread soaked in tea amidst factory dust.</p><p class="prose-p">Crabtree testified: <em>'I have been severely beaten myself with a leather strap; at that time, if we were a minute too late, we were beaten to work.'</em> When asked about fatigue, he recalled weeping uncontrollably on the way home, his legs bent with rickets and exhaustion. The published Sadler Report sent shockwaves across Victorian Britain.</p>`
      },
      {
        stageIndex: 4,
        title: "Lord Shaftesbury & The 1833 Factory Act (1833)",
        content: `<p class="prose-p"><span class="para-ref">[2.5]</span> Armed with the harrowing revelations of the Sadler Committee, aristocratic evangelical reformer <strong>Lord Ashley (later the Earl of Shaftesbury)</strong> led a passionate crusade for legislative intervention. Mill owners fought back fiercely, arguing that state regulation violated the sacred economic dogma of <strong>laissez-faire</strong> and would destroy British industrial competitiveness against foreign rivals.</p><p class="prose-p">Public pressure proved irresistible. In 1833, Parliament passed the landmark <strong>Factory Act</strong>. The law banned the employment of children under nine years old in textile mills and limited children aged nine to thirteen to eight hours of labour daily, mandating two hours of compulsory schooling.</p><p class="prose-p">Crucially, the 1833 Act created a four-man government factory inspectorate with legal authority to enter mills unannounced. While four inspectors could barely police thousands of mills across northern England, the Act crossed a monumental philosophical threshold: the British state declared that human welfare took precedence over unrestricted capitalist profit.</p>`
      }
    ]
  },

  // Lesson 3: Did industrialisation make British towns unlivable?
  {
    lessonIndex: 2,
    stages: [
      {
        stageIndex: 0,
        title: "The Slum Explosion: Back-to-Back Courts & Cellars (1800–1830)",
        content: `<p class="prose-p"><span class="para-ref">[3.1]</span> Between 1800 and 1830, British urban landscapes detonated in a frantic, unregulated building boom. Manchester’s population rocketed from 75,000 to over 300,000, while Leeds, Sheffield, and Birmingham expanded at breakneck speed. Speculative landlords threw up shoddy, cheap housing with zero building regulations or sanitation laws, creating squalid labyrinths of <strong>'back-to-back' slums</strong>.</p><p class="prose-p">Houses were built sharing three common brick walls, with windows only on the front. This meant fresh air could never circulate through the stifling rooms, trapping damp, soot, and tuberculosis within. Entire working-class families of eight or nine squeezed into a single, windowless twelve-foot room.</p><p class="prose-p">Beneath these tenements lay damp cellar dwellings, where families slept on wet straw over earth floors that flooded with sewage during autumn rains. In Manchester's notorious <strong>'Little Ireland'</strong>, over four thousand poor Irish immigrants were packed into two hundred decaying back-to-back dwellings surrounded on three sides by polluted loops of the River Medlock.</p>`
      },
      {
        stageIndex: 1,
        title: "Cesspools, Privies & Contaminated Pumps (1830–1840)",
        content: `<p class="prose-p"><span class="para-ref">[3.2]</span> Victorian industrial cities lacked the most basic sewage systems. In working-class courts, a single shared communal privy—a wooden seat suspended over a deep pit—served forty to sixty families. As pits overflowed into unpaved courtyards, nightsoil men charged exorbitant fees to shovel human waste, leaving fetid dung heaps festering outside kitchen doors for months.</p><p class="prose-p">Drinking water was an expensive, filthy luxury. Piped water did not exist for the poor; residents relied on street standpipes that ran for only twenty minutes a day, or pumped water from shallow street wells sunk directly through contaminated soil.</p><p class="prose-p">Sewage from unlined cesspools seeped steadily through the porous ground, contaminating the groundwater that fed municipal drinking pumps. Unpaved streets were coated in horse manure, rotten garbage, and slaughterhouse blood. In Liverpool and Leeds, life expectancy for a labourer’s child dropped below nineteen years—half that of agricultural workers in the countryside.</p>`
      },
      {
        stageIndex: 2,
        title: "The Blue Terror: Cholera & The Collapse of Laissez-Faire (1831–1848)",
        content: `<p class="prose-p"><span class="para-ref">[3.3]</span> In October 1831, a terrifying phantom arrived on merchant ships docking in Sunderland: Asiatic cholera. Known dreadfully as the <strong>'Blue Terror'</strong>, this waterborne killer struck with savage speed. A person could wake up healthy at dawn and be dead by nightfall, their body violently evacuated by severe vomiting and diarrhea, dehydrated until their blood thickened and skin turned a ghostly blue.</p><p class="prose-p">Cholera killed over 31,000 Britons in the 1831–32 epidemic, and struck again with murderous fury in 1848, claiming 53,000 lives. Doctors were utterly helpless, trapped in the ancient belief that disease spread via <strong>'miasma'</strong>—foul air arising from rotting matter.</p><p class="prose-p">Yet cholera possessed a terrifying egalitarian quality: while slums suffered worst, the airborne pestilence did not stop at working-class borders; it infected wealthy merchants and politicians. Cholera shattered Victorian faith in laissez-faire, demonstrating that filthy slums posed a lethal, existential threat to the entire nation.</p>`
      },
      {
        stageIndex: 3,
        title: "Edwin Chadwick & The 1842 Sanitary Report (1842)",
        content: `<p class="prose-p"><span class="para-ref">[3.4]</span> Confronted by epidemic disease and spiralling poor-rate costs, social reformer <strong>Edwin Chadwick</strong> published his monumental <em>Report on the Sanitary Condition of the Labouring Population</em> in 1842. Armed with meticulous statistical tables and doctors' reports, Chadwick demonstrated a direct, irrefutable link between filthy living environments and sky-high mortality rates.</p><p class="prose-p">Chadwick proved that working-class squalor was not caused by moral weakness, but by structural neglect: the total absence of clean water and underground drainage. He argued passionately that disease produced poverty, orphaning children and forcing thousands onto parish relief, costing the British taxpayer millions.</p><p class="prose-p">Chadwick’s brilliant solution was hydraulic engineering: a continuous arterial system of glazed ceramic pipes that would flush fresh water into homes under pressure and wash sewage out through underground brick tunnels. His report shocked Parliament, leading directly to the landmark <strong>1848 Public Health Act</strong> and the creation of local boards of health.</p>`
      },
      {
        stageIndex: 4,
        title: "The Great Stink & Bazalgette’s Sewer Triumph (1858–1865)",
        content: `<p class="prose-p"><span class="para-ref">[3.5]</span> Despite the 1848 Act, London’s politicians dragged their feet, refusing to fund municipal sanitation until Mother Nature forced their hand. In the scorching summer of 1858, an unbearable heatwave baked millions of gallons of untreated raw sewage festering in the River Thames. The resulting stench, immortalised as the <strong>'Great Stink'</strong>, was so suffocating that Parliament had to soak its curtains in chloride of lime to conduct business.</p><p class="prose-p">Fearing for their own lives, politicians passed emergency funding in eighteen days, appointing engineer <strong>Joseph Bazalgette</strong> Chief Engineer of the Metropolitan Board of Works. Bazalgette designed one of the greatest civil engineering marvels in human history.</p><p class="prose-p">Between 1858 and 1865, Bazalgette oversaw the excavation of 1,100 miles of street sewers connecting to eighty-two miles of colossal brick intercepting tunnels. These subterranean arteries harnessed gravity to intercept London’s waste and carry it far east of the capital. Bazalgette’s sewers permanently banished cholera from London, giving the modern city the underground life-support system it still uses today.</p>`
      }
    ]
  },

  // Lesson 4: How did ordinary people fight for a voice?
  {
    lessonIndex: 3,
    stages: [
      {
        stageIndex: 0,
        title: "The Sledgehammer of General Ludd (1811–1816)",
        content: `<p class="prose-p"><span class="para-ref">[4.1]</span> In the bleak winter of 1811, shadow-war broke out across the textile heartlands of Nottinghamshire, Yorkshire, and Lancashire. Skilled framework knitters and croppers faced financial ruin as mill masters installed wide mechanical shearing frames that produced cheap, shoddy cloth and slashed wages. In desperation, craftsmen organized an underground guerrilla resistance.</p><p class="prose-p">Operating by moonlight, disguised bands broke into factories, armed with giant blacksmith hammers manufactured by Enoch Taylor. With rhythmic blows, they smashed mechanical frames to pieces, leaving mocking letters signed by their mythical, forest-dwelling commander: <strong>'General Ned Ludd'</strong>.</p><p class="prose-p">Luddites were not primitive technophobes opposed to machinery; they were proud, skilled artisans fighting to protect their livelihoods, fair wages, and community dignity from unregulated exploitation. Terrified mill owners demanded military intervention. In 1812, Parliament passed the Frame Breaking Act, making machine-smashing a capital crime punishable by hanging, and deployed twelve thousand troops to northern England—more soldiers than Wellington commanded in the Peninsular War.</p>`
      },
      {
        stageIndex: 1,
        title: "The Peterloo Massacre: Sabres at St Peter’s Field (August 1819)",
        content: `<p class="prose-p"><span class="para-ref">[4.2]</span> With machine-breaking suppressed by military force, working-class resistance shifted from industrial sabotage to political radicalism. On a sweltering Monday, 16 August 1819, an orderly crowd of 60,000 working men, women, and children assembled at St Peter’s Field in Manchester. Dressed in their Sunday best and carrying banners demanding 'Universal Suffrage' and 'Liberty', they came to hear orator Henry Hunt speak.</p><p class="prose-p">Watching from nearby windows, wealthy magistrates panicked at the sight of organized working-class discipline. They ordered the Manchester Yeomanry—a mounted volunteer militia composed of wealthy cotton merchants and publicans—to charge into the dense crowd and arrest Hunt.</p><p class="prose-p">Drawing their cavalry sabres, the drunken horsemen hacked their way through the defenseless throng, trampling infants and slashing women. Within ten minutes, eighteen people were killed and over 650 horribly wounded. The tragedy was bitterly named the <strong>'Peterloo Massacre'</strong>, mocking the heroic triumph of Waterloo. Instead of apologizing, the Tory government banned public assemblies and jailed the organizers under the repressive Six Acts.</p>`
      },
      {
        stageIndex: 2,
        title: "Captain Swing & The Hampshire Harvest Riots (November 1830)",
        content: `<p class="prose-p"><span class="para-ref">[4.3]</span> A decade after Peterloo, revolutionary fervor spread from northern textile cities into the agricultural hamlets of southern England. In the freezing autumn of 1830, farmworkers faced catastrophic destitution. Landlords had enclosed common grazing lands, slashed winter wages to starvation levels, and introduced mechanical steam threshing machines that robbed labourers of their traditional winter grain-beating work.</p><p class="prose-p">Rebellion ignited across Hampshire, Sussex, and Kent under the ghostly signature of <strong>'Captain Swing'</strong>. Disguised agricultural labourers operated by night, smashing mechanical threshing machines with sledgehammers, tearing down tollgates, and burning landlords' hayricks into blazing beacons across the South Downs.</p><p class="prose-p">Handwritten letters were delivered to wealthy squires and clergy demanding living wages and an end to threshing machines, warning: <em>'If you do not destroy your machines and pay your men two shillings a day, we will burn your barns. Signed, Captain Swing.'</em> In Hampshire, rioting swept through Andover, Micheldever, and Fordingbridge, plunging the rural aristocracy into panic.</p>`
      },
      {
        stageIndex: 3,
        title: "The Winchester Special Assizes & State Vengeance (December 1830)",
        content: `<p class="prose-p"><span class="para-ref">[4.4]</span> Determined to crush agrarian defiance, the British government dispatched a Special Commission of High Court judges to Hampshire in December 1830. Inside the historic Great Hall of Winchester Castle, beneath King Arthur’s Round Table, over three hundred terrified Hampshire farmhands, ploughboys, and blacksmiths were put on show trials.</p><p class="prose-p">The judicial retribution was merciless. The magistrates were desperate to set a terrifying example that would deter future unrest. Nineteen-year-old Micheldever ploughboy <strong>Henry Cook</strong> was sentenced to death on the gallows for striking magistrate William Bingham Baring and knocking off his top hat during a protest—even though Baring was completely uninjured.</p><p class="prose-p">Over two hundred and fifty Hampshire men and boys were sentenced to <strong>penal transportation</strong>, torn from their families and shipped in iron chains to Van Diemen’s Land (Tasmania) for life. Despite the horrific state vengeance, the Swing Riots proved to Britain's ruling class that rural discontent was a ticking political time bomb.</p>`
      },
      {
        stageIndex: 4,
        title: "The Tolpuddle Martyrs & The Right to Combine (1834)",
        content: `<p class="prose-p"><span class="para-ref">[4.5]</span> Landowners and the government viewed any collective working-class organization as dangerous sedition. In 1833, in the quiet Dorset village of Tolpuddle, Methodist lay preacher <strong>George Loveless</strong> and five fellow farmworkers formed the 'Friendly Society of Agricultural Labourers'. Their goal was modest and peaceful: to resist a wage cut that would plunge their families into starvation on seven shillings a week.</p><p class="prose-p">To bond their members, the men held an initiation ceremony involving a blindfold and a traditional vow of loyalty. Local wealthy magistrate James Frampton conspired with Prime Minister Lord Melbourne to destroy the union, unearthing an obscure 1797 naval mutiny statute that forbade the taking of 'unlawful secret oaths'.</p><p class="prose-p">In March 1834, the six men—celebrated forever as the <strong>'Tolpuddle Martyrs'</strong>—were convicted and sentenced to seven years’ hard labour in the penal colonies of Australia. The vicious injustice provoked unprecedented national outrage. Over 100,000 trade unionists marched through London with massive banners, collecting an 800,000-signature petition that successfully forced the Crown to grant full royal pardons in 1836.</p>`
      }
    ]
  },

  // Lesson 5: How did the road to democracy expand?
  {
    lessonIndex: 4,
    stages: [
      {
        stageIndex: 0,
        title: "The Rotten Oligarchy: Old Sarum & The Unrepresented Cities (1800–1830)",
        content: `<p class="prose-p"><span class="para-ref">[5.1]</span> In 1830, Great Britain called itself a parliamentary democracy, but its political system was an exclusive oligarchy controlled by wealthy landed aristocrats. Barely four percent of adult men possessed the vote, tethered to a bizarre and corrupt electoral map unchanged since the Middle Ages.</p><p class="prose-p">Dozens of parliamentary seats belonged to notorious <strong>'rotten boroughs'</strong>—depopulated rural settlements with almost no voters. The most infamous was <strong>Old Sarum</strong> in Wiltshire: an uninhabited windswept hill with zero residents that still returned two Members of Parliament, controlled entirely by the local landowner who sold the seats to the highest bidder.</p><p class="prose-p">Conversely, colossal northern industrial cities like Manchester, Birmingham, and Leeds—economic powerhouses teeming with over a million factory workers, merchants, and industrialists—had zero MPs representing them in Parliament. Political power remained locked in the hands of rural squires who cared nothing for the smoke-choked factories creating Britain’s wealth.</p>`
      },
      {
        stageIndex: 1,
        title: "Bristol in Flames & The Days of May (1831–1832)",
        content: `<p class="prose-p"><span class="para-ref">[5.2]</span> In 1830, the Whig government led by Earl Grey introduced a moderate Parliamentary Reform Bill. But when the unelected House of Lords repeatedly threw the bill out in October 1831, fury exploded across Britain. Rioting convulsed industrial cities, reaching its terrifying climax in Bristol.</p><p class="prose-p">Enraged mobs seized Bristol for three days, storming prisons, torching the Bishop’s Palace, and setting the grand mansions of Queen Square ablaze. Troops charged with drawn sabres, killing dozens of civilians in the smoke-filled streets.</p><p class="prose-p">In May 1832, when the King refused to appoint pro-reform peers, radical leader Francis Place weaponized the financial system with the legendary slogan: <em>'To stop the Duke, go for gold!'</em> Citizens swarmed banks in a coordinated run, withdrawing £1.6 million in gold sovereigns in days. Threatened with economic collapse and armed revolution, King William IV and the House of Lords surrendered, passing the Reform Bill.</p>`
      },
      {
        stageIndex: 2,
        title: "The 1832 Great Reform Act: Triumph or \"Great Betrayal\"? (1832)",
        content: `<p class="prose-p"><span class="para-ref">[5.3]</span> The passing of the <strong>Great Reform Act in June 1832</strong> triggered celebratory street parties and ringing church bells across Britain. The Act swept away fifty-six rotten boroughs, redistributed parliamentary seats to industrial giants like Manchester and Birmingham, and expanded the male electorate by fifty percent to approximately 800,000 voters.</p><p class="prose-p">Yet for the working-class masses who had fought, rioted, and bled for reform, the Act was a bitter, cynical betrayal. The vote was granted strictly to men owning or renting property worth at least £10 a year—a property qualification that comfortably franchised wealthy factory masters, merchants, and lawyers, but deliberately locked out factory workers and agricultural labourers.</p><p class="prose-p">Working people realised that power had merely shifted from the country estate to the factory floor. The newly empowered middle-class Parliament proved its hostility immediately, passing the cruel 1834 Poor Law Bastille Act. Betrayed and furious, working-class leaders vowed to launch their own campaign for universal political freedom.</p>`
      },
      {
        stageIndex: 3,
        title: "The People’s Charter: Six Points for Working-Class Power (1838–1848)",
        content: `<p class="prose-p"><span class="para-ref">[5.4]</span> Out of the ashes of the 1832 betrayal rose the greatest mass democratic movement in British history: Chartism. In May 1838, London cabinet-maker <strong>William Lovett</strong> and fellow radicals drafted the <strong>'People's Charter'</strong>, demanding six fundamental democratic reforms: universal male suffrage, equal electoral districts, annual parliaments, payment for MPs, the abolition of property qualifications for candidates, and the secret ballot.</p><p class="prose-p">Chartists mobilized millions across northern mill towns and Welsh mining valleys. They organized torchlit mass meetings, produced the bestselling radical newspaper <em>The Northern Star</em>, and collected mammoth petitions. In 1842, Chartists carried a six-mile-long petition bearing 3.3 million signatures through London to Parliament on the shoulders of twenty stout men.</p><p class="prose-p">Parliament treated the petitions with arrogance and disdain, rejecting them three times in 1839, 1842, and 1848. Armed Chartist uprisings in Newport were crushed by soldiers' gunfire, and hundreds of leaders were imprisoned. Yet the moral crusade of Chartism permanently changed British politics; within eighty years, five of the Six Points became British law.</p>`
      },
      {
        stageIndex: 4,
        title: "The Secret Ballot Act: The Death of Landlord Coercion (1872)",
        content: `<p class="prose-p"><span class="para-ref">[5.5]</span> Even as the franchise slowly expanded under the 1867 Reform Act, elections remained deeply corrupt. Voting took place in public on open wooden platforms known as <strong>'hustings'</strong>. Voters had to stand before crowds of drunken spectators, partisan mobs, and their own employers to declare their political choice aloud.</p><p class="prose-p">This open system allowed wealthy landlords and factory bosses to exercise terrifying coercion. Tenant farmers who voted against their landlord faced immediate eviction from their cottages; factory workers who backed radical candidates were instantly fired. Wealthy candidates openly purchased votes with barrels of free ale, five-pound notes, and hired thugs who beat up opposition voters.</p><p class="prose-p">This corrupt system was demolished by the <strong>Secret Ballot Act of 1872</strong>. Tested for the first time at the August 1872 Pontefract by-election, voters entered private wooden booths to mark paper ballots in total confidentiality, sealing the ballot boxes with Pontefract liquorice wax seals. The secret ballot liberated ordinary British citizens from aristocratic intimidation, cementing the foundation of modern parliamentary democracy.</p>`
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
    const blocks = l.narrative_blocks || l.stages || [];

    el.stages.forEach(es => {
      if (blocks[es.stageIndex]) {
        blocks[es.stageIndex].title = es.title;
        blocks[es.stageIndex].heading = es.title;
        blocks[es.stageIndex].content = es.content;
        blocks[es.stageIndex].text = es.content;
        blocks[es.stageIndex].body = es.content;
        modified = true;
      }
    });
  });

  return modified;
}

// 1. Update data/industrialisation_and_empire.json and public/data/industrialisation_and_empire.json
['data/industrialisation_and_empire.json', 'public/data/industrialisation_and_empire.json'].forEach(relPath => {
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
    if (json.industrialisation_and_empire && applyEnrichment(json.industrialisation_and_empire)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (industrialisation_and_empire)`);
    }
  }
});

// 3. Update units/industrialisation_and_empire/data.js and public/units/industrialisation_and_empire/data.js
['units/industrialisation_and_empire/data.js', 'public/units/industrialisation_and_empire/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/industrialisation_and_empire.json'), 'utf8'));
    const fileContent = 'export default ' + JSON.stringify(json, null, 2) + ';\n';
    fs.writeFileSync(p, fileContent, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});

console.log('Industrialisation & Empire narrative enrichment in Christine Counsell storytelling mode complete!');

