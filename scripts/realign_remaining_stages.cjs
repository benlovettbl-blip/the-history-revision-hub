const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function syncUnitToAllLayers(unitId, updateFn) {
  // 1. data/<unitId>.json
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const publicDataPath = path.join(ROOT, 'public', 'data', `${unitId}.json`);
  let unitData = null;

  if (fs.existsSync(dataPath)) {
    unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    updateFn(unitData);
    fs.writeFileSync(dataPath, JSON.stringify(unitData, null, 2), 'utf8');
    console.log(`✅ Updated data/${unitId}.json`);
  }

  if (fs.existsSync(publicDataPath)) {
    const pubData = JSON.parse(fs.readFileSync(publicDataPath, 'utf8'));
    updateFn(pubData);
    fs.writeFileSync(publicDataPath, JSON.stringify(pubData, null, 2), 'utf8');
    console.log(`✅ Updated public/data/${unitId}.json`);
  }

  // 2. database.json & public/database.json
  ['database.json', 'public/database.json'].forEach(rel => {
    const fp = path.join(ROOT, rel);
    if (fs.existsSync(fp)) {
      const db = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const target = db.units ? db.units[unitId] : db[unitId];
      if (target) {
        updateFn(target);
        fs.writeFileSync(fp, JSON.stringify(db, null, 2), 'utf8');
        console.log(`✅ Updated ${rel} [${unitId}]`);
      }
    }
  });

  // 3. units/<unitId>/data.js
  const unitsDataJs = path.join(ROOT, 'units', unitId, 'data.js');
  if (fs.existsSync(unitsDataJs) && unitData) {
    fs.writeFileSync(unitsDataJs, 'export default ' + JSON.stringify(unitData, null, 2) + ';\n', 'utf8');
    console.log(`✅ Updated units/${unitId}/data.js`);
  }
}

