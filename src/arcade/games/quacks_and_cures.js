/**
 * Visual Showcase Game 1: "Quacks & Cures: 800 Years on Call (c.1250–Present)"
 *
 * Tongue-in-cheek illustrated medical career simulation spanning all 5 Edexcel GCSE Medicine eras:
 *   Shift 1: 1348 Medieval Apothecary (Causes, Prevention, Treatment -> 0/3 Saved, 100% Guild Distinction!)
 *   Shift 2: 1665 Renaissance Plague & Anatomy Room (Vesalius, Charles II Continuity, Sydenham Quinine -> 1/3 Saved!)
 *   Shift 3: 1854–1867 Victorian Operating Theatre (Snow's Pump, Lister's Carbolic Spray, Pasteur -> 3/3 Saved!)
 *   Shift 4: 1917 RAMC Western Front Chain of Evacuation (Interactive 4-Node Map: RAP -> ADS -> CCS -> Base Hospital!)
 *   Shift 5: 1948–Present Modern NHS Ward (Bevan Free Care, Florey & Chain Penicillin, MRSA Superbug Boss -> 3/3 Saved!)
 *
 * 100% Pure Custom Vector SVG Graphics & Animations (Zero AI Images).
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { addXp, generateQuestionId, recordQuestionResult } from '../../storage.js';

const SHIFTS = [
  {
    id: 'medieval',
    eraBadge: 'SHIFT 1 • MEDIEVAL ENGLAND (1348)',
    eraTitle: 'Ye Olde Humour & Leach Apothecary',
    inspectorTitle: 'Guild Master & Parish Priest',
    accent: '#d97706',
    bgGrad: 'linear-gradient(135deg, #271709 0%, #170f07 100%)',
    propHint: 'Click the Urine Flask (Matula) or Zodiac Wheel on your shelf to inspect medieval tools!',
    cases: [
      {
        patient: 'Lord Percy of York',
        ailment: 'Egg-sized black buboes in the armpits, roaring fever, and foul breath during the 1348 Pestilence!',
        avatarMood: 'sick-plague',
        prompt: 'The Parish Priest & Guild Examiner are watching! What do you diagnose as the PRIMARY CAUSE and Official Treatment?',
        options: [
          {
            label: 'Blame microscopic bacteria carried by rat fleas & prescribe antibiotics',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🔥 HERESY & LUNACY! "Invisible tiny beasts?!" The Guild confiscates your urine flask! Neither microscopes nor germ theory exist for another 500 years!',
            examNote: 'In 1348, nobody knew about bacteria (Yersinia pestis). Doctors relied on supernatural, astrological, and humoral explanations.',
          },
          {
            label: "Diagnose God's wrath & Mars-Jupiter alignment; strap a shaved live chicken to his buboes!",
            isOrthodox: true,
            survived: false,
            inspectorQuip: '📜 FULL GUILD DISTINCTION! Classic Vicary/medieval plague method! Sadly, Lord Percy died on Tuesday... though the chicken made a full recovery.',
            examNote: 'Medieval physicians blamed God’s punishment for sin, astrology (1345 alignment of Mars, Jupiter & Saturn), and miasma, using sympathetic magic like strapping a shaved chicken (or bleeding/lancing).',
          },
          {
            label: 'Tell him to exercise vigorously for 3 hours to sweat out the black bile',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Amateur! Vigorous exercise overheats choleric blood! He collapsed on the cobbles in four minutes.',
            examNote: 'Galenic Regimenta Sanitatis advised gentle moderation, prayer, confession, and humoral balancing—never exhausting a feverish plague victim.',
          },
        ],
      },
      {
        patient: 'Dame Margery the Baker',
        ailment: 'Flushed red cheeks, throbbing headache, and dark crimson urine in your glass Matula flask!',
        avatarMood: 'flushed',
        prompt: 'Using Galen’s Theory of Opposites & the Four Humours, how do you balance Dame Margery?',
        options: [
          {
            label: 'Check the Zodiac Man chart so the Moon isn’t in Aries, then bleed her arm vein into a pewter bowl!',
            isOrthodox: true,
            survived: false,
            inspectorQuip: '🩸 TEXTBOOK GALEN! You drained two pints of "excess hot blood" under a favourable constellation! Tragically she fainted and expired, so your humours paperwork is spotless.',
            examNote: 'University-trained physicians used uroscopy charts and the Zodiac Man (astrology) to time phlebotomy (bloodletting) and balance excess blood.',
          },
          {
            label: 'Feed her spicy roast peppered boar and red wine to boost her blood',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Backwards! Galen’s Theory of Opposites says hot/wet excess blood requires COOLING cucumber—not hot pepper!',
            examNote: 'Claudius Galen’s Theory of Opposites treated hot/wet conditions with cold/dry remedies (like cucumber) and excess blood with bleeding or leeches.',
          },
          {
            label: 'Perform keyhole laparoscopic surgery under anaesthetic gas',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🕰️ Time-traveller alert! Anaesthetics aren’t invented until the 1800s and keyhole surgery until the late 20th century!',
            examNote: 'Medieval surgery had no effective anaesthetics or antiseptics—only opium/hemlock (dwale) which easily overdosed patients.',
          },
        ],
      },
      {
        patient: 'Alderman Giles of London',
        ailment: 'Terrified of catching the Black Death from overflowing city cesspits and smelly butcher lanes!',
        avatarMood: 'panicked',
        prompt: 'King Edward III demands civic & religious PREVENTION advice. What is authentic 1348 prevention?',
        options: [
          {
            label: 'Order compulsory smallpox cowpox vaccination across every parish',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🐄 Cowpox?! Edward Jenner isn’t born for another 400 years! The Alderman thinks you’ve gone mad!',
            examNote: 'Vaccination was discovered by Edward Jenner in 1796 for smallpox—medieval prevention focused on prayer, fasting, and clearing miasma.',
          },
          {
            label: 'Carry a sweet-smelling pomander posy, burn tar barrels against Miasma, and join barefoot prayer processions!',
            isOrthodox: true,
            survived: false,
            inspectorQuip: '🌿 MAGNIFICENT! The streets smell of rosemary and smoke! Unfortunately, fleas don’t care about posies, so Giles still caught bubonic plague on Friday.',
            examNote: 'Medieval prevention targeted Miasma (corrupt air) with pomanders, burning herbs, and King Edward III’s street-cleaning orders alongside fasting and confession.',
          },
          {
            label: 'Dump carbolic acid spray into the River Thames',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧪 Joseph Lister won’t invent carbolic antiseptics until 1865! Stick to rosemary and Latin prayers!',
            examNote: 'Medieval towns had rakers and gongfermors to clear foul-smelling muck (miasma), not chemical antiseptics.',
          },
        ],
      },
    ],
    shiftFootnote: 'Medieval Shift Complete! Patients Saved: 0/3 — Yet the Catholic Church & Guild awarded you 100% Distinction because nobody challenged Galen!',
  },
  {
    id: 'renaissance',
    eraBadge: 'SHIFT 2 • MEDICAL RENAISSANCE (1543–1685)',
    eraTitle: 'Beaked Masks, Royal Bleeding & New World Bark',
    inspectorTitle: 'Royal Society Fellow',
    accent: '#a855f7',
    bgGrad: 'linear-gradient(135deg, #211336 0%, #110a1f 100%)',
    propHint: 'Spot the printing press & Vesalius chart! Anatomy leaped forward—but did everyday plague cures actually change?',
    cases: [
      {
        patient: 'Anatomy Student at Padua (1543)',
        ailment: 'Dissecting a real human cadaver alongside Andreas Vesalius—something looks VERY different from Galen’s ancient books!',
        avatarMood: 'scholar',
        prompt: 'What breakthrough does Vesalius prove in "On the Fabric of the Human Body" (1543)?',
        options: [
          {
            label: 'Galen dissected animals, not humans! The human jaw has ONE bone (not two) and blood does NOT pass through invisible holes in the heart septum!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '📖 PRINT IT IMMEDIATELY! Thanks to Gutenberg’s printing press, 300 woodcut illustrations spread across Europe! (Count that cadaver lesson as a WIN!)',
            examNote: 'Vesalius (1543) proved over 300 of Galen’s anatomical errors (made on monkeys/pigs), encouraging doctors to dissect humans themselves.',
          },
          {
            label: 'Galen was 100% infallible—ignore your own eyes and blame a deformed corpse!',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦴 Old-school medieval dogmatism! Renaissance humanists test ancient texts through direct observation!',
            examNote: 'Declining Church censorship and the printing press allowed Vesalius and William Harvey (1628 circulation of blood) to overturn Galenic anatomy.',
          },
          {
            label: 'Vesalius discovers DNA’s double helix inside the cadaver’s liver',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧬 Slow down! Watson, Crick, Franklin & Wilkins are 410 years away (1953)!',
            examNote: 'Renaissance breakthroughs improved anatomical knowledge (Vesalius, Harvey), though microscopic causes of disease remained unknown.',
          },
        ],
      },
      {
        patient: 'King Charles II (February 1685)',
        ailment: 'The King collapsed while shaving at Whitehall Palace with a kidney seizure!',
        avatarMood: 'royal',
        prompt: 'Despite Harvey proving blood circulates in 1628, how do Charles II’s 14 royal physicians ACTUALLY treat him?',
        options: [
          {
            label: 'Put him on a kidney dialysis machine and administer intravenous saline',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '👑 Impossible in 1685! Harvey knew blood circulated like a pump, not how to filter toxins or transfuse human blood safely!',
            examNote: 'Anatomical discoveries (Vesalius/Harvey) took centuries to produce practical life-saving treatments.',
          },
          {
            label: 'Drain 24 ounces of royal blood, apply blister-beetle plasters, a hot frying pan to his head, and crushed human skull drops!',
            isOrthodox: true,
            survived: false,
            inspectorQuip: '💀 HISTORICALLY SPOT-ON CONTINUITY! Charles II apologised for taking "an unconscionable time a-dying" and expired! Proof that treatment barely changed!',
            examNote: 'Key GCSE Continuity Point: Even at the very top of society in 1685, doctors still fell back on humoral bleeding, purging, and desperate alchemy.',
          },
          {
            label: 'Leave him completely untouched in a darkened quiet room',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Fourteen ambitious court physicians would NEVER pass up billing the Crown for crushed pearls and hot irons!',
            examNote: 'Charles II’s treatment illustrates why Renaissance ideas changed faster than practical bedside treatments.',
          },
        ],
      },
      {
        patient: 'Merchant Samuel (Ague / Malaria Fever, 1676)',
        ailment: 'Violent shivering bouts every third day after trading ships returned from the Americas!',
        avatarMood: 'shivering',
        prompt: '"English Hippocrates" Thomas Sydenham arrives! What genuinely effective New World remedy does he prescribe?',
        options: [
          {
            label: 'Lock him in his house with a red cross painted on the door and burn tobacco',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🚪 That’s the 1665 Great Plague Lord Mayor’s quarantine order—it won’t cure Samuel’s malaria!',
            examNote: 'Quarantine (28–40 days with watchmen) was strong 1665 government plague prevention, whereas Sydenham pioneered clinical observation for fevers.',
          },
          {
            label: 'Observe his exact symptoms (not his star sign!) and prescribe Cinchona ("Jesuits’ Bark" containing quinine) imported from Peru!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🎉 STOP EVERYTHING—A SICK PATIENT ACTUALLY SURVIVED!! Sydenham classified diseases like plant species and Peruvian bark genuinely cured malaria!',
            examNote: 'Thomas Sydenham (Observationes Medicae, 1676) rejected astrology/uroscopy in favour of bedside observation, popularising cinchona bark (quinine) for malaria.',
          },
          {
            label: 'Inject Salvarsan 606 chemical magic bullet',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧪 Paul Ehrlich doesn’t synthesise Salvarsan 606 until 1909!',
            examNote: 'Overseas exploration brought natural botanical remedies (cinchona bark, ipecacuanha), whereas synthetic chemical magic bullets arrived in the 1900s.',
          },
        ],
      },
    ],
    shiftFootnote: 'Renaissance Shift Complete! Anatomy & observation advanced massively, and cinchona bark saved your first real fever patient!',
  },
  {
    id: 'industrial',
    eraBadge: 'SHIFT 3 • INDUSTRIAL BRITAIN (1796–1875)',
    eraTitle: 'Pumps, Chloroform & Carbolic Spray',
    inspectorTitle: 'Victorian Hospital Matron & Surgeon',
    accent: '#10b981',
    bgGrad: 'linear-gradient(135deg, #092622 0%, #071717 100%)',
    propHint: 'Click Lister’s Carbolic Spray Pump on the visual tray to clear red sepsis clouds!',
    cases: [
      {
        patient: 'Soho Residents on Broad Street (August 1854)',
        ailment: 'Over 500 neighbours around Golden Square have collapsed with fatal rice-water cholera within 10 days!',
        avatarMood: 'panicked',
        prompt: 'Dr John Snow has mapped every death onto a street grid. How do you halt the outbreak?',
        options: [
          {
            label: 'Flush all London sewers straight into the Thames to blow away Miasma',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🌊 DISASTER! Edwin Chadwick did that earlier—dumping sewage into drinking water intakes spread MORE cholera!',
            examNote: 'Chadwick believed Miasma caused disease, inadvertently washing sewage into London’s water supply before Bazalgette’s 1860s intercepting sewers.',
          },
          {
            label: 'Remove the handle from the Broad Street water pump (contaminated by a leaking cesspit 3 feet away)!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🔧 CLANG! Handle removed—new Soho cholera deaths plummet overnight! Even though Snow couldn’t yet show the comma bacteria (Koch, 1883), his spot-map saved hundreds!',
            examNote: 'John Snow (1854) proved cholera was waterborne rather than airborne miasma, paving the way for Bazalgette’s sewers and the compulsory 1875 Public Health Act.',
          },
          {
            label: 'Do nothing—strict Laissez-Faire says ratepayers shouldn’t fund clean water',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🎩 Early 1800s MPs loved Laissez-Faire, and thousands died because of it! By 1875 Disraeli finally made public health compulsory!',
            examNote: 'Working-class male suffrage (1867), Pasteur’s Germ Theory (1861), and Snow’s evidence forced the government to abandon laissez-faire in the 1875 Public Health Act.',
          },
        ],
      },
      {
        patient: 'Compound Leg Fracture in Glasgow Royal Infirmary (1867)',
        ailment: 'Anaesthetic chloroform stops pain—but 46% of amputation patients are dying of "Hospital Gangrene" during Surgery’s Black Period!',
        avatarMood: 'bandaged',
        prompt: 'Joseph Lister has just read Louis Pasteur’s 1861 Germ Theory! What do you do BEFORE & DURING surgery?',
        options: [
          {
            label: 'Wear your proudest unwashed blood-stiffened frock coat and saw as fast as Robert Liston!',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩸 "The good old surgical stink!" The operation hurt zero percent thanks to Simpson’s chloroform—and then sepsis killed the patient 4 days later!',
            examNote: 'Between 1847 (Simpson’s chloroform) and 1865 (Lister’s antiseptics), longer invasive operations with dirty hands caused the "Black Period" spike in infection deaths.',
          },
          {
            label: 'Soak instruments, bandages, and the wound in Carbolic Acid mist to kill airborne microbes on contact!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '💨 HISSSSS! Carbolic mist fills the theatre! Your knuckles are cracked and yellow, yet amputation mortality crashes from 46% down to 15%! PATIENT SAVED!',
            examNote: 'Joseph Lister (1865–67) applied Pasteur’s Germ Theory using carbolic acid (earlier used on Carlisle sewage), cutting ward sepsis from 46% to 15% and leading to aseptic surgery by 1900.',
          },
          {
            label: 'Give the patient nitrous oxide laughing gas and hope that kills bacteria',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '😂 Anaesthetics block PAIN, not INFECTION! Without Lister’s antiseptics, bacteria feast on deep incisions!',
            examNote: 'Students must never confuse anaesthetics (pain relief: Simpson 1847 chloroform) with antiseptics (infection control: Lister 1865 carbolic acid).',
          },
        ],
      },
      {
        patient: 'Eight-Year-Old James Phipps in Gloucestershire (1796)',
        ailment: 'Deadly Smallpox is sweeping English villages, scarring and killing rich and poor alike!',
        avatarMood: 'healthy',
        prompt: 'Country doctor Edward Jenner notices milkmaids like Sarah Nelmes never catch smallpox. What is your move?',
        options: [
          {
            label: 'Use risky Variolation (rubbing live human smallpox scabs into a cut—which can kill the patient and infect the whole village!)',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '⚠️ Lady Mary Wortley Montagu’s variolation worked sometimes, when it didn’t trigger a full fatal smallpox outbreak!',
            examNote: 'Inoculation/variolation used live smallpox matter—expensive, uncalibrated, and capable of killing patients or spreading epidemics.',
          },
          {
            label: 'Vaccinate him with harmless Cowpox pus (vacca = cow), then test immunity six weeks later!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '💉 IMMUNE! James Phipps doesn’t get a single smallpox spot! Parliament makes vaccination compulsory in 1852—the first disease eventually eradicated worldwide!',
            examNote: 'Jenner (1796) proved cowpox vaccination prevented smallpox (though he could not explain how until Pasteur/Koch, and faced Anti-Vaccine Society opposition).',
          },
          {
            label: 'Wait for Alexander Fleming to discover Penicillin to cure the smallpox virus',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦠 DOUBLE EXAM TRAP! Not only is Penicillin 1928, Smallpox is a VIRUS—antibiotics NEVER work on viruses!',
            examNote: 'Vaccines prevent viral infections like smallpox; antibiotics (penicillin) only treat bacterial infections.',
          },
        ],
      },
    ],
    shiftFootnote: 'Industrial Shift Complete! Science, Germ Theory, Vaccines & Antiseptics turned medicine from 0% survival to genuine life-saving!',
  },
  {
    id: 'ramc',
    eraBadge: 'SHIFT 4 • 1917 RAMC WESTERN FRONT TRIAGE',
    eraTitle: 'Chain of Evacuation: Ypres & Arras Sector',
    inspectorTitle: 'RAMC Commanding Officer',
    accent: '#eab308',
    bgGrad: 'linear-gradient(135deg, #262110 0%, #14120a 100%)',
    isEvacShift: true,
    propHint: 'Interactive Chain of Evacuation! Select the exact station along RAP → ADS → CCS → Base Hospital AND the right WWI breakthrough!',
    cases: [
      {
        patient: 'Pte. Thomas Atkins (Compound Femur Fracture)',
        ailment: 'Hit by shell shrapnel in No Man’s Land! Thigh bone shattered, jagged bone ends slicing into muscle & arteries—80% fatal in 1914!',
        avatarMood: 'soldier-leg',
        prompt: 'Stretcher-bearers haul him through Ypres mud! Which Chain of Evacuation protocol & invention raises femur survival from 20% to 82%?',
        highlightNode: 1,
        options: [
          {
            label: 'Attempt full 3-hour leg surgery right in the muddy dugout at the Regimental Aid Post (RAP, 200m from front line)',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '💥 SHELLFIRE HIT THE DUGOUT! The RAP has ONE Regimental Medical Officer, bandages, and morphine—NEVER major surgery!',
            examNote: 'The Regimental Aid Post (RAP) was within 200m of the front trench to patch light wounds ("walking wounded") and move serious cases back immediately.',
          },
          {
            label: 'Stabilise at RAP/ADS with the Thomas Splint (keeping the leg rigid in traction!) & evacuate via motor ambulance to the CCS!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🎖️ TEXTBOOK RAMC! Introduced across the front from Dec 1915 by Robert Jones, the Thomas Splint stopped bone ends severing arteries—survival soared from 20% to 82%!',
            examNote: 'In 1914–15, 80% of soldiers with compound femur fractures died from blood loss/gas gangrene; widespread training in the Thomas Splint raised survival to 82%.',
          },
          {
            label: 'Leave the leg un-splinted on a jolting horse-drawn wagon all the way to London',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Every bump ground the broken femur into his femoral artery—catastrophic blood loss before reaching the railhead!',
            examNote: 'FANY volunteer motor ambulances alongside horse wagons (in deep Ypres mud) and ambulance trains moved splinted casualties smoothly.',
          },
        ],
      },
      {
        patient: 'Cpl. Arthur Jenkins (Flanders Manure-Soil Shrapnel Wound)',
        ailment: 'Deep shrapnel wound packed with heavily manured Belgian farmland soil—crackling, foul-smelling Gas Gangrene is spreading fast!',
        avatarMood: 'soldier-arm',
        prompt: 'Lister’s surface carbolic spray cannot reach deep inside jagged shrapnel tracks, and penicillin doesn’t exist yet! Where & how do you save him?',
        highlightNode: 2,
        options: [
          {
            label: 'Rush to Casualty Clearing Station (CCS): X-ray for metal, surgical debridement (cut away dead tissue), & flush via Carrel-Dakin sterilised salt tubes!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🚑 LIFE SAVED AT THE CCS! Mobile X-rays spotted every shrapnel shard, debridement cleared infected mud, and Carrel-Dakin solution irrigated deep inside the wound!',
            examNote: 'Casualty Clearing Stations (CCS, 7–10 miles back near railheads) became the crucial hub for urgent life- and limb-saving anti-gangrene surgery.',
          },
          {
            label: 'Wrap tight bandages over the mud at the ADS and wait 5 days before opening it',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '☠️ Anaerobic Clostridium perfringens bacteria thrive without oxygen! Sealing Flanders mud inside killed him within 24 hours!',
            examNote: 'Manured Western Front soil teemed with gas gangrene spores; wounds had to be opened, debrided, and irrigated via the Carrel-Dakin method within hours.',
          },
          {
            label: 'Inject mass-produced Florey & Chain Penicillin at the ADS',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '⏳ Wrong World War! Mass penicillin saved WWII D-Day troops (1944)—in 1917 WWI, surgeons had ZERO antibiotics!',
            examNote: 'Crucial WWI vs WWII distinction: WWI relied on debridement and Carrel-Dakin antiseptics; penicillin was only mass-produced in WWII.',
          },
        ],
      },
      {
        patient: 'Pte. Harry Briggs (Severe Shock & Blood Loss — Cambrai, Nov 1917)',
        ailment: 'Pale, freezing pulse—he will bleed to death from shock before any ambulance train could ever reach a coastal Base Hospital!',
        avatarMood: 'soldier-pale',
        prompt: 'How did RAMC & US Army Captain Oswald Robertson revolutionise blood transfusions before the Battle of Cambrai (1917)?',
        highlightNode: 2,
        options: [
          {
            label: 'Require a live donor to lie side-by-side on the trench floor connected tube-to-vein',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩸 Direct syringe/tube transfusion worked in quiet hospitals, not when 500 casualties hit a CCS at once—blood clots in minutes outside the body!',
            examNote: 'Early 1915 transfusions required donor and patient side-by-side because blood clotted immediately.',
          },
          {
            label: 'Deploy the World’s First Blood Bank at the CCS: Type-O blood mixed with Sodium Citrate & Citrate-Glucose chilled on ice in glass bottles!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🧊 MIRACLE AT CAMBRAI! Sodium citrate stopped clotting and glucose kept red cells alive on ice for up to 26 days! Pte. Briggs’s pulse roars back—off to the Base Hospital for recovery!',
            examNote: 'Lewisohn (1915 sodium citrate), Rous & Turner (1916 citrate-glucose), and Oswald Robertson (1917 Cambrai Blood Depot) made stored blood transfusions possible.',
          },
          {
            label: 'Bleed him with medieval leeches to equalize blood pressure',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🤦 Court-martialled on the spot! Leave the leeches in 1348!',
            examNote: 'Blood group matching (Landsteiner 1901) and citrated storage transformed surgical shock survival on the Western Front.',
          },
        ],
      },
    ],
    shiftFootnote: '1917 RAMC Shift Complete! Your triage along RAP → ADS → CCS → Base Hospital saved all 3 wounded Tommies!',
  },
  {
    id: 'modern',
    eraBadge: 'SHIFT 5 • MODERN NHS BRITAIN (1948–PRESENT)',
    eraTitle: 'Penicillin, Free Healthcare & The Superbug Boss',
    inspectorTitle: 'NHS Chief Medical Officer',
    accent: '#38bdf8',
    bgGrad: 'linear-gradient(135deg, #0b2239 0%, #071322 100%)',
    propHint: 'Monitor the live green ECG waveform! High-tech medicine saves almost everyone—until antibiotic resistance walks in!',
    cases: [
      {
        patient: 'Working-Class Mother & Child (5 July 1948)',
        ailment: 'Severe bacterial pneumonia—before 1948 she couldn’t afford a GP consultation fee (not covered by the 1911 National Insurance Act, which only covered working men)!',
        avatarMood: 'nhs-patient',
        prompt: 'Aneurin Bevan has just launched the National Health Service AND WWII factories scaled a miracle drug. What happens today?',
        options: [
          {
            label: 'Charge her 10 shillings at the door and hand her an herbal posy',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🏥 Fired on Day 1 of the NHS! Bevan made hospitals, GPs, and prescriptions universal and free at the point of delivery funded by taxation!',
            examNote: 'The 1911 National Insurance Act excluded most women, children, and the elderly; the 1948 NHS guaranteed universal care from cradle to grave.',
          },
          {
            label: 'Treat her FREE at the point of use under the NHS and administer mass-produced Penicillin (developed by Florey & Chain from Fleming’s 1928 mould)!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '💚 FULL RECOVERY IN 48 HOURS! Fleming spotted the Penicillium mould (1928), Florey & Chain purified it in Oxford (1940), and US/UK wartime funding mass-produced the first true antibiotic!',
            examNote: 'Penicillin combined Individual Genius (Fleming, Florey, Chain), War & Government funding (US/UK WWII), and Science/Tech fermentation.',
          },
          {
            label: 'Perform open exploratory chest surgery to look at her lungs because X-rays and CT scans don’t exist',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩻 Stethoscopes, X-rays, blood tests, and later CT/MRI scans diagnose chest disease non-invasively!',
            examNote: 'Modern high-tech diagnostics (CT, MRI, ultrasound, endoscopes, genetic screening) allow precise diagnosis without exploratory surgery.',
          },
        ],
      },
      {
        patient: '62-Year-Old Persistent Cough & Chest Shadow (Modern Oncology)',
        ailment: 'Suspected early-stage lung tumour—the UK’s second biggest cancer killer.',
        avatarMood: 'modern-scan',
        prompt: 'How do modern NHS high-tech DIAGNOSIS, TREATMENT, and Government PREVENTION combine here?',
        options: [
          {
            label: 'Confirm via CT/PET scan + bronchoscopy biopsy, treat with targeted radiotherapy/keyhole lobectomy, & back government smoking bans/plain packaging!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🔬 GOLD-STANDARD MODERN MEDICINE! Early CT detection + keyhole robotics + government anti-smoking legislation (2007 indoor ban, plain packs, tax) attack cancer from both ends!',
            examNote: 'Edexcel Case Study (Lung Cancer): High-tech diagnosis (CT/PET/bronchoscopy), combined treatment (keyhole surgery, radiotherapy, chemo, immunotherapy), and active state prevention.',
          },
          {
            label: 'Prescribe a course of Penicillin to dissolve the tumour',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧬 Cancer is mutated human cells (DNA damage), NOT a bacterial infection—antibiotics do nothing against cancer!',
            examNote: 'Understanding DNA (Crick, Watson, Franklin & Wilkins, 1953) unlocked genetic screening and targeted cancer immunotherapies, whereas antibiotics only target bacteria.',
          },
          {
            label: 'Run TV adverts claiming cigarettes "soothe the throat" like in the 1940s',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🚭 TV cigarette adverts were banned in 1965 (and all tobacco ads in 2002) once Richard Doll proved the smoking-lung cancer link!',
            examNote: 'Modern governments intervene actively in lifestyle prevention (Clean Air Acts 1956, smoking bans 2007, vaccination & screening campaigns).',
          },
        ],
      },
      {
        patient: 'FINAL BOSS: Ward Outbreak of MRSA + Patient Demanding Antibiotics for Flu!',
        ailment: 'Two crises at once: a sneezing viral flu patient demands penicillin, while a post-op patient has antibiotic-resistant MRSA!',
        avatarMood: 'superbug',
        prompt: 'Final Career Exam! How do you defeat the 21st-century Antibiotic Resistance crisis?',
        options: [
          {
            label: 'Hand out double-strength antibiotics for every viral cold and skip handwashing between beds',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦠 SUPERBUG APOCALYPSE! Over-prescribing antibiotics breeds resistant bacteria through natural selection!',
            examNote: 'Fleming himself warned in 1945 that misusing penicillin would select for resistant strains like MRSA.',
          },
          {
            label: 'Refuse antibiotics for viral flu, enforce strict aseptic isolation/hand-hygiene for MRSA, & use DNA-targeted lab sensitivity testing!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🏆 IMMORTAL SURGEON-GENERAL! Zero unnecessary prescriptions, MRSA contained, and 800 years of medical history mastered!',
            examNote: 'Modern hospitals combat superbugs (MRSA, C. diff) via antibiotic stewardship, strict hygiene/screening, and research into new classes of drugs.',
          },
          {
            label: 'Bring back the 1348 shaved chicken just in case',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🐔 Respectfully, the NHS Infection Control Matron just escorted both you and the chicken out of the building!',
            examNote: 'Evidence-based clinical trials and microbiological testing govern all modern NHS treatments.',
          },
        ],
      },
    ],
    shiftFootnote: 'Modern NHS Shift Complete! From 0/3 saved in 1348 to precision DNA & NHS care!',
  },
];

const ERA_DIORAMAS = {
  medieval: {
    img: '/images/arcade/quacks_1_medieval.webp',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 24, y: 74, label: '🧪 Matula Flask', quip: 'Uroscopy Check: Glowing amber-red! Galen says excess hot blood—fetch the pewter bleeding bowl (and try not to taste it unless the Guild Master is looking)!' },
      { x: 36, y: 69, label: '🪱 Leech Jar', quip: 'Fresh river leeches! Guaranteed to drain "corrupt humours" and 40% of your patient’s remaining willpower.' },
      { x: 71, y: 83, label: '♈ Zodiac Scroll', quip: 'Rule #1 of 1348 Surgery: NEVER bleed a body part while the Moon stands in its ruling constellation!' },
      { x: 85, y: 47, label: '🐔 Plague Chicken', quip: 'The chicken glares sideways at you. Somehow it already knows what medieval doctors strap to buboes.' },
    ],
  },
  renaissance: {
    img: '/images/arcade/quacks_2_renaissance.webp',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 23, y: 77, label: '🎭 Beaked Mask', quip: '1665 Plague Mask: Stuffed with dried lavender and theriac spices to block "Miasma"—completely useless against rat fleas, 10/10 for terrifying the neighbours!' },
      { x: 51, y: 29, label: '🦴 Vesalius Chart', quip: 'De Humani Corporis Fabrica (1543): One human jawbone, solid heart septum—Galen was dissecting monkeys all along!' },
      { x: 67, y: 69, label: '🌿 Cinchona Bark', quip: 'Peruvian "Jesuits’ Bark" (Quinine): Championed by Thomas Sydenham—wait a minute, a Renaissance remedy that ACTUALLY cures malaria?!' },
    ],
  },
  industrial: {
    img: '/images/arcade/quacks_3_industrial.webp',
    fxClass: 'diorama-mist-glow',
    hotspots: [
      { x: 14, y: 60, label: '🔧 Broad St Pump', quip: 'John Snow’s 1854 Trophy: Removing this Soho pump handle stopped cholera cold—even before Pasteur’s 1861 Germ Theory!' },
      { x: 35, y: 80, label: '💉 Cowpox Lancets', quip: 'Edward Jenner’s 1796 Smallpox Vaccination kit—compulsory across Britain from 1852!' },
      { x: 68, y: 72, label: '💨 Carbolic Spray', quip: 'Joseph Lister’s 1865 Carbolic Acid Steam Sprayer: Smells like Carlisle sewage works, cracks your knuckles yellow, and slashes surgical sepsis from 46% to 15%!' },
    ],
  },
  ramc: {
    img: '/images/arcade/quacks_4_ramc.webp',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 15, y: 71, label: '🧊 Citrated Blood & Tubes', quip: '1917 Cambrai Blood Depot: Sodium citrate stops clotting on ice for 26 days, alongside Carrel-Dakin sterilised salt tubes to fight Flanders gas gangrene!' },
      { x: 70, y: 45, label: '🚑 FANY Ambulance', quip: 'First Aid Nursing Yeomanry (FANY) volunteer drivers braving shell-pocked Ypres roads to rush casualties from the ADS to the CCS!' },
      { x: 80, y: 81, label: '🦿 Thomas Splint', quip: 'Sir Robert Jones’s game-changer (Dec 1915): Pulls shattered femurs straight in traction—raising survival from 20% to a staggering 82%!' },
    ],
  },
  modern: {
    img: '/images/arcade/quacks_5_modern.webp',
    fxClass: '',
    hotspots: [
      { x: 16, y: 82, label: '💊 Mass Penicillin', quip: 'Spotted by Fleming (1928), purified by Florey & Chain in Oxford (1940), and mass-produced by US/UK wartime factories—the first true antibiotic!' },
      { x: 27, y: 38, label: '🔬 CT Scanner', quip: '3D cross-sectional X-ray imaging—diagnosing deep lung tumours without a single scalpel cut!' },
      { x: 72, y: 73, label: '💚 NHS Monitor', quip: '5 July 1948: Aneurin Bevan’s National Health Service—universal care free at the point of delivery (just don’t hand antibiotics to that sneezing viral cold patient!).' },
    ],
  },
};

function renderEraSceneSVG(shift, currentCase, activeInspectText) {
  const dio = ERA_DIORAMAS[shift.id] || ERA_DIORAMAS.medieval;
  const activeNode = currentCase?.highlightNode ?? 1;
  const ramcStrip =
    shift.id === 'ramc'
      ? `
      <div style="position:absolute;top:10px;left:10px;right:10px;display:flex;gap:6px;flex-wrap:wrap;z-index:4;">
        ${['1. RAP (200m Front)', '2. ADS (Triage)', '3. CCS (X-Ray & Blood)', '4. Base Hospital'].map(
          (lbl, i) => `
            <span style="flex:1 1 110px;text-align:center;padding:4px 8px;border-radius:7px;font-size:0.7rem;font-weight:900;background:${i === activeNode ? 'rgba(234,179,8,0.92)' : 'rgba(15,23,42,0.85)'};color:${i === activeNode ? '#0f172a' : '#cbd5e1'};border:1.5px solid ${i === activeNode ? '#fef08a' : '#475569'};backdrop-filter:blur(4px);">
              ${i === activeNode ? '📍 ' : ''}${lbl}
            </span>
          `,
        ).join('')}
      </div>
    `
      : '';

  return `
    <div class="diorama-viewport" id="qac-svg-stage">
      <img src="${dio.img}" alt="${shift.eraTitle}" class="diorama-img" />
      <div class="diorama-vignette"></div>
      ${dio.fxClass ? `<div class="${dio.fxClass}"></div>` : ''}
      ${ramcStrip}
      ${dio.hotspots
        .map(
          (h, idx) => `
          <button type="button" class="diorama-hotspot qac-hotspot-btn" data-hidx="${idx}" style="left:${h.x}%;top:${h.y}%;">
            ${h.label}
          </button>
        `,
        )
        .join('')}
      ${
        activeInspectText
          ? `<div class="diorama-inspect-toast">🔍 ${activeInspectText}</div>`
          : ''
      }
    </div>
  `;
}

export function mountQuacksAndCures(stageEl, pools, ctx = {}) {
  const unitId = ctx.unitId || 'edexcel_medicine';
  let shiftIdx = 0;
  let caseIdx = 0;
  let score = 0;
  let orthodoxyHits = 0;
  let totalDecisions = 0;
  let activeInspectText = '';
  let answeredOutcome = null;
  // Track patients saved per shift: [0, 0, 0, 0, 0]
  let savedByShift = SHIFTS.map(() => 0);
  let pb = getArcadePersonalBest(unitId, 'quacks', 'all');

  function restartCareer() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    shiftIdx = 0;
    caseIdx = 0;
    score = 0;
    orthodoxyHits = 0;
    totalDecisions = 0;
    activeInspectText = '';
    answeredOutcome = null;
    savedByShift = SHIFTS.map(() => 0);
    render();
  }

  function pickOption(optIdx) {
    if (answeredOutcome) return;
    const shift = SHIFTS[shiftIdx];
    const curCase = shift.cases[caseIdx];
    const chosen = curCase.options[optIdx];
    if (!chosen) return;

    totalDecisions++;
    const qId = generateQuestionId(unitId, shift.eraBadge, curCase.prompt);

    if (chosen.isOrthodox) {
      orthodoxyHits++;
      score += 200;
      if (chosen.survived) {
        savedByShift[shiftIdx]++;
        score += 50;
      }
      arcadeAudio.correct();
      recordQuestionResult(
        qId,
        true,
        {
          id: qId,
          q: `${shift.eraBadge}: ${curCase.prompt}`,
          a: chosen.label,
          source: shift.eraTitle,
          explanation: chosen.examNote,
        },
        unitId,
      );
    } else {
      arcadeAudio.wrong();
      const rightOpt = curCase.options.find((o) => o.isOrthodox);
      recordQuestionResult(
        qId,
        false,
        {
          id: qId,
          q: `${shift.eraBadge}: ${curCase.prompt}`,
          a: rightOpt ? rightOpt.label : '',
          source: shift.eraTitle,
          explanation: chosen.examNote,
        },
        unitId,
      );
    }

    answeredOutcome = {
      chosen,
      optIdx,
    };
    render();
  }

  function advanceNext() {
    const shift = SHIFTS[shiftIdx];
    answeredOutcome = null;
    activeInspectText = '';
    if (caseIdx + 1 < shift.cases.length) {
      caseIdx++;
      render();
    } else if (shiftIdx + 1 < SHIFTS.length) {
      shiftIdx++;
      caseIdx = 0;
      arcadeAudio.levelUp();
      render();
    } else {
      renderCareerReport();
    }
  }

  function render() {
    const shift = SHIFTS[shiftIdx];
    const curCase = shift.cases[caseIdx];
    const totalSavedSoFar = savedByShift.reduce((a, b) => a + b, 0);
    const shiftSaved = savedByShift[shiftIdx];

    stageEl.innerHTML = `
      <div class="qac-wrap" style="max-width:920px;margin:0 auto;">
        <!-- Shift Progress Pills -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
          ${SHIFTS.map(
            (s, idx) => `
              <span style="flex:1 1 130px;text-align:center;padding:6px 10px;border-radius:8px;font-size:0.74rem;font-weight:800;border:1.5px solid ${idx === shiftIdx ? s.accent : '#334155'};background:${idx === shiftIdx ? 'rgba(255,255,255,0.08)' : '#0f172a'};color:${idx === shiftIdx ? '#ffffff' : idx < shiftIdx ? '#34d399' : '#64748b'};">
                ${idx < shiftIdx ? '✅ ' : idx === shiftIdx ? '🩺 ' : ''}${s.id === 'ramc' ? '1917 RAMC' : s.id.charAt(0).toUpperCase() + s.id.slice(1)} (${savedByShift[idx]}/${s.cases.length} Saved)
              </span>
            `,
          ).join('')}
        </div>

        <!-- Dual Gauges HUD -->
        <div class="tlb-hud" style="border-color:${shift.accent};">
          <div class="tlb-stat"><span>Career Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>📜 Period Accuracy</span><strong class="amber">${orthodoxyHits}/${totalDecisions}</strong></div>
          <div class="tlb-stat"><span>💀 This Era Saved</span><strong class="${shiftSaved > 0 ? 'green' : ''}">${shiftSaved} / ${shift.cases.length}</strong></div>
          <div class="tlb-stat"><span>Total Lives Saved</span><strong class="green">${totalSavedSoFar} / 15</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <!-- Animated Interactive SVG Clinic / Trench Stage -->
        <div style="background:${shift.bgGrad};border:2px solid ${shift.accent};border-radius:16px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <span style="background:rgba(0,0,0,0.45);border:1px solid ${shift.accent};color:#fde047;padding:3px 10px;border-radius:999px;font-size:0.74rem;font-weight:900;">
              ${shift.eraBadge} • PATIENT ${caseIdx + 1} OF ${shift.cases.length}
            </span>
            <span style="font-size:0.76rem;color:#cbd5e1;font-weight:600;">
              <i class="fa-solid fa-hand-pointer" style="color:${shift.accent};"></i> ${shift.propHint}
            </span>
          </div>

          <div>
            ${renderEraSceneSVG(shift, curCase, activeInspectText)}
          </div>
        </div>

        <!-- Patient Case File & Prescription Choices -->
        <div style="background:#111827;border:1.5px solid #334155;border-radius:16px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
            <div>
              <div style="font-size:0.74rem;font-weight:800;text-transform:uppercase;color:${shift.accent};">PATIENT ON THE COUCH</div>
              <h3 style="margin:2px 0 0 0;font-size:1.25rem;color:#ffffff;">${curCase.patient}</h3>
            </div>
            <span style="background:#1e293b;border:1px solid #475569;color:#cbd5e1;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:6px;">
              Inspector: ${shift.inspectorTitle}
            </span>
          </div>

          <div style="background:#0b1120;border-left:4px solid #ef4444;border-radius:8px;padding:11px 14px;margin-bottom:14px;color:#fecaca;font-size:0.93rem;line-height:1.45;">
            <strong>Symptoms &amp; Situation:</strong> &ldquo;${curCase.ailment}&rdquo;
          </div>

          <p style="margin:0 0 12px 0;font-weight:800;color:#f8fafc;font-size:0.98rem;">
            ${curCase.prompt}
          </p>

          <div style="display:flex;flex-direction:column;gap:10px;">
            ${curCase.options
              .map((opt, idx) => {
                let cls = '';
                if (answeredOutcome) {
                  if (opt.isOrthodox) cls = 'right';
                  else if (answeredOutcome.optIdx === idx) cls = 'wrong';
                }
                return `
                  <button type="button" class="bsp-opt-btn qac-opt-btn ${cls}" data-idx="${idx}" ${answeredOutcome ? 'disabled' : ''}>
                    <span class="bsp-key">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt.label}</span>
                  </button>
                `;
              })
              .join('')}
          </div>

          ${
            answeredOutcome
              ? `
            <div style="margin-top:16px;background:${answeredOutcome.chosen.isOrthodox ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'};border:1.5px solid ${answeredOutcome.chosen.isOrthodox ? '#10b981' : '#ef4444'};border-radius:12px;padding:14px 16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
                <strong style="color:${answeredOutcome.chosen.isOrthodox ? '#6ee7b7' : '#fca5a5'};font-size:0.96rem;">
                  ${answeredOutcome.chosen.inspectorQuip}
                </strong>
                <span style="background:#0f172a;border:1px solid #475569;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:800;color:${answeredOutcome.chosen.survived ? '#34d399' : '#f87171'};">
                  ${answeredOutcome.chosen.survived ? '💚 PATIENT LIVED!' : '💀 PATIENT DIED!'}
                </span>
              </div>
              <p style="margin:0 0 12px 0;font-size:0.85rem;color:#cbd5e1;line-height:1.45;">
                <strong>🎓 Edexcel Paper 1 Exam Link:</strong> ${answeredOutcome.chosen.examNote}
              </p>
              <button type="button" class="arcade-btn-primary" id="qac-next-btn">
                ${
                  caseIdx + 1 < shift.cases.length
                    ? 'See Next Patient'
                    : shiftIdx + 1 < SHIFTS.length
                      ? `Advance Time Machine → ${SHIFTS[shiftIdx + 1].eraBadge.split('•')[1].trim()}`
                      : 'View 800-Year Career Report Card'
                }
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.qac-hotspot-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dio = ERA_DIORAMAS[shift.id] || ERA_DIORAMAS.medieval;
        const h = dio.hotspots[parseInt(btn.dataset.hidx, 10)];
        if (h) {
          activeInspectText = h.quip;
          arcadeAudio.zoom();
          render();
        }
      });
    });

    stageEl.querySelector('#qac-svg-stage')?.addEventListener('click', () => {
      const dio = ERA_DIORAMAS[shift.id] || ERA_DIORAMAS.medieval;
      if (dio.hotspots.length > 0) {
        activeInspectText = dio.hotspots[0].quip;
        arcadeAudio.zoom();
        render();
      }
    });

    stageEl.querySelectorAll('.qac-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => pickOption(parseInt(btn.dataset.idx, 10)));
    });

    stageEl.querySelector('#qac-next-btn')?.addEventListener('click', advanceNext);
  }

  function renderCareerReport() {
    arcadeAudio.levelUp();
    const { isNewBest, best } = saveArcadePersonalBest(unitId, 'quacks', 'all', score);
    pb = best;
    const totalSaved = savedByShift.reduce((a, b) => a + b, 0);
    addXp(Math.min(150, orthodoxyHits * 10), 'Quacks & Cures 800-Year Career');

    const rank =
      orthodoxyHits >= 13
        ? '👑 Immortal Surgeon-General of the NHS'
        : orthodoxyHits >= 10
          ? '🩺 Fellow of the Royal Society & RAMC'
          : '🐔 Master of the Medieval Plague Chicken';

    stageEl.innerHTML = `
      <div class="arcade-result-panel" style="max-width:780px;margin:0 auto;">
        <div style="font-size:2.8rem;margin-bottom:4px;">${isNewBest ? '🏆' : '🩺'}</div>
        <h3>800-Year Medical Career Complete!</h3>
        <div style="display:inline-block;background:rgba(56,189,248,0.15);border:1.5px solid #38bdf8;color:#bae6fd;font-weight:800;padding:5px 16px;border-radius:999px;margin-bottom:14px;">
          Rank Awarded: ${rank}
        </div>

        <div class="arcade-gameover-stats">
          <div><span>Career Score</span><strong>${score}</strong></div>
          <div><span>Period Accuracy</span><strong>${orthodoxyHits} / 15</strong></div>
          <div><span>Patients Saved</span><strong>${totalSaved} / 15</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>

        <!-- Visual Era-by-Era Survival Bar Graph -->
        <div style="background:#0f172a;border:1.5px solid #334155;border-radius:14px;padding:16px 20px;text-align:left;margin-bottom:20px;">
          <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;color:#fde047;margin-bottom:10px;">
            📊 Edexcel Paper 1 Change &amp; Continuity — Patients Saved by Era:
          </div>
          ${SHIFTS.map((s, idx) => {
            const pct = Math.round((savedByShift[idx] / s.cases.length) * 100);
            return `
              <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:#e2e8f0;margin-bottom:3px;">
                  <span><strong>${s.eraBadge.split('•')[1].trim()}</strong></span>
                  <span style="color:${pct === 0 ? '#f87171' : '#34d399'};font-weight:800;">${savedByShift[idx]}/${s.cases.length} Saved (${pct === 0 && idx === 0 ? '0% — Historical Reality!' : pct + '%'})</span>
                </div>
                <div style="height:9px;background:#1e293b;border-radius:999px;overflow:hidden;">
                  <div style="height:100%;width:${Math.max(4, pct)}%;background:${s.accent};border-radius:999px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button type="button" class="arcade-btn-primary" id="qac-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Start Another 800-Year Career
        </button>
      </div>
    `;

    stageEl.querySelector('#qac-replay-btn')?.addEventListener('click', restartCareer);
  }

  render();
  return () => {};
}
