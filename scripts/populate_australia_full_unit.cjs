const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'units', 'australia', 'data.js');

// Rich Stage Data for Lessons 2 to 5
const lessonData = {
  2: [
    {
      step: 1,
      words: [
        { term: "Loss of American Colonies", clue: "Britain could no longer transport 1,000 convicts yearly to Virginia after losing the War of Independence in 1783." },
        { term: "Rotting Thames Hulks", clue: "Decommissioned wooden warships moored in the River Thames used as squalid temporary floating prisons." },
        { term: "Typhus & Overcrowding", clue: "'Gaol fever' and dysentery ravaged thousands of prisoners packed in darkness below deck, killing nearly 30%." }
      ],
      model_sentence: "Following the <strong>loss of American colonies</strong>, British prisons overflowed into <strong>rotting Thames hulks</strong> where fatal <strong>typhus & overcrowding</strong> forced the government to establish an Australian penal colony."
    },
    {
      step: 2,
      words: [
        { term: "11 Sailing Ships", clue: "Six convict transports, three store ships, and two naval escort warships carrying over 1,400 people." },
        { term: "750 Convicts & 250 Marines", clue: "Convict men, women, children, and military marine guards forming the founding population of colonial Australia." },
        { term: "15,000 Miles via Cape Town", clue: "An epic eight-month voyage via Tenerife, Rio, and Cape Town with remarkably low mortality under Captain Phillip." }
      ],
      model_sentence: "Commanding <strong>11 sailing ships</strong> carrying <strong>750 convicts & 250 marines</strong>, Captain Arthur Phillip navigated <strong>15,000 miles via Cape Town</strong> to reach Botany Bay."
    },
    {
      step: 3,
      words: [
        { term: "Unprotected Botany Bay", clue: "Open, shallow bay with shifting sand dunes and poor drinking water, making it unsuitable for a town." },
        { term: "Port Jackson Deep Water", clue: "A sheltered natural harbour described by Phillip as the finest in the world, capable of anchoring 1,000 ships." },
        { term: "Fresh Water Stream", clue: "The Tank Stream flowing into Sydney Cove, providing pure drinking water and sandstone building stone." }
      ],
      model_sentence: "Rejecting <strong>unprotected Botany Bay</strong>, Phillip discovered <strong>Port Jackson deep water</strong> and founded Sydney Cove beside a clean <strong>fresh water stream</strong>."
    },
    {
      step: 4,
      words: [
        { term: "Sandy Unproductive Soil", clue: "Poor coastal soil near Sydney Cove where European wheat crops withered and failed to take root." },
        { term: "Broken Farming Hoes", clue: "Flimsy British iron tools that snapped on hard Australian eucalyptus roots, with no horses or cattle to plow." },
        { term: "Shipwreck of HMS Guardian", clue: "Vital Royal Navy supply ship carrying two years of food and livestock struck an iceberg off South Africa in 1789." }
      ],
      model_sentence: "Beset by <strong>sandy unproductive soil</strong> and <strong>broken farming hoes</strong>, the colony faced starvation when the <strong>shipwreck of HMS Guardian</strong> destroyed vital food supplies."
    },
    {
      step: 5,
      words: [
        { term: "Dawn-to-Dusk Labour", clue: "Convicts worked grueling 12-hour shifts clearing bush, quarrying sandstone, and erecting government buildings." },
        { term: "Cat-o'-Nine-Tails Lash", clue: "Brutal public flogging of up to 100 lashes inflicted by the military for disobedience, insolence, or theft." },
        { term: "30-Acre Land Grants", clue: "Phillip rewarded reformed convicts who served their sentences with free farmland, creating the 'emancipist' class." }
      ],
      model_sentence: "While convicts endured <strong>dawn-to-dusk labour</strong> under threat of the <strong>cat-o'-nine-tails lash</strong>, exemplary conduct was rewarded with <strong>30-acre land grants</strong> as free emancipists."
    }
  ],
  3: [
    {
      step: 1,
      words: [
        { term: "250 Language Nations", clue: "Over 250 distinct sovereign language nations and 750 dialects inhabiting Australia for over 65,000 years." },
        { term: "Fire-Stick Farming", clue: "Systematic, controlled burning to clear undergrowth, prevent wildfires, and regenerate native grasses for game animals." },
        { term: "Songlines & Custodianship", clue: "Spiritual navigation tracks and customary legal codes connecting clans to ancestral Dreaming territories." }
      ],
      model_sentence: "Across <strong>250 language nations</strong>, First Nations peoples practiced <strong>fire-stick farming</strong> and preserved <strong>songlines & custodianship</strong> without destructive exploitation."
    },
    {
      step: 2,
      words: [
        { term: "Gal-galla Smallpox", clue: "Catastrophic 1789 epidemic ('gal-galla') causing pustules, delirium, and sudden death among Sydney clans." },
        { term: "50–70% Eora Mortality", clue: "Over half of the Indigenous population around Sydney died in months, leaving shores littered with unburied dead." },
        { term: "Loss of Elders & Law", clue: "The sudden death of elders, healers, and storytellers shattered traditional kinship networks and knowledge systems." }
      ],
      model_sentence: "The outbreak of <strong>gal-galla smallpox</strong> caused <strong>50–70% Eora mortality</strong>, inflicting a catastrophic <strong>loss of elders & law</strong> on Indigenous society."
    },
    {
      step: 3,
      words: [
        { term: "Kidnapped by Marines", clue: "Bennelong was captured at Manly Cove in 1789 on Governor Phillip's orders to serve as a cultural go-between." },
        { term: "London Voyage 1793", clue: "Bennelong sailed to England with Phillip, meeting King George III and visiting Covent Garden Theatre." },
        { term: "Trapped Between Two Worlds", clue: "Returning to Sydney in European clothing, Bennelong was rejected by settlers and alienated from traditional Eora kin." }
      ],
      model_sentence: "First <strong>kidnapped by marines</strong> and taken on a <strong>London voyage 1793</strong>, Bennelong lived tragically <strong>trapped between two worlds</strong> upon his return."
    },
    {
      step: 4,
      words: [
        { term: "Bidjigal Clan Leader", clue: "Pemulwuy, a revered 'carradhy' (healer and holy man) of the Bidjigal nation who led resistance across Sydney." },
        { term: "Burning Settler Farms", clue: "Pemulwuy led coordinated guerrilla raids, burning settler maize fields, destroying huts, and driving off cattle." },
        { term: "Battle of Parramatta (1797)", clue: "Pemulwuy led 100 warriors directly into Parramatta township, surviving seven buckshot wounds to his head and body." }
      ],
      model_sentence: "As a defiant <strong>Bidjigal clan leader</strong>, Pemulwuy orchestrated <strong>burning settler farms</strong> and commanded warriors at the <strong>Battle of Parramatta (1797)</strong>."
    },
    {
      step: 5,
      words: [
        { term: "Fertile Farming Invasions", clue: "British farms expanded along the Hawkesbury River, clearing sacred yam beds and cutting off native food supplies." },
        { term: "Shoot on Sight Orders", clue: "Governor King issued an official proclamation outlawing Pemulwuy and authorizing soldiers to shoot armed Aborigines." },
        { term: "Death of Pemulwuy (1802)", clue: "Pemulwuy was shot dead in an ambush in 1802; his severed head was sent in a jar of spirits to Sir Joseph Banks in London." }
      ],
      model_sentence: "Triggered by <strong>fertile farming invasions</strong>, Governor King enacted <strong>shoot on sight orders</strong> until the tragic <strong>death of Pemulwuy (1802)</strong>."
    }
  ],
  4: [
    {
      step: 1,
      words: [
        { term: "Secondary Penal Colony", clue: "British outpost established at Risdon Cove in 1803 to hold worst-behaved convicts and deter French rival ships." },
        { term: "Risdon Cove Cannon Fire", clue: "Soldiers fired carronade grapeshot into a peaceful Palawa kangaroo hunting party in May 1804, killing dozens." },
        { term: "Palawa Hunting Grounds", clue: "Settlers seized fertile river valleys, slaughtering native wildlife and cutting off seasonal Palawa migrations." }
      ],
      model_sentence: "The founding of a <strong>secondary penal colony</strong> led directly to <strong>Risdon Cove cannon fire</strong> and violent seizures of <strong>Palawa hunting grounds</strong>."
    },
    {
      step: 2,
      words: [
        { term: "Governor Arthur Martial Law", clue: "Governor Arthur declared martial law in 1828, giving soldiers and vigilante parties immunity to kill Aborigines." },
        { term: "2,200 Armed Men", clue: "Over 2,200 soldiers, convicts, and settlers mobilized in 1830 in the most expensive military campaign in Tasmanian history." },
        { term: "The Black Line Sweeps", clue: "A human chain advancing across Tasmania for seven weeks; cost £30,000 and captured only two Palawa people." }
      ],
      model_sentence: "Under <strong>Governor Arthur martial law</strong>, an army of <strong>2,200 armed men</strong> staged <strong>the Black Line sweeps</strong> across the island of Van Diemen's Land."
    },
    {
      step: 3,
      words: [
        { term: "Truganini Peacemaking", clue: "Truganini, a Nuenonne woman, accompanied Robinson on his 'Friendly Mission', negotiating Palawa surrender to avoid extinction." },
        { term: "200 Exiled to Flinders", clue: "Around 200 surviving Palawa were exiled to the windswept Wybalenna settlement on Flinders Island under false promises." },
        { term: "Wybalenna Camp Sickness", clue: "Appalling conditions, enforced Christian European dress, poor water, and influenza killed over 150 exiled Palawa." }
      ],
      model_sentence: "Despite <strong>Truganini peacemaking</strong>, approximately <strong>200 exiled to Flinders</strong> perished from despair and <strong>Wybalenna camp sickness</strong>."
    },
    {
      step: 4,
      words: [
        { term: "Merino Sheep Flocks", clue: "Millions of Spanish Merino sheep introduced to produce fine wool for British textile mills in Yorkshire." },
        { term: "Yorkshire Wool Demand", clue: "Industrial factories in Leeds and Bradford created enormous fortunes for squatter pastoralists seizing interior lands." },
        { term: "Seizing Native Waterholes", clue: "Squatters fenced off billabongs and rivers, denying water to First Nations clans and shooting native hunters." }
      ],
      model_sentence: "Explosive growth of <strong>Merino sheep flocks</strong> driven by <strong>Yorkshire wool demand</strong> resulted in squatters <strong>seizing native waterholes</strong> across the interior."
    },
    {
      step: 5,
      words: [
        { term: "28 Wirrayaraay Murdered", clue: "A gang of eleven armed stockmen tied up and hacked to death 28 unarmed Wirrayaraay women, children, and elders in 1838." },
        { term: "7 White Stockmen Hanged", clue: "In an unprecedented trial, Governor Gipps insisted on justice; seven stockmen were convicted and publicly executed." },
        { term: "Squatter Outrage & Secrecy", clue: "Wealthy landowners were furious that whites were punished for killing natives; frontier massacres were driven underground into silence." }
      ],
      model_sentence: "After <strong>28 Wirrayaraay murdered</strong> at Myall Creek, <strong>7 white stockmen hanged</strong> in a landmark verdict that caused <strong>squatter outrage & secrecy</strong>."
    }
  ],
  5: [
    {
      step: 1,
      words: [
        { term: "Hargraves 1851 Discovery", clue: "Edward Hargraves announced payable gold at Summerhill Creek near Bathurst in May 1851, sparking the gold rush." },
        { term: "Population Triples to 1.2m", clue: "Over 600,000 immigrants from Britain, Europe, America, and China flooded into Victoria and New South Wales within a decade." },
        { term: "Melbourne Victorian Wealth", clue: "Gold profits built grand Victorian banks, wide boulevards, universities, and theaters, creating 'Marvellous Melbourne'." }
      ],
      model_sentence: "Following the <strong>Hargraves 1851 discovery</strong>, the Australian <strong>population triples to 1.2m</strong> and fueled immense <strong>Melbourne Victorian wealth</strong>."
    },
    {
      step: 2,
      words: [
        { term: "30-Shilling Monthly Fee", clue: "Hefty licence fee demanded from every digger regardless of whether they found any gold, enforced by police." },
        { term: "Armed Police Digger Hunts", clue: "Corrupt ex-convict police staged brutal twice-weekly 'digger hunts', arresting miners unable to show paper licences." },
        { term: "Taxation Without Representation", clue: "Diggers had no vote and no representatives in the Victorian legislative council, sparking outrage and mass meetings." }
      ],
      model_sentence: "Angered by the <strong>30-shilling monthly fee</strong> and humiliating <strong>armed police digger hunts</strong>, miners rebelled against <strong>taxation without representation</strong>."
    },
    {
      step: 3,
      words: [
        { term: "Southern Cross Flag", clue: "Miners unfurled the revolutionary blue flag bearing the Southern Cross stars, swearing an oath to defend their liberties." },
        { term: "15-Minute Dawn Assault", clue: "On 3 December 1854, 276 British soldiers and police attacked the Eureka Stockade at dawn, killing 22 miners." },
        { term: "Secret Ballot & Universal Suffrage", clue: "Public outrage forced democratic reform: licences were abolished, and Victoria introduced universal male suffrage and the secret ballot." }
      ],
      model_sentence: "Unfurling the <strong>Southern Cross flag</strong>, miners fought a bloody <strong>15-minute dawn assault</strong> that catalyzed <strong>secret ballot & universal suffrage</strong> across Australia."
    },
    {
      step: 4,
      words: [
        { term: "40,000 Chinese Diggers", clue: "Over 40,000 Chinese miners arrived in Victoria, working cooperatively and reprocessing abandoned claims with great success." },
        { term: "Lambing Flat Riots (1861)", clue: "A mob of 3,000 European miners violently attacked Chinese diggers, burning camps and driving them off the goldfield." },
        { term: "1901 Immigration Restriction Act", clue: "The newly federated Commonwealth enacted the 'White Australia Policy', imposing a rigged 50-word European dictation test." }
      ],
      model_sentence: "Hostility toward <strong>40,000 Chinese diggers</strong> erupted in the <strong>Lambing Flat Riots (1861)</strong>, leading directly to the <strong>1901 Immigration Restriction Act</strong>."
    },
    {
      step: 5,
      words: [
        { term: "1938 Day of Mourning", clue: "First Nations leaders organized a protest conference on the 150th anniversary of colonization, demanding citizenship and equality." },
        { term: "Stolen Generations Truth", clue: "Official government policies removed over 100,000 Indigenous children from their families for assimilation into white society." },
        { term: "1992 Mabo Overturns Terra Nullius", clue: "The High Court of Australia ruled in favor of Eddie Mabo, legally acknowledging that Indigenous native title survived British colonization." }
      ],
      model_sentence: "Beginning with the <strong>1938 Day of Mourning</strong> and confronting <strong>Stolen Generations truth</strong>, the historic <strong>1992 Mabo overturns terra nullius</strong> established native title."
    }
  ]
};