// -------------------------------------------------------------
// 1. Medieval England Lesson 3 & 5
// -------------------------------------------------------------
syncUnitToAllLayers('medieval_england', (u) => {
  // Lesson 3: Crown vs Church (Becket)
  const l3 = u.lessons.find(l => l.id === 'lesson_3');
  if (l3) {
    l3.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[3.1]",
        title: "Worldly Chancellor to Archbishop (1154–1162)",
        text: "<span class=\"para-ref\">[3.1]</span> In 1154, the energetic young King Henry II appointed his close drinking companion and brilliant courtier Thomas Becket as Chancellor of England. Becket lived as the <strong>King’s Hunting Friend</strong>, reveling in luxury with <strong>Silk Robes and Feasting</strong>, and executing royal policy ruthlessly. When Archbishop Theobald died in 1161, Henry devised an audacious strategy: by appointing Becket as Archbishop of Canterbury, he believed he had secured an unquestioning royal pawn who would fuse church and crown authority, <strong>Hoping for an Easy Puppet</strong>.",
        image: "/images/henry_ii_and_thomas_becket_court.jpg",
        image_alt: "Henry II and Thomas Becket at Court",
        caption: "Henry II with his Chancellor Thomas Becket before their bitter ideological falling out.",
        theme_heading: "Royal Patronage & Ambition",
        sources: [
          {
            id: "source_3_1",
            title: "Henry II Appoints Becket",
            url: "/images/henry_ii_and_thomas_becket_court.jpg",
            caption: "Henry II believed appointing his secular friend Thomas Becket would unify church and state under royal control."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[3.2]",
        title: "Becket’s Metamorphosis & Spiritual Allegiance (1162)",
        text: "<span class=\"para-ref\">[3.2]</span> The moment Becket was consecrated Archbishop in June 1162, he underwent an astonishing personal and spiritual transformation. Becket immediately resigned the Chancellorship, <strong>Throws Off Silk Robes</strong> of worldly power, and adopted a life of severe monastic asceticism, wearing a <strong>Scratchy Goat Hairshirt</strong> infested with lice beneath his vestments and washing the feet of thirteen paupers daily. Becket declared himself <strong>Loyal Only to the Pope</strong> and the universal Catholic Church, setting up an unavoidable collision course with the Crown.",
        image: "/images/becket_monastic_transformation.jpg",
        image_alt: "Thomas Becket Monastic Metamorphosis",
        caption: "Thomas Becket adopting ascetic robes and dedicating himself entirely to the sovereignty of the Church.",
        theme_heading: "Spiritual Metamorphosis",
        sources: [
          {
            id: "source_3_2",
            title: "Becket's Renunciation",
            url: "/images/becket_monastic_transformation.jpg",
            caption: "Becket discarded worldly court luxury to champion clerical independence against royal supremacy."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[3.3]",
        title: "The Constitutions of Clarendon & ‘Criminous Clerks’ (1164)",
        text: "<span class=\"para-ref\">[3.3]</span> The flashpoint between King and Archbishop was the legal scandal of 'criminous clerks'. Anyone who could read a Latin psalm claimed 'benefit of clergy', meaning corrupt <strong>Priests Escaping Punishment</strong> for robbery, rape, and murder faced lenient church courts instead of royal gallows by simply <strong>Reading a Latin Verse</strong>. Henry summoned the barons and bishops to Clarendon in January 1164, issuing the Constitutions of Clarendon where the <strong>King Demands Royal Trials</strong> and punishment for defrocked priests. Becket furiously refused to seal the document.",
        image: "/images/constitutions_of_clarendon_1164.jpg",
        image_alt: "The Council of Clarendon 1164",
        caption: "King Henry II demanding his bishops accept the Constitutions of Clarendon.",
        theme_heading: "Jurisdiction & Royal Law",
        sources: [
          {
            id: "source_3_3",
            title: "The Clarendon Confrontation",
            url: "/images/constitutions_of_clarendon_1164.jpg",
            caption: "The Constitutions of Clarendon attempted to subject the clergy to the jurisdiction of the King’s courts."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[3.4]",
        title: "Murder in Canterbury Cathedral (1170)",
        text: "<span class=\"para-ref\">[3.4]</span> Following six years of bitter exile in France, Becket returned to Canterbury in December 1170 and immediately excommunicated bishops who supported Henry. When news reached Normandy at Christmas, the <strong>King Shouts in Fury</strong>: <em>'What miserable drones have I nourished that allow their lord to be treated with such contempt?'</em> Hearing this, <strong>Four Knights Gallop Away</strong> across the icy Channel, bursting into Canterbury Cathedral at dusk on 29 December 1170. When Becket refused to yield, their <strong>Swords Smashed at the Altar</strong>, severing his skull and spraying his brains across the stones.",
        image: "/images/murder_of_thomas_becket_cathedral_1170.jpg",
        image_alt: "The Murder of Thomas Becket in Canterbury Cathedral",
        caption: "Four Norman knights assassinating Archbishop Thomas Becket at the altar of Canterbury Cathedral on 29 December 1170.",
        theme_heading: "Royal Rage & Sacrilege",
        sources: [
          {
            id: "source_3_4",
            title: "Eyewitness Edward Grim on the Murder",
            url: "/images/murder_of_thomas_becket_cathedral_1170.jpg",
            caption: "Clerk Edward Grim held Becket as the knights’ swords shattered his skull on the cathedral flagstones."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[3.5]",
        title: "Barefoot Royal Penance & Papal Compromise (1174)",
        text: "<span class=\"para-ref\">[3.5]</span> Becket’s brutal assassination horrified Christian Europe. Pope Alexander III canonised him as a martyr within three years, and pilgrims flooded Canterbury seeking miraculous cures after sensational reports of <strong>Miracles at the Tomb</strong>. Facing papal interdict, rebellions, and personal torment, Henry performed abject penance in July 1174: he walked barefoot through Canterbury’s streets and knelt before Becket’s shrine, suffering public <strong>Whipping with Birch Rods</strong> by eighty monks. In the eventual compromise, <strong>Church Courts Kept Intact</strong> their privileges, preserving clerical immunity for centuries.",
        image: "/images/henry_ii_penance_canterbury.jpg",
        image_alt: "Henry II Barefoot Penance at Canterbury",
        caption: "King Henry II submitting to scourging by monks at Becket’s tomb in July 1174.",
        theme_heading: "Martyrdom & Royal Humiliation",
        sources: [
          {
            id: "source_3_5",
            title: "Henry's Barefoot Penance",
            url: "/images/henry_ii_penance_canterbury.jpg",
            caption: "Henry II submitted to public scourging to appease the Church and restore divine favor to his crown."
          }
        ]
      }
    ];
    console.log('  aligned medieval_england lesson 3');
  }

  // Lesson 5: Black Death & Peasants' Revolt
  const l5 = u.lessons.find(l => l.id === 'lesson_5');
  if (l5) {
    l5.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[5.1]",
        title: "Arrival of the Plague at Melcombe Regis (1348)",
        text: "<span class=\"para-ref\">[5.1]</span> In June 1348, the Black Death landed on English shores when a <strong>Sailor Ship at Weymouth</strong> (Melcombe Regis) carried plague-carrying fleas from Gascony. The pandemic spread with terrifying speed. Victims developed agonizing egg-sized black swelling <strong>Buboes Under the Arms</strong> and in the groin, spat dark blood, and suffered acute fever, perishing within three to five days. By 1350, with <strong>Nearly Half the Country Dead</strong>, entire villages lay deserted, churchyards overflowed into mass trenches, and medieval society stood shattered.",
        image: "/images/black_death_burial_trenches_1348.jpg",
        image_alt: "Black Death Mass Burials",
        caption: "Contemporary illustration of mass burials during the catastrophic Black Death of 1348–1350.",
        theme_heading: "Demographic Catastrophe",
        sources: [
          {
            id: "source_5_1",
            title: "Plague Chronicle of Rochester",
            url: "/images/black_death_burial_trenches_1348.jpg",
            caption: "Contemporary accounts recorded that nearly half the population perished as corpses rotted unburied in deserted villages."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[5.2]",
        title: "Labour Shortage & The Economic Revolution (1349–1351)",
        text: "<span class=\"para-ref\">[5.2]</span> The catastrophic population collapse triggered a sudden economic revolution. Across England, silence hung over <strong>Empty Village Cottages</strong> and fields lay unharvested with unploughed <strong>Wheat Rotting on the Ground</strong>. For the first time in feudal history, surviving agricultural labourers held economic bargaining power: with lords desperate for hands, peasants began <strong>Workers Demanding Double Pay</strong> and refused to perform traditional unpaid feudal bondage, breaking their customary ties to manors.",
        image: "/images/peasants_working_land_medieval.jpg",
        image_alt: "Medieval Agricultural Labourers",
        caption: "Peasant labourers reaping wheat; after 1348, surviving workers demanded dramatically higher cash wages.",
        theme_heading: "Socio-Economic Upheaval",
        sources: [
          {
            id: "source_5_2",
            title: "Manorial Court Rolls (1350)",
            url: "/images/peasants_working_land_medieval.jpg",
            caption: "Manorial records show landlords forced to pay cash bonuses to prevent vital harvest crops from rotting in the fields."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[5.3]",
        title: "The Statute of Labourers & Sumptuary Resistance (1351–1363)",
        text: "<span class=\"para-ref\">[5.3]</span> Outraged by rising wages and loss of feudal control, the landowner-dominated Parliament struck back. The 1351 Statute of Labourers decreed that <strong>Wages Frozen by Lords</strong> must remain at pre-plague 1346 levels. Runaway serfs faced imprisonment and having an <strong>Iron \"F\" Burned on Foreheads</strong> for falsity. Furthermore, 1363 Sumptuary Laws dictated social dress, ensuring commoners were <strong>Banned from Wearing Fur</strong> or fine dyed wool, fueling three decades of festering class anger.",
        image: "/images/statute_of_labourers_manuscript.jpg",
        image_alt: "Statute of Labourers 1351",
        caption: "The parliamentary statute attempting to freeze peasant wages and enforce feudal servitude.",
        theme_heading: "Feudal Retaliation & Repression",
        sources: [
          {
            id: "source_5_3",
            title: "Statute of Labourers (1351)",
            url: "/images/statute_of_labourers_manuscript.jpg",
            caption: "Parliament attempted to enforce medieval serfdom by penalizing labourers who demanded market wages."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[5.4]",
        title: "The Regressive Poll Taxes & Brentwood Spark (1377–1381)",
        text: "<span class=\"para-ref\">[5.4]</span> Simmering tensions erupted when the royal government faced bankruptcy from the costly Hundred Years’ War, passing a crippling <strong>French War Debt Bill</strong>. Unlike property taxes, the third Poll Tax of 1381 demanded a flat <strong>Twelve Pence from Every Head</strong> aged over fifteen—equivalent to two weeks' hard wages for a labourer. Mass tax evasion followed, and when royal commissioner John Bampton arrived on 30 May 1381, he was a <strong>Tax Collector Chased with Pitchforks</strong> by furious Essex villagers at Brentwood, igniting armed rebellion.",
        image: "/images/peasants_revolt_brentwood_spark.jpg",
        image_alt: "The Spark at Brentwood 1381",
        caption: "Villagers in Essex driving out royal tax commissioners, sparking the Peasants’ Revolt of 1381.",
        theme_heading: "Fiscal Oppression & Revolt",
        sources: [
          {
            id: "source_5_4",
            title: "The Brentwood Uprising",
            url: "/images/peasants_revolt_brentwood_spark.jpg",
            caption: "Refusal to pay the 1381 Poll Tax triggered open armed defiance across southeast England."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[5.5]",
        title: "Showdown at Smithfield & The End of Serfdom (1381)",
        text: "<span class=\"para-ref\">[5.5]</span> Under leaders Wat Tyler and radical priest John Ball, over 30,000 <strong>Peasants Swarm the Capital</strong>, burning tax rolls and storming the Tower of London. On 15 June 1381, fourteen-year-old King Richard II met the rebels at Smithfield. Tensions flared and <strong>Tyler Stabbed at the Peace Talks</strong> by the Mayor of London. With bows drawn, the bold <strong>Boy King Promises Freedom</strong>, declaring himself their leader and pledging to abolish serfdom. Though the revolt was brutally crushed, feudal bondage was terminally undermined and withered away over the next century.",
        image: "/images/richard_ii_smithfield_wat_tyler.jpg",
        image_alt: "Richard II and Wat Tyler at Smithfield",
        caption: "King Richard II confronting the rebel army at Smithfield after the death of Wat Tyler.",
        theme_heading: "Climax at Smithfield & Legacy",
        sources: [
          {
            id: "source_5_5",
            title: "Froissart's Chronicle on Smithfield",
            url: "/images/richard_ii_smithfield_wat_tyler.jpg",
            caption: "Jean Froissart’s account of Richard II calming the furious peasant army at Smithfield."
          }
        ]
      }
    ];
    console.log('  aligned medieval_england lesson 5');
  }
});

// -------------------------------------------------------------
// 2. Edexcel Medicine Lesson 7 (Swap Cinchona and Cool therapy)
// -------------------------------------------------------------
syncUnitToAllLayers('edexcel_medicine', (u) => {
  const l7 = u.lessons.find(l => l.id === 'lesson_7' || l.id === 'lesson-7');
  if (l7 && l7.narrative_blocks && l7.narrative_blocks.length >= 4) {
    // Check if block 3 is Cool therapy and block 4 is Cinchona
    const b3 = l7.narrative_blocks[2];
    const b4 = l7.narrative_blocks[3];
    if (b3.title.toLowerCase().includes('cool') && b4.title.toLowerCase().includes('cinchona')) {
      // Swap to match stages (Stage 3 = Peruvian bark / Cinchona, Stage 4 = Cool therapy)
      l7.narrative_blocks[2] = b4;
      l7.narrative_blocks[3] = b3;
      // Re-number decimals
      l7.narrative_blocks[2].decimal = '[7.3]';
      l7.narrative_blocks[3].decimal = '[7.4]';
      console.log('  swapped edexcel_medicine lesson 7 blocks 3 & 4 to match stages');
    }
  }
});

console.log('\n🎉 Finished realigning target lessons across all layers.');

