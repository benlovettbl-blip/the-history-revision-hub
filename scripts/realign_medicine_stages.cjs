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
  // Lesson 2: Rational Explanations (lesson_1_2)
  // Stage 1: Hippocrates clinical observation
  // Stage 2: The Four Humours
  // Stage 3: Theory of Opposites
  // Stage 4: Clinical Observation: Uroscopy
  // Stage 5: Miasma Theory
  const l2 = u.lessons.find(l => l.id === 'lesson_1_2');
  if (l2) {
    l2.narrative_blocks = [
      {
        id: "block_1",
        decimal: "[1.2.1]",
        title: "Hippocrates & The Secular Shift in Medicine",
        text: "<span class=\"para-ref\">[1.2.1]</span> In fifth-century BC Greece, Hippocrates revolutionised healing by breaking with supernatural superstition. Instead of blaming divine wrath or demonic possession, he insisted doctors must be <strong>Observing clinical symptoms at the bedside</strong>, recording fevers, pulse changes, and excretion. Hippocrates compiled detailed case studies, <strong>Recording natural disease trajectories in treatises</strong> known as the <em>Hippocratic Corpus</em>. By <strong>Rejecting divine curses in favour of bodily laws</strong>, he established the foundational principle that illness arose from physical causes within the natural world.",
        image: "/images/hippocrates_bedside_clinical_observation.jpg",
        image_alt: "Hippocrates Observing Bedside Clinical Symptoms",
        caption: "Hippocrates recording bedside clinical symptoms, pioneering natural clinical observation.",
        theme_heading: "Rational Foundations",
        sources: [
          {
            id: "source_1_2_1",
            title: "Hippocratic Oath & Aphorisms",
            url: "/images/hippocrates_bedside_clinical_observation.jpg",
            caption: "The Hippocratic tradition established clinical observation and natural cause-and-effect as the basis of medicine."
          }
        ]
      },
      {
        id: "block_2",
        decimal: "[1.2.2]",
        title: "The Four Humours & Medieval Equilibrium",
        text: "<span class=\"para-ref\">[1.2.2]</span> The cornerstone of rational ancient and medieval pathology was the Theory of the Four Humours. Health required carefully <strong>Balancing blood, phlegm, yellow bile, and black bile</strong> within the body. Humours were intimately integrated into the medieval cosmos, <strong>Connecting bodily fluids to seasons and elements</strong>: blood was hot and wet (spring/air), phlegm was cold and wet (winter/water), yellow bile was hot and dry (summer/fire), and black bile was cold and dry (autumn/earth). Imbalances were believed to govern personality, <strong>Explaining distinct emotional temperaments</strong> (sanguine, phlegmatic, choleric, melancholic).",
        image: "/images/four_humours_medieval_macrocosm_chart.jpg",
        image_alt: "The Four Humours and Cosmic Macrocosm",
        caption: "Medieval diagram connecting the four bodily humours to elements, seasons, and temperaments.",
        theme_heading: "Cosmological & Humoral Balance",
        sources: [
          {
            id: "source_1_2_2",
            title: "Medieval Humoral Macrocosm",
            url: "/images/four_humours_medieval_macrocosm_chart.jpg",
            caption: "The four humours provided a complete rational framework explaining human health and emotional temperament."
          }
        ]
      },
      {
        id: "block_3",
        decimal: "[1.2.3]",
        title: "Galen's Theory of Opposites & Clinical Intervention",
        text: "<span class=\"para-ref\">[1.2.3]</span> Six centuries after Hippocrates, Roman physician Claudius Galen revolutionized therapeutics by developing the Theory of Opposites. Galen translated theory into intervention, <strong>Formulating contraria contrariis curantur in imperial Rome</strong> ('opposites cure opposites'). If an excess of cold, wet phlegm caused a winter chill, physicians sought balance by <strong>Treating cold wet phlegm with hot dry spices</strong>, pepper, and ginger wine. Conversely, when acute fevers burned, doctors prescribed balance by <strong>Administering cooling cucumbers for burning yellow bile fevers</strong>.",
        image: "/images/galen_opposites_treatment_chart.jpg",
        image_alt: "Galen Theory of Opposites Treatment",
        caption: "Galen instructing physicians on using opposing herbal remedies to counteract humoral excess.",
        theme_heading: "Therapeutic Intervention",
        sources: [
          {
            id: "source_1_2_3",
            title: "Galen on the Natural Faculties",
            url: "/images/galen_opposites_treatment_chart.jpg",
            caption: "The Theory of Opposites provided clear, practical rules for medieval physicians prescribing dietary and herbal treatments."
          }
        ]
      },
      {
        id: "block_4",
        decimal: "[1.2.4]",
        title: "Clinical Observation: Uroscopy & Diagnostic Authority",
        text: "<span class=\"para-ref\">[1.2.4]</span> University-trained medieval physicians commanded immense diagnostic prestige without ever performing surgery. Their primary diagnostic tool was uroscopy: carefully <strong>Inspecting clear glass matula flasks against window light</strong> to assess density, sediment, and hue. The physician matched sample traits by <strong>Comparing urine colour against twenty-part parchment wheels</strong> to determine precisely which humour was corrupted. Uroscopy was the ultimate status symbol, allowing elite practitioners to justify <strong>Charging exorbitant consultation fees without cutting skin</strong>.",
        image: "/images/physician_examining_urine_matula_flask.jpg",
        image_alt: "Medieval Physician Holding Uroscopy Matula Flask",
        caption: "Physician holding a glass matula flask up to the daylight to examine urine against a parchment urine wheel.",
        theme_heading: "Diagnostic Authority & Status",
        sources: [
          {
            id: "source_1_2_4",
            title: "Medieval Urine Wheel Manuscript",
            url: "/images/physician_examining_urine_matula_flask.jpg",
            caption: "Uroscopy allowed elite university-educated physicians to diagnose internal humoral disease non-invasively."
          }
        ]
      },
      {
        id: "block_5",
        decimal: "[1.2.5]",
        title: "Miasma Theory & Environmental Health",
        text: "<span class=\"para-ref\">[1.2.5]</span> To explain why thousands perished simultaneously during epidemics, rational medieval doctors looked to the atmosphere, <strong>Blaming poisonous miasma arising from stagnant cesspools</strong>, rotting animal carcasses, and unburied corpses. They believed <strong>Inhaling corrupt foul air directly into bloodstream</strong> threw bodily humours into violent corruption. Town dwellers sought protection by burning sweet resins, carrying pomanders, and <strong>Sniffing herbal pomanders to neutralise noxious vapours</strong>, establishing early communal public health sanitation measures.",
        image: "/images/miasma_medieval_street_pomanders.jpg",
        image_alt: "Medieval Citizens Sniffing Pomanders Against Miasma",
        caption: "Citizens carrying sweet-smelling herbs and sniffing pomanders to ward off poisonous miasmic vapours in crowded streets.",
        theme_heading: "Atmospheric Etiology",
        sources: [
          {
            id: "source_1_2_5",
            title: "Medieval Medical Consilia on Pestilence",
            url: "/images/miasma_medieval_street_pomanders.jpg",
            caption: "Miasma theory provided a rational explanation for widespread epidemics, linking disease directly to environmental foulness."
          }
        ]
      }
    ];
    console.log('  aligned edexcel_medicine lesson 2 (lesson_1_2)');
  }

  // Lesson 7: Thomas Sydenham (lesson_2_2)
  const l7 = u.lessons.find(l => l.id === 'lesson_2_2');
  if (l7 && l7.narrative_blocks && l7.narrative_blocks.length >= 4) {
    const b3 = l7.narrative_blocks[2];
    const b4 = l7.narrative_blocks[3];
    if (b3.title.toLowerCase().includes('cool') && b4.title.toLowerCase().includes('cinchona')) {
      l7.narrative_blocks[2] = b4;
      l7.narrative_blocks[3] = b3;
      l7.narrative_blocks[2].decimal = '[2.2.3]';
      l7.narrative_blocks[3].decimal = '[2.2.4]';
      console.log('  swapped edexcel_medicine lesson 7 (lesson_2_2) blocks 3 & 4 to match stages');
    }
  }
});

console.log('\n🎉 Finished Medicine realignments.');