(async () => {
  try {
    const fileUrl = 'file:///' + dataFile.replace(/\\/g, '/');
    const mod = await import(fileUrl);
    const ausData = mod.default || mod;

    if (!ausData || !ausData.lessons) {
      throw new Error('Failed to load ausData');
    }

    // Update lessons 2 to 5
    for (let lNum = 2; lNum <= 5; lNum++) {
      const lIdx = lNum - 1;
      const stages = lessonData[lNum];
      if (!stages) continue;

      ausData.lessons[lIdx].workbook_stages.forEach((stg, sIdx) => {
        const enrich = stages[sIdx];
        if (enrich) {
          stg.words = enrich.words;
          stg.model_sentence = enrich.model_sentence;
          stg.modelSentence = enrich.model_sentence;
        }
      });

      if (lNum === 2) {
        ausData.lessons[lIdx].narrative_blocks[3].image = "/images/sydney_cove_1792.jpg";
        ausData.lessons[lIdx].narrative_blocks[3].caption = "Sydney Cove in 1792: Depicting the struggling early encampment, storehouses, and convict huts during the starvation years (National Library of Australia).";
      }
    }

    const output = `export default ${JSON.stringify(ausData, null, 2)};\n`;
    fs.writeFileSync(dataFile, output, 'utf8');
    console.log('✅ Successfully updated units/australia/data.js with full words and model sentences for Lessons 2–5!');

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
