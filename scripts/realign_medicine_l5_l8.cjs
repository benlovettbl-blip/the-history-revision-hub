const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function syncUnitToAllLayers(unitId, updateFn) {
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

  const unitsDataJs = path.join(ROOT, 'units', unitId, 'data.js');
  if (fs.existsSync(unitsDataJs) && unitData) {
    fs.writeFileSync(unitsDataJs, 'export default ' + JSON.stringify(unitData, null, 2) + ';\n', 'utf8');
    console.log(`✅ Updated units/${unitId}/data.js`);
  }
}

syncUnitToAllLayers('edexcel_medicine', (u) => {
  // 1. Lesson 5: Black Death (lesson_1_5)
  const l5 = u.lessons.find(l => l.id === 'lesson_1_5');
  if (l5) {
    l5.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[1.5.1]",
        title: "Trade Routes & Arrival at Melcombe Regis (1348)",
        text: "<span class=\"para-ref\">[1.5.1]</span> In the high summer of 1348, the Second Plague Pandemic struck England through maritime trade networks, <strong>Docking trade cogs from Gascony in Dorset</strong> at the channel port of Melcombe Regis. The merchant vessels carried a silent catastrophe: dock workers <strong>Unloading flea-infested wool sacks onto wharves</strong> released infected black rats carrying <em>Yersinia pestis</em> into crowded towns. With primitive timber dwellings and poor sanitation, <strong>Spreading black rats into crowded timber cottages</strong> allowed the disease to establish an unstoppable domestic foothold across southern England within weeks.",
        image: "/images/trade_ship_gascony_dorset_1348.jpg",
        image_alt: "Medieval Merchant Cog Docking at Melcombe Regis",
        caption: "A merchant cog from Gascony docking in Dorset in 1348, carrying the black rats and fleas that spread the Black Death.",
        theme_heading: "Arrival & Maritime Transmission",
        sources: [
          {
            id: "source_1_5_1",
            title: "Chronicle of Melcombe Regis (1348)",
            url: "/images/trade_ship_gascony_dorset_1348.jpg",
            caption: "Contemporary records confirm the pandemic arrived via merchant shipping from Gascony entering the port of Melcombe Regis."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[1.5.2]",
        title: "Bubonic & Pneumonic Strains: The Pathological Terror",
        text: "<span class=\"para-ref\">[1.5.2]</span> The Black Death presented in two lethal clinical manifestations. In its bubonic form, flea bites injected bacteria directly into the lymphatic system, <strong>Swelling agonizing egg-sized groin lumps</strong> and armpit buboes that turned purple-black. Far more lethal was the pneumonic form: when infection spread to the lungs, victims began violently <strong>Coughing bloody phlegm across family rooms</strong>, transmitting droplets directly through the air. The virulence was devastating, routinely <strong>Killing infected farm labourers within three days</strong> of first fever, leaving entire families dead in their beds.",
        image: "/images/black_death_buboes_symptoms.jpg",
        image_alt: "Black Death Buboes and Clinical Symptoms",
        caption: "Contemporary drawing showing a physician examining plague buboes in a patient's groin and armpit.",
        theme_heading: "Pathology & Clinical Manifestation",
        sources: [
          {
            id: "source_1_5_2",
            title: "Contemporary Clinical Accounts (1349)",
            url: "/images/black_death_buboes_symptoms.jpg",
            caption: "Medieval descriptions distinguished between agonizing external buboes and the airborne pneumonic cough that killed within seventy-two hours."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[1.5.3]",
        title: "Desperate & Ineffective Medical Treatments",
        text: "<span class=\"para-ref\">[1.5.3]</span> Without any understanding of bacterial pathogens, medieval medical treatments proved completely futile. Desperate barber-surgeons attempted radical surgical drainage, <strong>Lancing hard neck swellings with hot knives</strong>, which only caused excruciating agony and septicaemia. Folk healers resorted to sympathetic remedies, <strong>Strapping plucked live hens to dark sores</strong> to supposedly 'draw out' poison. Wealthy nobles consulted elite university physicians, bankrupting themselves by <strong>Drinking crushed emerald stones dissolved in vinegar</strong> or swallowing powdered theriac, none of which had any pharmacological effect.",
        image: "/images/plague_treatments_lancing_buboes.jpg",
        image_alt: "Surgeon Lancing Plague Bubo",
        caption: "A barber-surgeon attempting to lance a plague bubo; medieval remedies were helpless against bacterial septicaemia.",
        theme_heading: "Futile Therapeutics",
        sources: [
          {
            id: "source_1_5_3",
            title: "John of Burgundy's Plague Treatise",
            url: "/images/plague_treatments_lancing_buboes.jpg",
            caption: "Plague treatises recommended bloodletting, burning herbs, and lancing swellings, all of which failed to halt mortality."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[1.5.4]",
        title: "Miasma, Public Sanitation & Royal Prevention Orders",
        text: "<span class=\"para-ref\">[1.5.4]</span> Because physicians attributed the epidemic to corrupt atmospheric miasma, public health authorities attempted emergency environmental controls. King Edward III issued urgent proclamations <strong>Ordering town bailiffs to clear butchered animal entrails</strong> from streets and alleys to stop poisonous smells. Common councils organized sweeps, <strong>Shovelling horse dung out of unpaved London streets</strong> and forbidding butchers from dumping offal into the River Thames. Across English cities, citizens tried purifying the air by <strong>Lighting smoking pitch fires at road corners</strong> day and night to burn away corrupt airborne vapours.",
        image: "/images/medieval_street_cleaning_miasma.jpg",
        image_alt: "Medieval Street Sanitation during Plague",
        caption: "Town authorities attempting to clear rotting waste and light pitch fires to purge miasma during the 1348 epidemic.",
        theme_heading: "Environmental Prevention & Royal Decrees",
        sources: [
          {
            id: "source_1_5_4",
            title: "King Edward III's Mandate to London (1349)",
            url: "/images/medieval_street_cleaning_miasma.jpg",
            caption: "Edward III demanded the Mayor of London cleanse streets of human feces and animal offal to disperse foul miasma."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[1.5.5]",
        title: "Mass Graves, Demographic Crisis & Economic Upheaval",
        text: "<span class=\"para-ref\">[1.5.5]</span> By the winter of 1349, the sheer scale of death overwhelmed traditional churchyards. Church authorities responded by <strong>Digging vast emergency trenches at East Smithfield</strong> outside London's city walls, working around the clock. Overburdened sextons were reduced to <strong>Piling stacked corpses under thin river clay</strong> in five tiers of rough wooden coffins. The demographic collapse transformed feudal society: by <strong>Losing half of England’s agricultural workforce</strong>, the Black Death created an acute labour shortage that empowered surviving peasants, fatally weakening feudal servitude and paving the way for the 1381 revolt.",
        image: "/images/east_smithfield_plague_trench.jpg",
        image_alt: "Emergency Plague Burial Pit at East Smithfield",
        caption: "Archaeological excavations of the mass burial trenches established at East Smithfield in 1348–1349 to inter thousands of London plague victims.",
        theme_heading: "Demographic Collapse & Feudal Crisis",
        sources: [
          {
            id: "source_1_5_5",
            title: "East Smithfield Excavation Evidence",
            url: "/images/east_smithfield_plague_trench.jpg",
            caption: "Forensic archaeology confirms mass trenches were meticulously organized to inter hundreds of corpses daily."
          }
        ]
      }
    ];
    console.log('  aligned edexcel_medicine lesson 5 (lesson_1_5)');
  }

  // 2. Lesson 8: Andreas Vesalius (lesson_2_3)
  const l8 = u.lessons.find(l => l.id === 'lesson_2_3');
  if (l8) {
    l8.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[2.3.1]",
        title: "The Revolutionary Dissector at Padua (1537)",
        text: "<span class=\"para-ref\">[2.3.1]</span> Appointed Professor of Surgery at Padua in 1537, Andreas Vesalius transformed anatomical pedagogy by <strong>Stepping down from the elevated university pulpit</strong> (the <em>cathedra</em>). Breaking completely with medieval tradition, he was <strong>Dismissing uneducated barber-surgeons from dissection</strong> who previously carved up bodies while lecturers read aloud from Galen's texts. Instead, Vesalius stood directly at the dissecting table in front of hundreds of students, <strong>Handling human cadavers directly with his own hands</strong> to observe authentic anatomical reality.",
        image: "/images/vesalius_dissecting_cadaver_padua.jpg",
        image_alt: "Vesalius Dissecting Human Body at Padua",
        caption: "Vesalius performing his own dissections at Padua, abandoning the medieval practice of lecturing from a distant pulpit.",
        theme_heading: "Pedagogical Revolution",
        sources: [
          {
            id: "source_2_3_1",
            title: "Vesalius at the Dissecting Table",
            url: "/images/vesalius_dissecting_cadaver_padua.jpg",
            caption: "Vesalius insisted that medical students must learn from direct sensory observation of the human body rather than ancient books."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[2.3.2]",
        title: "Uncovering Over Three Hundred Galenic Errors",
        text: "<span class=\"para-ref\">[2.3.2]</span> Through meticulous forensic dissections, Vesalius shattered ancient dogmas by <strong>Revealing Galen dissected Barbary apes and dogs</strong> rather than human beings, because Roman religious taboos had prohibited human dissection. Vesalius demonstrated that Galen had wrongly assumed human anatomy mirrored animal physiology, conclusively <strong>Proving the human jawbone is one bone not two</strong> and demonstrating that the breastbone consisted of three segments rather than seven. In total, Vesalius succeeded in <strong>Cataloguing over three hundred major Galenic errors</strong>.",
        image: "/images/galen_versus_vesalius_anatomy.jpg",
        image_alt: "Vesalius Correcting Galenic Errors",
        caption: "Anatomical comparison showing how Vesalius corrected ancient Galenic misconceptions regarding human skeletal structures.",
        theme_heading: "Empirical Correction of Ancient Orthodoxy",
        sources: [
          {
            id: "source_2_3_2",
            title: "Vesalius on Galen's Errors",
            url: "/images/galen_versus_vesalius_anatomy.jpg",
            caption: "Vesalius showed that Galen's anatomical claims were derived from animal dissections, including the non-existent 'rete mirabile' in humans."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[2.3.3]",
        title: "De Humani Corporis Fabrica (1543): Masterpiece of Renaissance Print",
        text: "<span class=\"para-ref\">[2.3.3]</span> In 1543, Vesalius published his epoch-making work, <em>De Humani Corporis Fabrica</em> (On the Fabric of the Human Body). The volume set unprecedented visual standards by <strong>Publishing lavish woodcut plates from Titian’s workshop</strong> in Venice, combining absolute scientific precision with exquisite Renaissance aesthetics. The illustrations were famous for <strong>Depicting realistic muscle men against Italian landscapes</strong> in dynamic classical poses. The printing press made this revolution universal, <strong>Printing identical anatomical textbooks across Europe</strong> so scholars everywhere studied the exact same empirical illustrations.",
        image: "/images/fabrica_muscle_man_woodcut_1543.jpg",
        image_alt: "De Humani Corporis Fabrica Muscle Man Woodcut",
        caption: "One of the famous 'Muscle Men' woodcut plates from Vesalius's Fabrica (1543), set against a panorama of the Euganean Hills.",
        theme_heading: "Scientific Publication & Print Technology",
        sources: [
          {
            id: "source_2_3_3",
            title: "De Humani Corporis Fabrica (1543)",
            url: "/images/fabrica_muscle_man_woodcut_1543.jpg",
            caption: "The Fabrica unified art and science, providing European medicine with its first accurate printed anatomical atlas."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[2.3.4]",
        title: "English Dissemination: Thomas Geminus & Barber-Surgeons (1545)",
        text: "<span class=\"para-ref\">[2.3.4]</span> Vesalius's revolutionary discoveries spread rapidly to Britain thanks to unauthorized commercial reprints. In 1545, London printer Thomas Geminus pirated the artwork, <strong>Engraving Thomas Geminus’s portable copperplate manual</strong> titled <em>Compendiosa</em>. Recognizing that working barber-surgeons rarely read Latin, Geminus accelerated reform by <strong>Translating Latin anatomical texts into vernacular English</strong> in his 1553 edition. This had a profound democratizing effect, <strong>Putting accurate diagrams into the hands of surgeons</strong> and apprentices across Tudor England who had never attended university.",
        image: "/images/thomas_geminus_compendiosa_1545.jpg",
        image_alt: "Thomas Geminus Compendiosa Copperplate Title Page",
        caption: "Title page of Thomas Geminus's Compendiosa (1545), which brought Vesalius's anatomical diagrams to English medical practitioners.",
        theme_heading: "Vernacular Transmission & Surgical Training",
        sources: [
          {
            id: "source_2_3_4",
            title: "Thomas Geminus's Compendiosa (1545)",
            url: "/images/thomas_geminus_compendiosa_1545.jpg",
            caption: "Geminus's English edition made Vesalian anatomy accessible to ordinary barber-surgeons who lacked university Latin."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[2.3.5]",
        title: "Fierce Resistance & The Immediate Clinical Limits",
        text: "<span class=\"para-ref\">[2.3.5]</span> Despite its brilliance, Vesalius's revolution faced severe academic resistance and delivered few immediate clinical cures. Conservative university physicians reacted with fury, <strong>Facing furious resistance from traditional Galenists</strong> like Jacobus Sylvius who claimed human anatomy had degenerated since Galen's time. Crucially, Renaissance medicine remained crippled by <strong>Lacking anaesthetics, antiseptics, and germ theory</strong>: knowing the precise location of an organ did not stop bleeding or prevent gangrene. Consequently, Vesalius excelled in <strong>Providing anatomical knowledge without clinical cures</strong>, leaving ordinary patients no more likely to survive illness in 1550 than in 1350.",
        image: "/images/galenist_physicians_resistance_vesalius.jpg",
        image_alt: "Galenist Physicians Resisting Vesalian Anatomy",
        caption: "University Galenists heatedly disputing Vesalius's findings; accurate anatomy could not cure disease without antiseptic surgery.",
        theme_heading: "Academic Backlash & Clinical Limits",
        sources: [
          {
            id: "source_2_3_5",
            title: "Sylvius's Attack on Vesalius",
            url: "/images/galenist_physicians_resistance_vesalius.jpg",
            caption: "Jacobus Sylvius condemned his former pupil as a 'madman' whose dissections had corrupted classical medical science."
          }
        ]
      }
    ];
    console.log('  aligned edexcel_medicine lesson 8 (lesson_2_3)');
  }
});

console.log('\n🎉 Finished Medicine Lessons 5 and 8 realignments.');

