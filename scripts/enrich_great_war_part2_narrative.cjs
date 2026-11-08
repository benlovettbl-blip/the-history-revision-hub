const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// Enriched 25 narrative blocks for great_war_part2 (~145-155 words per stage)
const enrichedLessons = [
  // Lesson 1: 1914 & The Rush to the Colours
  {
    lessonIndex: 0,
    stages: [
      {
        stageIndex: 0,
        title: "Kitchener’s Warning & The Urgent Call for Volunteers",
        content: `<p class="prose-p">In August 1914, Great Britain entered the European war without any peacetime conscription laws. Its modest regular army—the <strong>British Expeditionary Force (BEF)</strong>—numbered barely 120,000 professional soldiers, dwarfed by continental armies mobilising millions of trained conscripts. Unlike Germany or France, Britain’s strategic doctrine had long prioritised naval dominance, leaving its land forces woefully inadequate for prolonged continental warfare.</p><p class="prose-p">Field Marshal <strong>Lord Kitchener</strong>, the celebrated imperial hero appointed Secretary of State for War, immediately shattered romantic illusions that the conflict would be a swift, glorious skirmish 'over by Christmas'. Kitchener presciently warned a stunned Cabinet that modern industrial warfare would devour millions of men and last at least three grueling years. He demanded an unprecedented peacetime expansion, issuing an urgent appeal for 500,000 volunteers.</p><p class="prose-p">Immortalised on posters designed by Alfred Leete depicting Kitchener sternly pointing at passers-by with the legendary slogan <em>'Your Country Needs YOU'</em>, the campaign triggered an overwhelming patriotic response. Within eight weeks, over 750,000 men swarmed recruiting offices across Britain.</p>`
      },
      {
        stageIndex: 1,
        title: "Belgian Neutrality, German Atrocities & The Moral Crusade",
        content: `<p class="prose-p">At midnight on 4 August 1914, Great Britain declared war on the German Empire following Kaiser Wilhelm II’s unprovoked invasion of neutral Belgium. Under the historic 1839 <strong>Treaty of London</strong>, European powers had solemnly pledged to uphold Belgian neutrality. When British diplomats demanded Germany respect this international guarantee, German Chancellor Bethmann-Hollweg notoriously dismissed the historic treaty as a worthless <em>'scrap of paper'</em>.</p><p class="prose-p">German troops encountered unexpected armed resistance from the Belgian army and retaliated with harsh collective punishments. Across eastern Belgium, the German military burned historic towns, destroyed the priceless university library of Louvain, and executed hundreds of civilian hostages accused of being civilian snipers (<em>franc-tireurs</em>).</p><p class="prose-p">Sensationalized British newspaper accounts depicting the <strong>'Rape of Belgium'</strong> galvanised national fury, portraying the war not as a cynical imperial rivalry, but as an urgent moral crusade between civilisation and barbarism. Young British men felt an irresistible civic obligation to punish Prussian militarism and defend 'Brave Little Belgium'.</p>`
      },
      {
        stageIndex: 2,
        title: "The Invention of Pals Battalions: Comrades in Arms",
        content: `<p class="prose-p">To channel the overwhelming flood of enthusiastic recruits and relieve overwhelmed central training depots, <strong>Lord Derby</strong> and General Henry Rawlinson devised an innovative recruitment strategy: the creation of <strong>'Pals Battalions'</strong>. The War Office pledged that friends, work colleagues, sporting teammates, and neighbours who enlisted together would remain united throughout military training and combat operations.</p><p class="prose-p">This concept captured the vibrant civic pride of Edwardian Britain. Towns, churches, and professions competed fiercely to fund and recruit bespoke municipal battalions. Clerks, railway workers, and miners joined alongside their lifelong companions, turning military enlistment into an inspiring extension of neighborhood solidarity.</p><p class="prose-p">On the south coast, Portsmouth alongside neighboring towns including Fareham and Stubbington rapidly raised the 14th and 15th Battalions of the Hampshire Regiment—celebrated locally as the <strong>'Pompey Pals'</strong>. Dockyard shipwrights, schoolteachers, and footballers formed tight-knit platoons. Tragically, this shared geographic recruitment meant that when disastrous battles struck, entire streets and communities would lose a whole generation of young men simultaneously.</p>`
      },
      {
        stageIndex: 3,
        title: "Poverty, Adventure & The Lure of the King’s Shilling",
        content: `<p class="prose-p">While patriotic duty was paramount, enlistment was also driven by powerful economic pressures and the longing for adventure. For millions of Edwardian working-class youths, daily existence was defined by insecure casual dock labour, exhausting textile mill shifts, and damp urban tenements. Military enlistment offered guaranteed financial security and an immediate rise in material living conditions.</p><p class="prose-p">Accepting the symbolic <strong>'King's Shilling'</strong> provided recruits with steady pay of one shilling and two pence (1s 2d) a day, three substantial hot meals, clean woollen uniforms, and sturdy leather boots—luxuries many poor families rarely enjoyed. For undernourished city lads, basic army rations caused average recruits to gain over an inch in height and a stone in weight during initial depot training.</p><p class="prose-p">Furthermore, naive teenage volunteers viewed the army as an exhilarating passport to see the world. Encouraged by schoolboy adventure fiction, young men were convinced that soldiering offered romantic battlefield glory, foreign travel, and heroic distinction, all destined to conclude triumphantly <strong>'over by Christmas'</strong>.</p>`
      },
      {
        stageIndex: 4,
        title: "Coercive Patriotism: White Feathers & Social Pressure",
        content: `<p class="prose-p">Beneath spontaneous patriotic enthusiasm lay formidable instruments of social coercion. In late August 1914, retired Admiral Charles Fitzgerald founded the <strong>Order of the White Feather</strong> in Folkestone, dispatching young women through seaside resorts and city streets to pin white feathers—the traditional badge of cowardice—onto the lapels of any able-bodied man not wearing military uniform.</p><p class="prose-p">Popular music halls amplified this coercive climate, performing rousing propaganda songs that mockingly questioned the masculinity of men who stayed at home. Prominent employers, commercial banks, and local councils dismissed unmarried male clerks to force them toward recruiting offices, while churches proclaimed that refusing to serve was a moral failure before God and nation.</p><p class="prose-p">Surrounded by Alfred Leete's pointing poster, aggressive community gossip, and the relentless surveillance of neighbours, unmarried men faced unbearable public humiliation. Refusing the call meant enduring painful accusations of treason and social ostracism, transforming voluntary enlistment into a compulsory social obligation for Edwardian youth.</p>`
      }
    ]
  },

  // Lesson 2: Trench Warfare & The Haig Controversy (1915–1916)
  {
    lessonIndex: 1,
    stages: [
      {
        stageIndex: 0,
        title: "Firepower Superiority & The Western Front Stalemate",
        content: `<p class="prose-p">By late November 1914, fluid mobile warfare on the Western Front had collapsed into complete immobility. Following the bloody Battle of the Marne and the frantic <strong>'Race to the Sea'</strong>, opposing British, French, and German armies collided along an unbroken front. For the first time in military history, battlefield tactics were dominated completely by the crushing defensive superiority of modern industrial firepower.</p><p class="prose-p">Rapid-firing machine guns, notably the British <strong>Vickers</strong> and German <strong>Maxim</strong> firing 500 to 600 rounds per minute, combined with heavy rifled artillery firing explosive shrapnel shells, transformed open meadows into lethal zones of obliteration. When commanders launched traditional massed infantry charges across open ground, defensive crossfire slaughtered attacking lines in minutes.</p><p class="prose-p">Confronting lethal shrapnel and bullet storms, armies dug desperately into the earth for self-preservation. What began as shallow emergency rifle pits rapidly expanded into a continuous, deeply fortified system of earthworks stretching 400 miles from the Belgian coast to the neutral Swiss frontier.</p>`
      },
      {
        stageIndex: 1,
        title: "Trench Architecture & The Three-Tier Defensive System",
        content: `<p class="prose-p">Frontline trenches rapidly developed into a sophisticated <strong>three-tier defensive network</strong> designed to absorb artillery bombardments and repel hostile assaults. At the front lay the forward fire trench, manned by sentries and machine-gun crews. Several hundred yards behind ran the support trench holding reserve troops and counter-attack supplies, followed by the reserve trench. All three lines were linked by sunken communication trenches for moving wounded men and ammunition.</p><p class="prose-p">Trenches were deliberately excavated in an angular <strong>zig-zag or traverse pattern</strong>. This architectural safeguard ensured that if an enemy shell struck or hostile stormtroopers infiltrated a trench line, shrapnel and gunfire could not sweep down the full length of the ditch.</p><p class="prose-p">Ahead of the fire trench lay <strong>No Man's Land</strong>, guarded by thick tangles of barbed wire belts designed to herd attacking soldiers into pre-sighted machine-gun fire zones. Deep underground, reinforced subterranean concrete dugouts offered shelter during sustained artillery barrages, preserving troops until enemy infantry advanced.</p>`
      },
      {
        stageIndex: 2,
        title: "Physical and Psychological Trauma in the Mud",
        content: `<p class="prose-p">Daily survival in the trenches was a harrowing battle against elemental filth, disease, and relentless psychological torment. Waterlogged clay soil and continuous rainfall turned trench floors into putrid liquid mud, causing <strong>Trench Foot</strong>—a crippling fungal condition where restricted circulation caused toes to turn black with gangrene, often requiring surgical amputation.</p><p class="prose-p">Soldiers lived in filthy, unwashed uniforms infested with millions of lice that spread painful trench fever, while giant brown rats gorged on unburied corpses in No Man's Land. Daily routines were dominated by predawn stand-to inspections, draining flooded duckboards, and nocturnal wire repairs under the glare of enemy flare-lights.</p><p class="prose-p">Above all hung the constant, nerve-shattering terror of artillery bombardment. Heavy howitzers hurled thousands of high-explosive shells, pulverising trenches and burying men alive. This relentless bombardment caused <strong>'shell shock'</strong>—acute psychological trauma that left men trembling uncontrollably, mute, or catatonic. Tragically, military authorities treated this mental breakdown as moral failure, executing 306 British and Commonwealth soldiers for desertion or cowardice.</p>`
      },
      {
        stageIndex: 3,
        title: "1 July 1916: The Catastrophe of the Somme",
        content: `<p class="prose-p">On 1 July 1916, British and French forces launched the Battle of the Somme, intended to relieve catastrophic French losses at Verdun and decisively break the German line. The offensive was preceded by a colossal <strong>seven-day preliminary bombardment</strong>, during which 1.5 million artillery shells were hurled at German positions to annihilate their frontline trenches and shred their defensive barbed wire.</p><p class="prose-p">The bombardment proved disastrously ineffective. Over thirty percent of British shells were low-quality manufacturing duds, shrapnel failed to sever thick wire barricades, and German soldiers sheltered safely in fortified subterranean bunkers forty feet underground.</p><p class="prose-p">When the bombardment lifted at 7:30 am, British troops climbed over their parapets and advanced in rigid tactical lines across No Man's Land. German machine-gunners emerged immediately, establishing deadly interlocking fields of fire. By dusk, the British Army had suffered <strong>57,470 casualties</strong>, including 19,240 dead—the bloodiest single day in British military history. Entire municipal Pals battalions were devastated in minutes, plunging towns into collective mourning.</p>`
      },
      {
        stageIndex: 4,
        title: "The Haig Controversy: \"Butcher\" or Modernising General?",
        content: `<p class="prose-p">British Commander-in-Chief <strong>Sir Douglas Haig</strong> remains the most fiercely debated military figure in modern British history. Following the war, influential critics and popular memory condemned Haig as a callous and unimaginative commander—the epitome of <em>'lions led by donkeys'</em>—who squandered an entire generation of young men in futile frontal assaults against fortified machine guns, indifferent to the appalling human carnage.</p><p class="prose-p">However, modern revisionist military historians have challenged this simplistic verdict. They argue that Haig was trapped on a steep and unprecedented technological <strong>'learning curve'</strong>, navigating an industrial battlefield where defensive firepower inherently overwhelmed offensive tactics, and where primitive radio communications made tactical command in battle nearly impossible.</p><p class="prose-p">Revisionists emphasize that through relentless trial, operational adaptation, and technological integration, Haig successfully pioneered sophisticated <strong>combined-arms warfare</strong>. By coordinating rolling artillery barrages, <strong>tanks</strong>, reconnaissance aircraft, and specialist infantry platoons, Haig commanded the British Army during the Hundred Days Offensive of 1918, successfully smashing the formidable Hindenburg Line to deliver Allied victory.</p>`
      }
    ]
  },

  // Lesson 3: Global Empire & The Forgotten Fronts (1914–1918)
  {
    lessonIndex: 2,
    stages: [
      {
        stageIndex: 0,
        title: "Mobilising the Empire: A Truly Global Lifeline",
        content: `<p class="prose-p">The Great War was fundamentally an imperial conflict whose final outcome depended directly on the resources and manpower of the British Empire. Over <strong>four million non-white colonial soldiers, logistical workers, and carriers</strong> from Africa, the Caribbean, India, and the Pacific were mobilised alongside hundreds of thousands of Dominion troops from Canada, Australia, and New Zealand to sustain Britain's war effort.</p><p class="prose-p">Beyond battlefield manpower, the empire served as an indispensable economic lifeline that shielded Britain from industrial starvation and financial collapse. Canadian farms supplied millions of bushels of wheat; Australian and New Zealand pastoralists provided wool for uniforms and frozen meat; India supplied essential jute sacks for millions of trench sandbags, while oil reserves from Persia and Nigeria fueled the Royal Navy.</p><p class="prose-p">Protected by British naval convoys across the Atlantic and Indian Oceans, this imperial supply network transported raw materials, munitions, and foodstuffs, transforming the British Empire into the decisive global foundation of Allied military endurance.</p>`
      },
      {
        stageIndex: 1,
        title: "The Indian Army in Flanders & Khudadad Khan’s Victoria Cross",
        content: `<p class="prose-p">The Indian Army provided the earliest and most vital imperial reinforcements to the Western Front. In the autumn of 1914, over 130,000 soldiers of the Indian Expeditionary Force arrived in France, wearing light cotton uniforms ill-suited to northern European rain and sleet. Rushed directly into the freezing mud of the First Battle of Ypres, Indian soldiers plugged critical gaps in the shattered Allied frontline at a moment of desperate peril.</p><p class="prose-p">Despite racial prejudice and severe language barriers, Indian troops fought with extraordinary gallantry in horrific trench conditions. On 31 October 1914 at Hollebeke, Belgium, Sepoy <strong>Khudadad Khan</strong> of the 129th Baluchis was stationed with his machine-gun section when German infantry overran the trench.</p><p class="prose-p">Though gravely wounded and with his entire team killed around him, Khudadad Khan kept firing his gun single-handedly, holding back advancing German lines until reinforcements arrived. He became the first South Asian recipient of the <strong>Victoria Cross</strong>, Britain's highest award for military valor.</p>`
      },
      {
        stageIndex: 2,
        title: "Gallipoli, ANZAC Identity & The British West Indies Regiment",
        content: `<p class="prose-p">In April 1915, Allied forces launched an ambitious amphibious invasion of the Ottoman Gallipoli Peninsula, aiming to knock the Ottoman Empire out of the war and open maritime supply routes to Russia. Men of the Australian and New Zealand Army Corps (<strong>ANZAC</strong>) landed under merciless fire at <strong>Anzac Cove</strong>, pinned down on narrow beaches beneath steep cliffs by entrenched Turkish machine-gunners.</p><p class="prose-p">Although the Gallipoli campaign ended in costly defeat and evacuation, the legendary endurance, courage, and camaraderie displayed by ANZAC soldiers forged a powerful sense of independent national identity for both Australia and New Zealand.</p><p class="prose-p">Simultaneously, over 15,600 volunteers from the Caribbean formed the <strong>British West Indies Regiment (BWIR)</strong>. Despite enduring institutional racism from the War Office—which initially barred non-white colonial troops from European combat out of fear of undermining white prestige—BWIR battalions served with exceptional distinction handling artillery shells under bombardment in France, and fighting in the Sinai and Palestine campaigns.</p>`
      },
      {
        stageIndex: 3,
        title: "Sustaining the Frontlines: The Chinese Labour Corps & African Carriers",
        content: `<p class="prose-p">Behind the violent drama of the frontline trenches, millions of colonial workers performed the exhausting physical labour required to sustain modern industrial warfare. Beginning in 1916, the British government recruited roughly <strong>140,000 men for the Chinese Labour Corps (CLC)</strong>, alongside tens of thousands in the South African Native Labour Corps and Egyptian Labour Corps.</p><p class="prose-p">These unarmed labourers unloaded ammunition ships at French ports, constructed vital supply railways, dug communication trenches, and cleared unexploded artillery under enemy aerial bombardment. In East Africa, over one million African carriers were conscripted to transport heavy artillery and supplies across roadless jungles, enduring appalling disease rates that claimed over 100,000 lives.</p><p class="prose-p">Despite performing dangerous, indispensable service, non-white workers endured strict racial segregation. Chinese and African labourers were confined in barbed-wire compounds under armed military guard, denied leave, and forbidden from interacting with European civilians, treated as disposable colonial manpower by the imperial state.</p>`
      },
      {
        stageIndex: 4,
        title: "Post-War Injustice, Denied Pensions & Unmarked Graves",
        content: `<p class="prose-p">Following the 11 November 1918 Armistice, imperial gratitude evaporated into systemic racial injustice. In December 1918, men of the British West Indies Regiment stationed at Taranto, Italy, mutinied after being denied victory pay and ordered to perform degrading physical fatigues, including cleaning latrines for white soldiers. The revolt was ruthlessly suppressed, and the regiment was rapidly disbanded.</p><p class="prose-p">Even in death, colonial sacrifices were treated with deliberate inequality. The Imperial War Graves Commission, led by Sir Fabian Ware, adopted a discriminatory policy in Africa and the Middle East: while white British soldiers received individual engraved headstones, thousands of African and Asian soldiers and labourers were buried in anonymous mass pits or left uncommemorated.</p><p class="prose-p">Colonial veterans returned to home countries where promises of democratic self-government and equal military pensions were ignored. African and Caribbean soldiers were barred from participating in the 1919 London Victory Parade, whitewashing their decisive imperial contributions from British public memory for generations.</p>`
      }
    ]
  },

  // Lesson 4: The Home Front & Women’s Total War (1914–1918)
  {
    lessonIndex: 3,
    stages: [
      {
        stageIndex: 0,
        title: "DORA & The Rise of the Authoritarian State",
        content: `<p class="prose-p">Before 1914, Great Britain prided itself on being a liberal society characterized by minimal state intervention, free trade, and robust legal protections for individual liberties. The existential demands of total industrial warfare demolished this laissez-faire tradition almost overnight. On 8 August 1914, Parliament passed the <strong>Defence of the Realm Act (DORA)</strong> with virtually no debate, vesting the government with sweeping authoritarian powers.</p><p class="prose-p">Under DORA, the British state seized unprecedented control over everyday civilian life. Authorities were empowered to censor newspapers, ban anti-war publications, intercept private postal mail, arrest suspected saboteurs without trial, and commandeer privately owned land, railways, and factories for military production.</p><p class="prose-p">To maximise factory output and curb industrial absenteeism, DORA introduced blackouts, banned fireworks, made flying kites illegal, and restricted pub opening hours while watering down beer. British citizens quickly realized that defeating Prussian autocracy required Britain to construct an authoritarian regulatory apparatus of its own.</p>`
      },
      {
        stageIndex: 1,
        title: "The 1915 Shell Crisis & Industrial Mobilisation",
        content: `<p class="prose-p">By spring 1915, British offensives on the Western Front stalled due to a catastrophic munitions shortage known as the <strong>'Shell Crisis'</strong>. British artillery batteries were strictly rationed to just a handful of shells daily, leaving infantry defenseless against German bombardment. Newspaper revelations caused a national scandal that brought down Asquith's Liberal government, forcing the creation of a cross-party coalition.</p><p class="prose-p">Dynamic politician <strong>David Lloyd George</strong> was appointed head of the newly created Ministry of Munitions. Lloyd George acted ruthlessly, taking direct control over private armament factories, setting wages, commandeering raw metal supplies, and establishing national shell factories operated by the government.</p><p class="prose-p">Lloyd George negotiated the 'Treasury Agreements' with trade union leaders, suspending protective workplace rules and allowing <strong>'dilution'</strong>—the practice of breaking skilled craft jobs down into repetitive machine tasks performed by semi-skilled workers and women. This radical state intervention revolutionized British industrial capacity, multiplying munitions production tenfold and establishing state-managed wartime capitalism.</p>`
      },
      {
        stageIndex: 2,
        title: "Conscription, The Military Service Act & Conscientious Objectors",
        content: `<p class="prose-p">As the catastrophic casualty lists from Gallipoli, Loos, and Ypres mounted throughout 1915, voluntary recruitment slowed to a trickle. Reluctantly acknowledging that volunteerism could no longer replace the hundreds of thousands of men lost on the frontlines, Prime Minister Herbert Asquith introduced the <strong>Military Service Act</strong> in January 1916, ending Britain's centuries-old tradition of voluntary military service.</p><p class="prose-p">The act initially conscripted all single men aged 18 to 41, and was extended to married men four months later. While the vast majority complied, approximately 16,000 men claimed exemption as <strong>Conscientious Objectors (COs)</strong> on religious, moral, or political grounds.</p><p class="prose-p">COs faced hostile military tribunals composed of local civic elders who treated them with contempt. While some 'alternativists' agreed to perform non-combatant roles such as driving ambulances or farm work, roughly 1,500 'absolutists' refused all war-related service. These men endured brutal physical punishments, solitary confinement in damp prison cells, and harsh hard labor in penal camps like Dartmoor.</p>`
      },
      {
        stageIndex: 3,
        title: "Canary Girls & Female Industrial Mobilisation",
        content: `<p class="prose-p">The enlistment of millions of working-class men created a severe domestic labor crisis that forced the massive mobilization of women into the national workforce. Between 1914 and 1918, over one million British women entered employment, driving buses, policing streets, working on farms in the Women’s Land Army, and staffing heavy engineering and railway yards.</p><p class="prose-p">The most hazardous service was performed by approximately 700,000 female munitions workers, known affectionately as <strong>'munitionettes'</strong>. Handling highly volatile Cordite and TNT explosive powders stained their skin and hair bright yellow, earning them the iconic nickname <strong>'Canary Girls'</strong>.</p><p class="prose-p">These women labored twelve-hour shifts in toxic, unventilated factories, facing devastating risks of fatal TNT jaundice, respiratory failure, and catastrophic chemical explosions. In January 1917, an accidental blast at the Silvertown munitions factory in East London killed 73 people and flattened hundreds of homes. Women’s courageous industrial sacrifice permanently undermined sexist arguments against female suffrage, helping secure the vote for women over 30 in 1918.</p>`
      },
      {
        stageIndex: 4,
        title: "Unrestricted Submarine Warfare, Food Shortages & Rationing",
        content: `<p class="prose-p">By early 1917, Britain faced imminent starvation due to Germany's declaration of <strong>unrestricted submarine warfare</strong>. German U-boats sank hundreds of Allied merchant ships in the Atlantic, aiming to starve Britain into surrender before American troops arrived in Europe. By April 1917, submarine attacks had reduced Britain's national wheat reserves to a precarious <strong>six weeks of grain supplies</strong>.</p><p class="prose-p">Civilians experienced soaring food prices, hoarding, and exhausting queues outside grocery stores, where women waited hours for basic foodstuffs like potatoes, tea, and sugar. Malnutrition threatened working-class families and civil unrest simmered in industrial cities.</p><p class="prose-p">The government countered this existential threat through decisive state action. The Royal Navy introduced the armed convoy system, drastically reducing shipping losses, while the Board of Agriculture mobilized the Women's Land Army to plow pasture for crops. In early 1918, the government introduced <strong>compulsory national rationing</strong> for sugar, meat, and butter. Standardised ration books guaranteed fair civilian distribution, successfully preventing mass starvation until the war's conclusion.</p>`
      }
    ]
  },

  // Lesson 5: The Treaty of Versailles & The Flawed Peace (1918–1919)
  {
    lessonIndex: 4,
    stages: [
      {
        stageIndex: 0,
        title: "The German Collapse, Mutiny & The 11 November Armistice",
        content: `<p class="prose-p">By autumn 1918, the German war machine was broken. The relentless Royal Navy naval blockade had starved German cities of food and industrial chemicals, causing severe malnutrition and over 400,000 civilian deaths. On the Western Front, the Allied Hundred Days Offensive—driven by fresh American manpower and British combined-arms tank warfare—smashed through Germany’s formidable Hindenburg Line.</p><p class="prose-p">In late October 1918, sailors of the German High Seas Fleet at <strong>Kiel mutinied</strong>, refusing suicidal orders to sail into a final battle against the Royal Navy. The mutiny ignited a nationwide socialist revolution that swept across German industrial cities. Realising military victory was impossible, army commanders informed <strong>Kaiser Wilhelm II</strong> that he had lost the military's support; on 9 November, the Kaiser abdicated and fled to exile in the Netherlands.</p><p class="prose-p">Two days later, at 11:00 am on <strong>11 November 1918</strong>, representatives of the newly proclaimed German Republic signed the Armistice in a railway carriage at Compiègne, ending four years of catastrophic bloodshed.</p>`
      },
      {
        stageIndex: 1,
        title: "The Paris Peace Conference & The Big Three Agendas",
        content: `<p class="prose-p">In January 1919, leaders from over thirty nations convened at the Palace of Versailles to negotiate a post-war settlement. However, proceedings were dominated by the <strong>'Big Three'</strong>: American President Woodrow Wilson, French Premier Georges Clemenceau, and British Prime Minister David Lloyd George, each pursuing fundamentally irreconcilable national agendas.</p><p class="prose-p"><strong>Woodrow Wilson</strong> arrived as an idealistic reformer championing his 'Fourteen Points', advocating national self-determination for European peoples, disarmament, and the creation of an international League of Nations to resolve disputes without bloodshed. In stark contrast, <strong>Georges Clemenceau</strong>—whose nation had suffered 1.4 million military deaths and widespread northern devastation—demanded severe vengeance, crippling financial reparations, and the permanent military dismemberment of Germany to ensure France's future security.</p><p class="prose-p"><strong>David Lloyd George</strong> occupied a pragmatic middle position. While pressured by a vindictive British public to 'squeeze Germany until the pips squeak', Lloyd George privately feared that destroying Germany would eliminate a vital trading partner and leave Central Europe vulnerable to Bolshevik revolution.</p>`
      },
      {
        stageIndex: 2,
        title: "The Terms of Versailles & The German \"Diktat\" Trauma",
        content: `<p class="prose-p">Signed on 28 June 1919 in the Hall of Mirrors, the Treaty of Versailles imposed deeply punitive terms on the defeated German Republic. Under <strong>Article 231</strong>—the controversial 'War Guilt Clause'—Germany was forced to accept sole moral and legal responsibility for causing the war. This clause provided the legal justification for astronomical financial reparations, ultimately fixed in 1921 at <strong>£6.6 billion</strong>.</p><p class="prose-p">Territorially, Germany was stripped of thirteen percent of its European land, losing Alsace-Lorraine to France, Eupen-Malmedy to Belgium, and the Polish Corridor to Poland, severing East Prussia from the German mainland. Germany also lost all its overseas colonies.</p><p class="prose-p">Militarily, Germany was virtually disarmed: its army was capped at <strong>100,000 volunteers</strong>, conscription was abolished, tanks and combat aircraft were banned, the navy was limited to six obsolete battleships, and the Rhineland was permanently demilitarised. German delegates signed under threat of immediate Allied invasion, and the public furiously condemned the settlement as a humiliating, non-negotiable <strong>'Diktat'</strong>.</p>`
      },
      {
        stageIndex: 3,
        title: "Keynes’ Carthaginian Peace & Will Dyson’s Prophetic Cartoon",
        content: `<p class="prose-p">Contemporaries immediately recognized the perilous instability embedded in the Versailles settlement. British Treasury representative <strong>John Maynard Keynes</strong> resigned in protest from the Paris delegation, publishing his explosive critique <em>The Economic Consequences of the Peace</em> in late 1919. Keynes warned that extracting impossible financial reparations would destroy Germany’s industrial economy, impoverishing Central Europe and fostering dangerous political extremism and desires for revenge.</p><p class="prose-p">Keynes denounced the punitive treaty as a <strong>'Carthaginian Peace'</strong>, arguing that a prosperous, democratic Germany was essential for European continental stability and economic recovery.</p><p class="prose-p">Simultaneously, Australian political cartoonist <strong>Will Dyson</strong> published a remarkably prescient drawing in the <em>Daily Herald</em> entitled 'Peace and Future Cannon Fodder'. The cartoon depicted the Big Three leaving the Versailles hall, with Clemenceau remarking: 'Curious! I seem to hear a child weeping!' In the corner, a naked child wept beneath the label <strong>'1940 Class'</strong>—chillingly prophesying that the punitive treaty would lead inexorably to a second world war by 1940.</p>`
      },
      {
        stageIndex: 4,
        title: "The Historical Verdict: Harsh Vengeance or Unenforced Compromise?",
        content: `<p class="prose-p">For decades following 1919, historians and popular opinion blamed the Treaty of Versailles directly for the collapse of the democratic Weimar Republic and the catastrophic rise of Adolf Hitler. Critics argued that the treaty was fundamentally flawed: harsh enough to infuriate German national pride, yet too lenient to permanently suppress German military and industrial resurgence. Nazi propaganda relentlessly exploited public bitterness over the 'November criminals' and the 'stab in the back'.</p><p class="prose-p">However, modern revisionist historians offer a more nuanced verdict. They emphasize that despite territorial losses, Germany’s industrial core, demographic weight, and territorial integrity remained largely intact, leaving it potentially the dominant economic power on the continent.</p><p class="prose-p">Historians like Margaret MacMillan argue that the fatal flaw of Versailles lay not in its inherent terms, but in the Allied powers' rapid loss of political willpower to enforce them during the 1920s and 1930s, allowing aggressive German remilitarisation to proceed unchecked until war returned.</p>`
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

// 1. Update data/great_war_part2.json and public/data/great_war_part2.json
['data/great_war_part2.json', 'public/data/great_war_part2.json'].forEach(relPath => {
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
    if (json.great_war_part2 && applyEnrichment(json.great_war_part2)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (great_war_part2)`);
    }
  }
});

// 3. Update units/great_war_part2/data.js and public/units/great_war_part2/data.js
['units/great_war_part2/data.js', 'public/units/great_war_part2/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const jsonMatch = content.match(/window\.\w+\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (jsonMatch) {
      try {
        const unitObj = JSON.parse(jsonMatch[1]);
        if (applyEnrichment(unitObj)) {
          const prefix = content.slice(0, content.indexOf(jsonMatch[1]));
          fs.writeFileSync(p, `${prefix}${JSON.stringify(unitObj, null, 2)};\n`, 'utf8');
          console.log(`Updated ${relPath}`);
        }
      } catch (e) {
        console.error(`Error parsing ${relPath}:`, e.message);
      }
    }
  }
});

console.log('Enrichment completed successfully across all stores!');

