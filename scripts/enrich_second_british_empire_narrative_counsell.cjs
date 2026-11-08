const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

const enrichedLessons = [
  // Lesson 1: Engines of Empire: Mercantilism, Naval Hegemony & Portsmouth Dockyard
  {
    lessonIndex: 0,
    stages: [
      {
        stageIndex: 0,
        title: "Mercantilism & The Closed Imperial Economy (1783–1815)",
        image: "/images/east_india_house.jpg",
        caption: "East India House on Leadenhall Street, London (c. 1800), headquarters of the East India Company and the administrative nerve centre of Britain's mercantilist global trade network.",
        content: `<p class="prose-p"><span class="para-ref">[1.1]</span> In the bitter aftermath of the American Revolutionary War (1783), Great Britain stood bereft of its Thirteen Colonies, confronting an existential economic crisis. Imperial planners pivoted decisively eastwards, determined that Britain’s Second Empire would be fortified by the rigid economic doctrine of <strong>mercantilism</strong>. Under mercantilist philosophy, world wealth was viewed as a fixed, finite pie measured in silver and gold bullion; a nation could prosper only by aggressively exporting manufactured goods while strictly curtailing foreign imports.</p><p class="prose-p">Colonies were legally designated as captive feeder markets designed to supply cheap raw materials—West Indian sugar, Virginia tobacco, and Indian silks—while consuming British industrial manufactures. This closed economic loop was fiercely policed by the <strong>Navigation Acts</strong>.</p><p class="prose-p">These strict maritime laws mandated that all colonial commodities must be transported exclusively aboard British-built ships manned by predominantly British crews. From the gilded boardrooms of the East India Company in London's Leadenhall Street to Caribbean sugar wharves, the British state welded imperial trade and naval power into an impenetrable commercial fortress.</p>`
      },
      {
        stageIndex: 1,
        title: "The Battle of Trafalgar & Ocean Dominance (21 October 1805)",
        image: "/images/battle_of_trafalgar_turner.jpg",
        caption: "J.M.W. Turner's masterwork 'The Battle of Trafalgar, 21 October 1805' (1822–1824), capturing Lord Nelson's flagship HMS Victory breaking the Franco-Spanish battle line.",
        content: `<p class="prose-p"><span class="para-ref">[1.2]</span> Absolute command of the world's oceans was decisively achieved on a rolling Atlantic swell off Cape Trafalgar on 21 October 1805. Confronting a combined French and Spanish fleet of thirty-three warships, Vice-Admiral <strong>Lord Horatio Nelson</strong> discarded orthodox naval tactics. Rather than engaging in a cautious, parallel firing line, Nelson hoisted his legendary telegraph flag signal: <em>'England expects that every man will do his duty.'</em></p><p class="prose-p">Nelson drove twenty-seven British ships of the line forward in two perpendicular columns, boldly piercing and bisecting the enemy formation. From the quarterdeck of his 104-gun flagship <em>HMS Victory</em>, Nelson watched British gunners unleash devastating point-blank double-shotted broadsides into the enemy hulls.</p><p class="prose-p">At 1:15 pm, a French sniper perched in the rigging of the <em>Redoutable</em> shot Nelson through the shoulder and spine; carried below, he died just as total victory was declared. The annihilation of Napoleon’s navy inaugurated the <strong>Pax Britannica</strong>—a century of undisputed British naval hegemony that shielded global trade lanes from rival empires.</p>`
      },
      {
        stageIndex: 2,
        title: "Portsmouth Royal Dockyard: Industrial Engine of Empire (1800–1850)",
        image: "/images/portsmouth_map.jpg",
        caption: "Historic survey map of Portsmouth Royal Dockyard, showing the Basin, dry docks, and Marc Isambard Brunel's revolutionary steam-driven block-making mills.",
        content: `<p class="prose-p"><span class="para-ref">[1.3]</span> The colossal maritime power that defended Britain's commercial empire was forged inside the smoke and clamour of <strong>Portsmouth Royal Dockyard</strong>. By 1800, Portsmouth was the largest industrial manufacturing complex in the world, employing thousands of shipwrights, caulkers, and blacksmiths. A single 100-gun first-rate ship of the line required over 1,400 wooden rigging blocks (pulleys) to hoist massive canvas sails and absorb the violent recoil of naval artillery.</p><p class="prose-p">Traditionally hand-carved by skilled artisans, the supply of blocks was a crippling naval bottleneck until French emigré engineer <strong>Marc Isambard Brunel</strong> partnered with precision toolmaker Henry Maudslay in 1803.</p><p class="prose-p">Together, they constructed the <strong>Portsmouth Block Mills</strong>, installing forty-five steam-driven, all-metal machine tools that constituted the world’s very first automated assembly line. Just ten unskilled labourers operating Brunel’s steam saws, morticing chisels, and shapers produced 130,000 interchangeable blocks annually, revolutionising naval logistics and keeping Britain's wooden wall permanently seaworthy.</p>`
      },
      {
        stageIndex: 3,
        title: "HMS Warrior & The Ironclad Revolution (1860–1861)",
        image: "/images/hms_warrior.jpg",
        caption: "HMS Warrior (1860), the Royal Navy's first iron-hulled, armour-plated battleship, constructed to outclass the French 'Gloire' and permanently preserved in Portsmouth Historic Dockyard.",
        content: `<p class="prose-p"><span class="para-ref">[1.4]</span> In 1859, a tremor of alarm ran through Whitehall when Napoleonic France launched <em>La Gloire</em>, the world’s first ocean-going ironclad warship. Britain responded with overwhelming industrial force. In December 1860, the Admiralty launched <strong>HMS Warrior</strong>, constructed not merely with timber clad in iron, but built around a revolutionary, entirely wrought-iron hull stretching 420 feet.</p><p class="prose-p">At her core lay an impenetrable armoured citadel: four-and-a-half inches of solid wrought-iron armour backed by eighteen inches of resilient teak, designed to defeat the heaviest explosive naval shells. Bristling with forty rifled and smoothbore cannon, <em>Warrior</em> married towering sails to a colossal 1,250-horsepower steam engine.</p><p class="prose-p">Capable of fourteen knots, she was the fastest, most heavily protected, and utterly invulnerable battleship on earth. Her arrival at Portsmouth rendered every wooden warship afloat instantaneously obsolete, re-establishing Britain’s uncontested technological command of the seas without firing a single shot in anger.</p>`
      },
      {
        stageIndex: 4,
        title: "The Two-Power Standard & Victorian Naval Deterrence (1889)",
        image: "/images/queen_victoria.jpg",
        caption: "Queen Victoria in her Golden Jubilee era (1887), presiding over the British Empire during the passage of the Naval Defence Act 1889 that codified the Two-Power Standard.",
        content: `<p class="prose-p"><span class="para-ref">[1.5]</span> By the late nineteenth century, the rise of ambitious industrial rivals—most notably Imperial Germany, France, and Russia—threatened to erode Britain’s maritime supremacy. To preserve strategic dominance, Prime Minister Lord Salisbury’s government introduced the landmark <strong>Naval Defence Act of 1889</strong>, formally codifying the <strong>Two-Power Standard</strong> into British constitutional policy.</p><p class="prose-p">This uncompromising doctrine legally mandated that the Royal Navy must maintain a front-line battlefleet equal to or greater than the combined naval strength of the next two largest world navies. Supported by an unprecedented £21.5 million budget, British dockyards erupted into feverish activity.</p><p class="prose-p">Over four years, eight massive first-class battleships and thirty-eight cruisers were laid down in Portsmouth, Chatham, and Devonport. This colossal naval expansion served as an unassailable global deterrent, safeguarding imperial coaling stations and telegraph cables from Gibraltar to Singapore, ensuring that Britannia’s maritime sovereignty remained unchallenged until the dawn of the Great War.</p>`
      }
    ]
  },

  // Lesson 2: The De-industrialisation of India: The Company & Handloom Crisis
  {
    lessonIndex: 1,
    stages: [
      {
        stageIndex: 0,
        title: "Mughal India: The World’s Textile Workshop (1650–1750)",
        image: "/images/bengal_weaver.jpg",
        caption: "A traditional Bengali weaver operating a pit loom in Dhaka (Dacca), crafting fine muslins and calicoes celebrated globally as 'woven wind'.",
        content: `<p class="prose-p"><span class="para-ref">[2.1]</span> In 1700, under the sprawling prosperity of the Mughal Empire, the Indian subcontinent was the undisputed textile workshop of the world, generating nearly a quarter of total global economic output. Across the lush river plains of Bengal, Gujarat, and the Coromandel coast, millions of skilled artisans operated traditional wooden pit looms, spinning cotton thread of legendary softness, durability, and intricate colour.</p><p class="prose-p">Indian cottons were celebrated worldwide: Dhaka muslins were so gossamer-light that poets called them <em>'woven wind'</em>, while printed calicoes and chintzes offered vibrant, wash-resistant patterns that European dyers could not match.</p><p class="prose-p">Because European manufacturers produced nothing that sophisticated Indian consumers desired, European merchant companies were forced to pay for these exquisite textiles exclusively in silver and gold bullion. For centuries, India acted as an immense global treasure sink, trading its peerless finished handicrafts for the precious metals mined in the Americas.</p>`
      },
      {
        stageIndex: 1,
        title: "The Protectionist Calico Acts (1700–1721)",
        image: "/images/spinning_mule.jpg",
        caption: "Samuel Crompton's spinning mule, which enabled British textile factories to mechanically replicate the yarn softness and tensile strength of Indian hand-spinners.",
        content: `<p class="prose-p"><span class="para-ref">[2.2]</span> The flood of cheap, colourful Indian textiles into England provoked a furious political backlash from domestic wool and silk guilds. British manufacturers watched their profits collapse as consumers of every class discarded coarse English wool in favour of comfortable, washable Indian calicoes. In 1719, enraged London silk weavers rioted through the streets of Spitalfields, attacking women wearing Indian calico dresses and throwing corrosive aqua fortis onto their garments.</p><p class="prose-p">Responding to political panic, Parliament passed aggressive protectionist legislation: the <strong>Calico Acts of 1700 and 1721</strong>.</p><p class="prose-p">These laws banned the import, sale, and domestic wearing of printed Indian cottons, imposing heavy financial penalties on offenders. By sheltering domestic producers behind state tariff walls, the British government granted English entrepreneurs the vital breathing space to mechanise: inventors like Arkwright, Hargreaves, and Crompton spent decades constructing steam-powered machinery specifically designed to replicate the fine weave perfected by generations of Indian handloom weavers.</p>`
      },
      {
        stageIndex: 2,
        title: "The 1765 Diwani of Bengal: Fiscal Extraction Inverts the Flow (1765)",
        image: "/images/shah_alam_clive.jpg",
        caption: "Benjamin West's painting depicting Mughal Emperor Shah Alam II granting the Diwani (right to collect taxes) of Bengal, Bihar, and Orissa to Robert Clive in August 1765.",
        content: `<p class="prose-p"><span class="para-ref">[2.3]</span> The commercial balance of power between Britain and India was overturned not in the marketplace, but on the battlefield. Following the British victory at Buxar, <strong>Robert Clive</strong> confronted the defeated Mughal Emperor Shah Alam II in August 1765. In an ornate ceremonial tent at Allahabad, the Emperor was coerced into signing the <strong>Treaty of Allahabad</strong>, granting the East India Company the <strong>Diwani</strong>—the sovereign right to collect land revenues across Bengal, Bihar, and Orissa.</p><p class="prose-p">Overnight, a private corporate trading enterprise became the autocratic fiscal ruler of over twenty million Indian subjects, extracting millions in annual taxation.</p><p class="prose-p">The financial flow inverted completely: the Company no longer needed to export British silver bullion to purchase Indian textiles. Instead, it used taxes squeezed directly from Bengali peasants to buy their own goods, shipping the cloth to London for pure corporate profit in a predatory process of unrequited economic tribute.</p>`
      },
      {
        stageIndex: 3,
        title: "Lancashire Steam Mills & Unequal Tariffs (1800–1835)",
        image: "/images/19th_century_mill.jpg",
        caption: "A 19th-century Lancashire steam-powered cotton weaving shed; mass-manufactured Manchester textiles flooded the Indian subcontinent duty-free under colonial tariff policies.",
        content: `<p class="prose-p"><span class="para-ref">[2.4]</span> By 1800, Britain’s Industrial Revolution had transformed Lancashire into a smoky leviathan of mass production. Powered by steam engines and automated looms, Manchester mills churned out billions of yards of cheap, uniform cotton cloth. To guarantee British global dominance, imperial administrators enforced a ruthlessly unequal tariff regime upon the Indian subcontinent.</p><p class="prose-p">While Indian handloom textiles imported into Britain were strangled with crushing duties of 70% to 80%, British factory-made cloth was forced into Indian markets under nominal, near-zero tariffs of barely 2% to 3%.</p><p class="prose-p">Indian artisans found it impossible to compete against steam engines backed by state-enforced protectionism. Between 1814 and 1835, British exports of cotton goods to India exploded from one million yards to over fifty million yards annually. Lancashire’s industrial expansion was subsidized by the deliberate destruction of Indian domestic manufacturing, reversing centuries of global trade flow.</p>`
      },
      {
        stageIndex: 4,
        title: "The Devastation of Handloom Weavers & Bentinck’s Lament (1834–1850)",
        image: "/images/bengal_weaver.jpg",
        caption: "A late 19th-century study of an Indian handloom weaver, capturing the surviving domestic craft after decades of colonial economic displacement.",
        content: `<p class="prose-p"><span class="para-ref">[2.5]</span> The human consequence of this state-directed <strong>de-industrialisation</strong> was economic catastrophe. Famous artisan metropolises like Dhaka and Murshidabad—once bustling trading cities wealthier than contemporary London—depopulated rapidly as their handloom industries collapsed. Tens of thousands of master weavers, spinners, and dyers were cast into destitution, their ancestral skills rendered worthless by British mechanical competition.</p><p class="prose-p">Deprived of industrial livelihoods, millions of ruined artisans retreated into the countryside, desperately crowding into subsistence agriculture and driving tenant farmers into debt.</p><p class="prose-p">In 1834, Governor-General <strong>Lord William Bentinck</strong> reported to London with grim historical eloquence: <em>'The misery hardly finds a parallel in the history of commerce. The bones of the cotton-weavers are bleaching the plains of India.'</em> India had been forcibly demoted from the world’s leading exporter of exquisite finished textiles into an impoverished supplier of raw cotton and indigo to feed British mills.</p>`
      }
    ]
  },

  // Lesson 3: The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj
  {
    lessonIndex: 2,
    stages: [
      {
        stageIndex: 0,
        title: "The Doctrine of Lapse & Territorial Annexations (1848–1856)",
        image: "/images/sepoy_mutiny_1857.png",
        caption: "Sepoy infantrymen of the Bengal Native Army; simmering grievances over religious contamination, overseas deployment, and the annexation of Awadh sparked revolt.",
        content: `<p class="prose-p"><span class="para-ref">[3.1]</span> By the mid-nineteenth century, British corporate rule in India rested upon a precarious foundation: over 200,000 native soldiers, known as <strong>sepoys</strong>, commanded by barely 40,000 British officers. Between 1848 and 1856, Governor-General <strong>Lord Dalhousie</strong> ignited widespread fury across princely India through the aggressive enforcement of the <strong>Doctrine of Lapse</strong>.</p><p class="prose-p">Under this imperial decree, if any Indian ruler died without a direct biological male heir, their territory was declared 'lapsed' and automatically confiscated by the East India Company, refusing to recognise centuries-old Hindu traditions of adopting successors.</p><p class="prose-p">Through this legalistic land-grab, Dalhousie annexed Satara, Nagpur, and the historic central state of Jhansi. In 1856, Dalhousie committed his ultimate provocation by deposing the Nawab of <strong>Awadh (Oudh)</strong> on charges of misgovernance. Because three-quarters of the Bengal Army’s high-caste sepoys were recruited from Awadh, soldiers viewed the annexation as an intolerable insult to their homeland and traditional privileges.</p>`
      },
      {
        stageIndex: 1,
        title: "The Greased Enfield Cartridges & Religious Alarm (April–May 1857)",
        image: "/images/indian_rebellion_1857.jpg",
        caption: "Contemporary engraving of the outbreak of the uprising at Meerut on 10 May 1857, as third cavalry troopers broke ranks and marched on Delhi to restore Mughal sovereignty.",
        content: `<p class="prose-p"><span class="para-ref">[3.2]</span> Simmering political grievances detonated into open mutiny in early 1857 with the introduction of the new <strong>Pattern 1853 Enfield rifle</strong>. To load the weapon, soldiers had to bite open the grease-soaked paper cartridges before pouring powder down the muzzle. Rumours swept through cantonments that the lubrication was manufactured from a mixture of beef tallow (sacred to Hindus) and pork lard (abhorrent to Muslims).</p><p class="prose-p">To the sepoys, this was not merely an administrative blunder; it was perceived as a calculated conspiracy by Christian colonial authorities to pollute their religious purity and force mass conversions.</p><p class="prose-p">At Meerut on 24 April, eighty-five troopers of the 3rd Light Cavalry bravely refused to touch the cartridges. On Saturday 9 May, before the entire assembled garrison, the men were stripped of their uniforms, fitted with heavy iron leg-irons, and marched off to ten years’ penal servitude, triggering incandescent rage among their watching comrades.</p>`
      },
      {
        stageIndex: 2,
        title: "The Meerut Mutiny & The March on Delhi (May–July 1857)",
        image: "/images/indian_rebellion_1857.jpg",
        caption: "British soldiers confronting Indian insurgent forces during the fierce fighting in northern India during the summer of 1857.",
        content: `<p class="prose-p"><span class="para-ref">[3.3]</span> On Sunday evening, 10 May 1857, while British officers prepared for church, the Meerut cantonment erupted into armed rebellion. Sepoys broke open the military prison, freed their shackled comrades, and shot their British commanding officers. Through the sweltering night, the soldiers marched thirty-eight miles southward to Delhi, crossing the Yamuna River at dawn.</p><p class="prose-p">Surging into the Red Fort, they acclaimed the reluctant eighty-one-year-old Mughal Emperor, <strong>Bahadur Shah Zafar</strong>, as the legitimate sovereign of all India.</p><p class="prose-p">The uprising quickly expanded into a mass civil war across northern India. In Cawnpore (Kanpur), rebel forces led by Nana Sahib besieged the British garrison; after surrendering under promises of safe conduct, British troops and civilians were massacred at the river wharves and inside the Bibighar. British relief columns responded with horrifying brutality, summarily hanging thousands of Indian villagers and blowing captured rebels from the mouths of cannon.</p>`
      },
      {
        stageIndex: 3,
        title: "Rani Lakshmibai & The Heroic Stand at Jhansi (1857–1858)",
        image: "/images/rani_of_jhansi.jpg",
        caption: "Popular portrait of Rani Lakshmibai of Jhansi, armed with sword and shield on horseback; General Hugh Rose praised her as 'the bravest and best military leader of the rebels'.",
        content: `<p class="prose-p"><span class="para-ref">[3.4]</span> The rebellion found its most courageous and enduring symbol of anti-colonial resistance in twenty-two-year-old <strong>Rani Lakshmibai</strong> of Jhansi. When the British had annexed her state in 1854 under the Doctrine of Lapse, she had famously vowed: <em>'Mera Jhansi nahi doongi'</em> ('I shall not surrender my Jhansi'). When rebel troops seized Jhansi in June 1857, Lakshmibai assumed leadership, fortifying the massive stone citadel, casting new cannon, and raising a female cavalry battalion.</p><p class="prose-p">In March 1858, British forces under Major-General Sir Hugh Rose besieged Jhansi with heavy siege artillery. For two weeks, Lakshmibai directed the fortress defense personally amidst relentless bombardment.</p><p class="prose-p">When British soldiers breached the walls, she strapped her young adopted son to her back, mounted her stallion, and leaped from the battlements under cover of darkness. Joining forces with Tantia Tope, she fought on until falling in cavalry combat at Kotah-ki-Serai on 17 June 1858. General Rose eulogised her as <em>'the bravest and best military leader of the rebels.'</em></p>`
      },
      {
        stageIndex: 4,
        title: "The Government of India Act 1858: The British Raj (1858)",
        image: "/images/queen_victoria.jpg",
        caption: "Queen Victoria, proclaimed Empress of India (Kaisar-i-Hind) in 1876 following the 1858 liquidation of the East India Company and the direct assumption of Crown rule.",
        content: `<p class="prose-p"><span class="para-ref">[3.5]</span> The bloody suppression of the 1857 rebellion sounded the death knell of corporate colonialism. Shocked by the Company’s catastrophic administrative failure, Parliament passed the <strong>Government of India Act in August 1858</strong>, abolishing the East India Company and transferring all Indian territories, revenues, and armies directly to the British Crown.</p><p class="prose-p">Executive power was vested in a Cabinet minister, the Secretary of State for India, and an on-the-ground Viceroy in Calcutta, formally establishing the era of the <strong>British Raj</strong>.</p><p class="prose-p">In November 1858, Queen Victoria issued a conciliatory Royal Proclamation promising religious non-interference and equal protection under the law. Yet beneath this diplomatic veneer, British rule turned profoundly suspicious, racialised, and autocratic. The Indian Army was restructured to guarantee a safe one-to-two ratio of European to native troops; artillery was placed exclusively in British hands; and social reform was abandoned in favour of conservative alliances with compliant feudal princes.</p>`
      }
    ]
  },

  // Lesson 4: The Scramble for Africa & Imperial Ideology: Maxim Guns & Plunder
  {
    lessonIndex: 3,
    stages: [
      {
        stageIndex: 0,
        title: "The Berlin West Africa Conference 1884–1885 (1884–1885)",
        image: "/images/berlin_conference_1884.jpg",
        caption: "Contemporary German engraving of the 1884–1885 Berlin West Africa Conference, hosted by Chancellor Otto von Bismarck, carving the African continent among European powers.",
        content: `<p class="prose-p"><span class="para-ref">[4.1]</span> On 15 November 1884, representatives from fourteen European empires, alongside the United States, convened around a massive continental map table inside the Chancellery on Berlin's Wilhelmstrasse. Chaired by German Chancellor <strong>Otto von Bismarck</strong>, the <strong>Berlin West Africa Conference</strong> was convened to establish ground rules for the partition of Africa, seeking to avert catastrophic wars between European rivals as they scrambled for tropical territory.</p><p class="prose-p">Crucially, not a single African monarch, diplomat, or community representative was invited to attend the proceedings.</p><p class="prose-p">Over three months of diplomatic bargaining, European statesmen carved up 11.7 million square miles of land using rulers and coloured pencils. With imperial arrogance, they drew arbitrary geometric frontiers across mountain ranges and river basins, slicing through ancient ethnic groups, linguistic boundaries, and indigenous kingdoms. This diplomatic summit legitimised the violent colonisation of an entire continent under the banner of European law.</p>`
      },
      {
        stageIndex: 1,
        title: "The Principle of Effective Occupation (1885–1914)",
        image: "/images/map_africa_1914.png",
        caption: "Map of colonial Africa in 1914, demonstrating that over 90% of the continent had fallen under European imperial control, leaving only Ethiopia and Liberia independent.",
        content: `<p class="prose-p"><span class="para-ref">[4.2]</span> The most consequential outcome of the Berlin Conference was Article 35 of the General Act, which established the principle of <strong>'Effective Occupation'</strong>. Under this rule, a European power could no longer claim sovereign ownership of African territory merely by planting a national flag on a beach; it had to demonstrate physical mastery by establishing administrative garrisons, police posts, and signed treaties with local chiefs.</p><p class="prose-p">This legal mandate triggered an uncontrolled, frantic land rush across the African interior known as the <strong>Scramble for Africa</strong>.</p><p class="prose-p">Between 1885 and 1914, the speed of European conquest astonished the world. In 1870, European powers controlled barely 10% of Africa, confined largely to coastal trading enclaves; by 1914, European colonisers had conquered over 90% of the landmass. Britain secured vast territories stretching from Egypt to South Africa, driven by Cecil Rhodes' imperial fantasy of an unbroken 'Cape-to-Cairo' red corridor, leaving only Ethiopia and Liberia independent.</p>`
      },
      {
        stageIndex: 2,
        title: "The Maxim Gun & Quinine: Military Asymmetry (1884–1898)",
        image: "/images/maxim_machine_gun.jpg",
        caption: "The Maxim machine gun (patented 1884), firing 600 rounds per minute; along with medicinal quinine, it granted European colonial forces overwhelming tactical superiority.",
        content: `<p class="prose-p"><span class="para-ref">[4.3]</span> European conquest of Africa was driven not by moral superiority, but by radical technological and military asymmetry. For centuries, lethal tropical diseases—chiefly malaria and yellow fever—had earned the West African interior the dread title of the <em>'White Man's Grave'</em>, killing up to half of all European expeditions. The widespread adoption of <strong>quinine prophylaxis</strong> from the 1850s transformed tropical medicine, allowing colonial armies to survive deep inland.</p><p class="prose-p">Militarily, the balance shifted decisively with the invention of the <strong>Maxim machine gun</strong> in 1884, capable of firing 600 high-velocity rounds per minute.</p><p class="prose-p">At the 1898 <strong>Battle of Omdurman</strong> in Sudan, Anglo-Egyptian forces armed with Maxim guns and gunboats slaughtered over 11,000 Sudanese Mahdist warriors while losing fewer than fifty men. This brutal tactical imbalance was dryly summarized by imperialist poet Hilaire Belloc: <em>'Whatever happens, we have got / The Maxim Gun, and they have not.'</em></p>`
      },
      {
        stageIndex: 3,
        title: "Rudyard Kipling & The Myth of \"The White Man's Burden\" (1899)",
        image: "/images/rudyard_kipling.jpg",
        caption: "Rudyard Kipling in his study (c. 1895), author of 'The White Man's Burden' (1899), which articulated the paternalistic imperial ideology justifying colonial dominance.",
        content: `<p class="prose-p"><span class="para-ref">[4.4]</span> To justify violent territorial conquest to domestic Christian audiences, Victorian imperialists constructed an elaborate cultural myth of benevolent paternalism. Popularised in 1899 by poet <strong>Rudyard Kipling</strong>, this ideology was christened <strong>'The White Man’s Burden'</strong>. Imperialists insisted that colonisation was not an act of selfish economic plunder, but a noble, self-sacrificing moral duty to bring the <strong>'Three Cs'</strong>—Christianity, Commerce, and Civilisation—to non-European peoples.</p><p class="prose-p">This moralising rhetoric was heavily reinforced by pseudo-scientific racism and <strong>Social Darwinism</strong>.</p><p class="prose-p">Theorists distorted Charles Darwin’s evolutionary concepts to argue that human races existed in a natural hierarchy, with Anglo-Saxons perched at the biological summit. In British schoolrooms, newspapers, and missionary magazines, colonial expansion was glorified as a humanitarian crusade to rescue 'backward' populations from savagery, systematically blinding the British public to the violent dispossession and cultural destruction wrought across the empire.</p>`
      },
      {
        stageIndex: 4,
        title: "Resource Extraction, Cetshwayo & Resistance in the Congo (1879–1908)",
        image: "/images/cetshwayo_king_of_zulus.jpg",
        caption: "King Cetshwayo kaMpande of the Zulu Kingdom, whose army famously defeated British forces at the Battle of Isandlwana in 1879 before succumbing to imperial firepower.",
        content: `<p class="prose-p"><span class="para-ref">[4.5]</span> Despite overwhelming European firepower, African societies mounted determined resistance against imperial subjugation. In 1879, <strong>King Cetshwayo kaMpande</strong> mobilised 20,000 disciplined Zulu warriors armed with cowhide shields and stabbing assegais, annihilating a British invasion force at the Battle of Isandlwana before British artillery prevailed at Ulundi. Meanwhile, beneath high-minded imperial rhetoric lay horrific economic predation, exemplified in the <strong>Congo Free State</strong>, run as the personal commercial fiefdom of King Leopold II of Belgium.</p><p class="prose-p">To exploit the worldwide boom in wild rubber for bicycle and automobile tyres, Leopold’s mercenary army, the <em>Force Publique</em>, terrorised the population.</p><p class="prose-p">Villages failing to meet punishing rubber quotas were burned; women were held hostage; and soldiers were ordered to sever the hands of living victims to account for spent bullets. Between 1885 and 1908, an estimated ten million Congolese perished from forced labour, starvation, and slaughter—an atrocity finally exposed by whistleblowers E.D. Morel and Roger Casement.</p>`
      }
    ]
  },

  // Lesson 5: The Imperial Verdict: Workshop of the World or Age of Exploitation?
  {
    lessonIndex: 4,
    stages: [
      {
        stageIndex: 0,
        title: "The 1851 Great Exhibition: Workshop of the World (1851)",
        image: "/images/great_exhibition_1851.jpg",
        caption: "The Crystal Palace in Hyde Park, London, hosting the 1851 Great Exhibition of the Works of Industry of All Nations, celebrating Britain as the 'Workshop of the World'.",
        content: `<p class="prose-p"><span class="para-ref">[5.1]</span> On 1 May 1851, Queen Victoria opened the <strong>Great Exhibition of the Works of Industry of All Nations</strong> inside Joseph Paxton’s magnificent prefabricated glass-and-iron <strong>Crystal Palace</strong> in London's Hyde Park. Over five months, six million visitors marveled at 100,000 exhibits showcasing Britain's undisputed status as the <strong>'Workshop of the World'</strong>. Giant steam locomotives, precision machine tools, and automated textile machinery proclaimed Britain’s technological supremacy.</p><p class="prose-p">Yet the spectacle was equally a triumph of global empire. The Indian court displayed exquisite silk brocades, carved elephant tusks, and the captured 186-carat <strong>Koh-i-Noor diamond</strong>, surrendered by eleven-year-old Maharaja Duleep Singh.</p><p class="prose-p">The Exhibition embodied the Victorian imperial economic ideal: raw commodities—cotton from India, wool from Australia, palm oil from Nigeria—were harvested across the colonies, transported by British ships, refined inside British steam factories, and sold back to global markets at immense corporate profit.</p>`
      },
      {
        stageIndex: 1,
        title: "Colonial Infrastructure: Railways, Canals & Telegraphs (1853–1900)",
        image: "/images/great_eastern_telegraph_cable.jpg",
        caption: "The SS Great Eastern laying submarine telegraph cables; by 1870, undersea telegraph lines connected London directly to Bombay, shrinking communication time from months to minutes.",
        content: `<p class="prose-p"><span class="para-ref">[5.2]</span> Proponents of the British Empire argued that colonial rule brought modernization and technological progress to colonized societies. Across the Indian subcontinent, British engineers oversaw the construction of over 25,000 miles of railways, thousands of miles of irrigation canals, and extensive telegraph networks. In 1870, the monumental engineering feat of laying submarine telegraph cables across the Mediterranean and Red Sea connected London to Bombay, shrinking communication times from months to mere minutes.</p><p class="prose-p">Yet modern historians stress that this infrastructure was designed primarily for imperial extraction and military control, rather than domestic welfare.</p><p class="prose-p">Railway tracks did not connect rural farming villages to regional food markets; instead, lines ran directly from inland resource fields to deep-water ports like Bombay, Calcutta, and Karachi, facilitating the rapid export of raw cotton, wheat, and opium to Europe and enabling the rapid deployment of British garrison troops to suppress internal rebellion.</p>`
      },
      {
        stageIndex: 2,
        title: "The Great Famines & Strict Laissez-Faire Dogma (1876–1878)",
        image: "/images/madras_famine_1877.jpg",
        caption: "Contemporary engraving from the Illustrated London News (1877) depicting famine victims in Madras awaiting relief during the catastrophic drought and grain export policy of 1876–1878.",
        content: `<p class="prose-p"><span class="para-ref">[5.3]</span> The tragic paradox of colonial infrastructure was laid bare during the <strong>Great Madras Famine of 1876–1878</strong>. When severe drought struck southern India, newly laid railways were utilized not to rush emergency grain into starving villages, but to export record harvests of Indian wheat and rice to lucrative British markets. Governed by dogmatic <strong>laissez-faire</strong> economics and Malthusian population theory, Viceroy <strong>Lord Lytton</strong> strictly prohibited government price controls or unconditional food relief, arguing that charity would breed dependency.</p><p class="prose-p">Starving peasants were forced into penal relief camps, enduring backbreaking heavy labour on starvation diets containing fewer calories than inmates later received at Buchenwald.</p><p class="prose-p">While Lytton celebrated Queen Victoria’s proclamation as Empress of India with lavish banquets in Delhi, an estimated 5.5 to 8 million Indian subjects died of starvation and epidemic disease, turning lush agricultural landscapes into desolate graveyards.</p>`
      },
      {
        stageIndex: 3,
        title: "Dadabhai Naoroji & The \"Drain of Wealth\" Theory (1867–1901)",
        image: "/images/dadabhai_naoroji.jpg",
        caption: "Dadabhai Naoroji, Indian scholar, nationalist pioneer, and the first Asian Member of the British Parliament (elected 1892), who formulated the 'Drain of Wealth' thesis.",
        content: `<p class="prose-p"><span class="para-ref">[5.4]</span> Indian nationalist intellectuals decisively challenged the imperial narrative of benevolent modernisation. Foremost among them was <strong>Dadabhai Naoroji</strong>, a brilliant mathematician and political pioneer who in 1892 became the first Asian elected to the British House of Commons, winning the London constituency of Finsbury Central. In his landmark 1901 treatise, <em>Poverty and Un-British Rule in India</em>, Naoroji formulated the revolutionary <strong>'Drain of Wealth'</strong> thesis.</p><p class="prose-p">Using rigorous statistical analysis, Naoroji demonstrated that Britain extracted tens of millions of pounds from India annually without any economic return.</p><p class="prose-p">This systemic drain operated through 'Home Charges': exorbitant salaries and pensions paid to British colonial officials in London, guaranteed 5% profit dividends granted to British railway speculators, and the imperial military budget that used Indian taxes to fund British foreign wars in China and Afghanistan. Naoroji argued that this financial haemorrhage transformed a historically wealthy civilization into an impoverished colony prone to manufactured famine.</p>`
      },
      {
        stageIndex: 4,
        title: "Historiographical Verdict: Niall Ferguson vs Shashi Tharoor (20th–21st Century)",
        image: "/images/rhodes_colossus.png",
        caption: "Punch cartoon (1892) 'The Rhodes Colossus' depicting Cecil Rhodes striding across Africa; a classic visual embodiment of high Victorian imperialism and modern historiographical debate.",
        content: `<p class="prose-p"><span class="para-ref">[5.5]</span> Today, the historical legacy of the British Empire remains one of the most fiercely debated battlegrounds in modern historiography. Imperial apologists, represented by historian <strong>Niall Ferguson</strong>, argue that the British Empire was an indispensable pioneer of global modernisation. Ferguson contends that Britain promoted global free trade, invested immense capital in transport infrastructure, introduced the English common law, and fostered parliamentary institutions across five continents, laying the foundations for modern liberal democracy.</p><p class="prose-p">In stark opposition, post-colonial scholars such as <strong>Shashi Tharoor</strong> argue that the Empire was an extractive, racialised tyranny that systematically plundered colonies, destroyed domestic industries, and caused millions of preventable famine deaths.</p><p class="prose-p">Tharoor highlights that India commanded 27% of global GDP when Britain arrived in 1700, but held less than 3% upon independence in 1947. This enduring debate forces students to weigh technological modernization against the human cost of racial subjugation and economic extraction.</p>`
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
    const blocks = l.stages || l.narrative_blocks || [];

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

// 1. Update data/second_british_empire.json and public/data/second_british_empire.json
['data/second_british_empire.json', 'public/data/second_british_empire.json'].forEach(relPath => {
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
    if (json.second_british_empire && applyEnrichment(json.second_british_empire)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (second_british_empire)`);
    }
  }
});

// 3. Update units/second_british_empire/data.js and public/units/second_british_empire/data.js
['units/second_british_empire/data.js', 'public/units/second_british_empire/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/second_british_empire.json'), 'utf8'));
    const fileContent = 'export default ' + JSON.stringify(json, null, 2) + ';\n';
    fs.writeFileSync(p, fileContent, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});

console.log('Second British Empire narrative enrichment in Christine Counsell storytelling mode complete!');

