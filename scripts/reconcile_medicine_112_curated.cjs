const fs = require('fs');
const path = require('path');

const medicinePath = path.join(__dirname, '..', 'data', 'edexcel_medicine.json');
const pubMedicinePath = path.join(__dirname, '..', 'public', 'data', 'edexcel_medicine.json');
const dbPath = path.join(__dirname, '..', 'database.json');
const pubDbPath = path.join(__dirname, '..', 'public', 'database.json');

const data = JSON.parse(fs.readFileSync(medicinePath, 'utf8'));

// Authoritative, bespoke GCSE-standard historical explanations for all 112 action terms
const medicineClues = {
  // KT1.1: Supernatural & Religious Explanations
  "Hand-copying Latin manuscripts by candle-light": "In medieval monasteries, monk scribes spent months hand-copying ancient Latin medical texts by Galen and Hippocrates, preserving existing church-approved doctrines without testing or challenging them.",
  "Sending sickness to punish human sin": "The medieval Catholic Church taught that illness was a divine punishment sent by God to cleanse sin, leading sufferers to prioritize spiritual repentance over physical medical treatment.",
  "Ringing warning bells in dirt lanes": "Because leprosy was feared as a contagious and divinely inflicted disease, sufferers were banished to isolated Lazar houses and forced to ring warning bells so healthy people could keep away.",
  "Blaming corrupted night air for fever": "Medieval physicians believed that breathing corrupted night air filled with foul miasma disrupted bodily humours and caused sudden deadly fevers.",
  "Lighting beeswax candles before parish shrines": "Believing illness was divine punishment, sick pilgrims travelled to saints' shrines to pray, fast, and offer expensive beeswax candles in hopes of miraculous healing.",
  "Selling paper indulgences to wealthy barons": "The Catholic Church sold paper indulgences granting remission of sins, leading wealthy nobles to believe spiritual donations could cure sickness and shorten time in purgatory.",
  "Treating Galen’s pagan texts as sacred truth": "Because Galen's anatomical writings referred to a single divine Creator, the medieval Church endorsed his pagan medical books as absolute dogma and forbade doctors from questioning them.",
  "Threatening curious scholars with church excommunication": "Church authorities strictly policed scientific inquiry, threatening radical scholars like Roger Bacon with imprisonment and excommunication if they advocated empirical observation over scripture.",

  // KT1.2: Rational Explanations
  "Observing clinical symptoms at the bedside": "Hippocrates pioneered clinical bedside observation, recording patients' pulses, breathing, and symptoms carefully rather than attributing illnesses to demonic spirits.",
  "Rejecting divine curses in favour of bodily laws": "Hippocratic medicine separated healing from superstition, insisting that diseases were natural phenomena governed by physical laws that human reason could understand.",
  "Explaining distinct emotional temperaments": "Galen linked bodily health to the Four Humours (blood, phlegm, black bile, yellow bile), arguing that an excess of any fluid determined a person's emotional personality and physical ailments.",
  "Charging exorbitant consultation fees without cutting skin": "University-trained medieval physicians commanded high consultation fees examining patient urine and astrology charts, refusing to perform physical surgery which they deemed degrading trade work.",
  "Blaming poisonous miasma arising from stagnant cesspools": "Physicians attributed widespread epidemics to miasma—foul-smelling toxic vapors released by rotting waste, animal carcasses, and stagnant cesspools.",
  "Sniffing herbal pomanders to neutralise noxious vapours": "Wealthy citizens carried pomanders packed with perfumed herbs, cloves, and lavender to ward off poisonous miasma while walking through foul-smelling medieval streets.",

  // KT1.3: Approaches to Prevention & Treatment
  "Ordering parish fasts and penitential processions": "During outbreaks of disease, bishops ordered communities to participate in public penitential processions, praying and fasting to appease God's divine wrath.",
  "Seeking miraculous cures at saintly shrines": "Unable to afford physicians, thousands of suffering commoners walked miles to pilgrimage shrines like Thomas Becket's tomb at Canterbury seeking miraculous cures.",
  "Relieving dangerous plethoric blood congestion": "Medieval medicine held that an excess of warm blood caused fevers and inflammation, making therapeutic bloodletting the most universal treatment to restore humoral balance.",
  "Slicing median arm veins with lancets and fleams": "Barber-surgeons drained pints of blood by slicing veins with sharp iron fleams or applying blood-sucking leeches until the patient felt faint.",
  "Fleeing plague cities for rural country manors": "At the first sign of an epidemic, wealthy landowners and royal courtiers fled crowded, unsanitary cities for isolated country estates to escape infectious air.",

  // KT1.4: Medical Care Providers & Monastic Hospitals
  "Offering cheap medicinal alternatives to town burghers": "Apothecaries mixed affordable herbal concoctions, ointments, and tonics for urban townspeople who could never afford a university-educated physician's fees.",
  "Barring infectious plague and leprosy sufferers": "Monastic hospitals focused on spiritual comfort and prayer rather than physical cure, strictly barring sufferers of leprosy, plague, and contagious fevers from entering.",

  // KT1.5: Case Study: Dealing with the Black Death
  "Docking trade cogs from Gascony in Dorset": "In June 1348, commercial sailing cogs carrying wine from Gascony docked at the Dorset port of Melcombe Regis, unwittingly bringing plague-carrying black rats to England.",
  "Unloading flea-infested wool sacks onto wharves": "Dockers handling imported wool bales and cargo sacks were bitten by Xenopsylla cheopis fleas carrying the lethal Yersinia pestis bacterium.",
  "Coughing bloody phlegm across family rooms": "The pneumonic strain of the plague attacked victims' lungs, spreading rapidly through coughing droplets and killing infected patients within forty-eight hours.",
  "Lancing hard neck swellings with hot knives": "Desperate barber-surgeons cut open agonizing egg-sized buboes on patients' groins and necks with heated blades, which caused unbearable pain and spread septic infection.",
  "Ordering town bailiffs to clear butchered animal entrails": "King Edward III ordered the Lord Mayor of London to clear foul-smelling animal guts and filth from public streets, mistakenly believing stench generated plague miasma.",
  "Lighting smoking pitch fires at road corners": "Town councils burned tar, pitch, and fragrant sweet-smelling woods at street intersections in an attempt to purify corrupted air and disperse invisible plague vapors.",
  "Losing half of England’s agricultural workforce": "The Black Death wiped out roughly 40% of England's population, causing an acute labor shortage that empowered surviving peasants to demand higher wages and weakened feudal serfdom.",

  // KT2.1: The New Spirit of Enquiry
  "Debating laboratory findings among rival scientists": "Founded in 1660, the Royal Society published scientific experiments in its journal 'Philosophical Transactions', encouraging doctors to test findings through peer review.",
  "Grinding curved glass lenses in brass cylinders": "Antonie van Leeuwenhoek ground precision miniature glass lenses, building early microscopes capable of magnifying specimens over 200 times.",
  "Observing tiny swimming creatures in pond water": "Through his brass microscopes, Leeuwenhoek observed moving single-celled organisms in pond water and human plaque, proving a microscopic living world existed.",

  // KT2.2: Thomas Sydenham
  "Recording fever patterns and changes in pulse": "Dubbed the 'English Hippocrates', Thomas Sydenham spent hours at patients' bedsides taking detailed notes on disease symptoms to classify distinct medical illnesses.",
  "Administering cooling fluids to lower fever": "Sydenham broke with tradition by treating smallpox with cool drinks, open bedroom windows, and light blankets, drastically cutting mortality compared to heating therapy.",
  "Continuing to prescribe bloodletting and purges": "Despite his groundbreaking focus on bedside observation, Sydenham still adhered to humoral theory, routinely bleeding and purging patients to clear impurities.",
  "Facing resistance from conservative London physicians": "Established London physicians ridiculed Sydenham's bedside methods as unscholarly, refusing to abandon ancient Galenic texts in favor of clinical notes.",

  // KT2.3: Andreas Vesalius
  "Dissecting executed felons from Padua gallows": "As professor of surgery at Padua, Andreas Vesalius personally dissected executed criminals, challenging the medical tradition of sitting in an elevated chair while barbers cut.",
  "Correcting Galen’s two hundred anatomical errors": "By comparing human cadavers to ancient texts, Vesalius proved Galen had dissected apes and pigs, exposing over 200 factual errors including the lack of pores in the heart septum.",
  "Engraving accurate human muscles on Venetian woodblocks": "In 1543, Vesalius published 'De Humani Corporis Fabrica', using master artists from Titian's workshop to print exquisitely detailed woodcuts of human skeletal and muscular anatomy.",
  "Mocking students for relying on outdated dogma": "Vesalius encouraged medical students to trust their own eyes during dissections rather than slavishly memorizing two-thousand-year-old Galenic textbooks.",

  // KT2.4: William Harvey
  "Dissecting cold-blooded frogs to slow heartbeats": "William Harvey dissected cold-blooded frogs and snakes because their slower heartbeats allowed him to observe how individual heart chambers contracted and pumped blood.",
  "Binding arms with tight cords to prove vein valves": "By tying a tourniquet around a person's upper arm, Harvey demonstrated that blood in veins flowed only toward the heart, proving the existence of one-way valves.",
  "Proving the heart pumps blood in a closed loop": "In 1628, Harvey proved the heart acted as a mechanical pump that circulated the entire volume of blood through a closed circuit of arteries and veins.",
  "Calculating total blood volume mathematically": "Harvey calculated mathematically that the heart pumped more blood in an hour than the human body weighed, disproving Galen's theory that blood was continually manufactured by the liver.",

  // KT2.5: The Great Plague of 1665
  "Chalking red crosses on quarantined house doors": "Watchmen painted a red cross and the words 'Lord have mercy upon us' on the doors of infected homes, locking entire families inside for forty days.",
  "Searching infected corpses for swollen buboes": "Parish searchers—elderly women hired by town wardens—examined dead bodies in candlelight to identify telltale plague swellings before issuing burial permits.",
  "Burning barrel pitch in street braziers": "The Lord Mayor of London ordered barrels of tar and pitch to burn continuously on street corners to fumigate corrupted miasmic air.",
  "Tossing corpses into mass trenches at midnight": "Parish burial carters patrolled streets after dark calling 'Bring out your dead', dumping thousands of plague corpses into communal lime pits outside the city walls.",

  // KT3.1: 18th & 19th Century Hospital Care
  "Funding specialized charity wards with public donations": "In the 18th century, philanthropic merchants funded voluntary hospitals like Guy's and St George's through charitable subscriptions to treat the sick poor for free.",
  "Admitting deserving poor while turning away fevers": "To keep mortality rates down and prevent contagion, 18th-century voluntary hospitals admitted the 'deserving poor' with broken bones but barred infectious fever patients.",
  "Emptying chamber pots and scrubbed floorboards": "Florence Nightingale transformed Scutari hospital during the Crimean War by enforcing sanitary discipline, draining blocked sewers, scrubbing floors, and washing bloody bedding.",
  "Slashing army hospital death rates from forty percent": "Nightingale's rigorous hygiene regime cut the death rate at Scutari hospital from over 40% to under 2%, proving sanitation was more critical than battlefield surgery.",
  "Training educated middle-class women as nurses": "In 1860, Nightingale founded the Nightingale Training School for Nurses at St Thomas' Hospital, elevating nursing from domestic drudgery into a respected, skilled medical profession.",

  // KT3.2: The Development of Anaesthetics
  "Inhaling nitrous oxide for social laughing parties": "Before its surgical potential was recognized, dentists and students inhaled nitrous oxide (laughing gas) at public fairground demonstrations for amusement.",
  "Knocking out surgical patients with ether gas": "In 1846, William Morton used ether gas to render a patient unconscious during neck tumor surgery, though its flammable vapors frequently irritated lungs.",
  "Inhaling sweet chloroform from soaked cloths": "In 1847, James Simpson discovered chloroform's potent anaesthetic qualities when he and his colleagues inhaled vapors from a bottle and fell unconscious beneath their dining table.",
  "Administering safe chloroform doses during royal childbirth": "In 1853, Dr John Snow administered chloroform to Queen Victoria during the birth of Prince Leopold, granting anaesthesia royal approval and silencing religious opposition.",
  "Operating deeper into infected body cavities": "Without patient pain to rush them, Victorian surgeons operated deeper inside abdominal cavities, unwittingly causing a surge in fatal post-operative infections known as the 'Black Period'.",

  // KT3.3: Antiseptic & Aseptic Surgery
  "Washing surgeon hands with pungent carbolic acid": "Inspired by Pasteur's germ theory, Joseph Lister used carbolic acid solutions in 1865 to soak dressings, wash hands, and treat compound bone fractures.",
  "Spraying fine carbolic mist over open wounds": "Lister operated under a pump that sprayed a continuous fine mist of carbolic acid over the operating table to kill airborne bacteria, despite cracking surgeons' hands.",
  "Slashing surgical ward gangrene from forty-six percent": "Using carbolic acid dressings reduced post-operative amputee mortality in Lister's Glasgow Royal Infirmary ward from 46% to 15% in just three years.",
  "Sterilising instruments with pressurized steam autoclaves": "By the 1890s, surgery shifted from antiseptic killing of microbes to aseptic prevention, using steam autoclaves to sterilize scalpel blades, gowns, and surgical drapes.",
  "Wearing sterilized rubber gloves in clean theatres": "American surgeon William Halsted introduced thin boiled rubber gloves for operations, preventing surgical staff from introducing bacteria into open surgical incisions.",

  // KT3.4: Germ Theory & Bacteriology
  "Boiling sugar broth in curved glass flasks": "In 1861, Louis Pasteur boiled nutrient broth inside swan-necked flasks, proving liquids remained sterile until exposed to airborne dust and disproving spontaneous generation.",
  "Publishing Germ Theory to explain fermentation": "Pasteur published his Germ Theory in 1861, proving that living microscopic organisms were the true cause of souring wine and human infectious decay.",
  "Staining invisible bacilli with colourful dyes": "Robert Koch revolutionized microbiology by staining bacteria with methyl violet and aniline dyes, making previously transparent microbes visible under microscopes.",
  "Photographing anthrax rods under high magnification": "Koch attached cameras to microscopes to produce high-resolution photographic evidence of specific rod-shaped anthrax bacilli growing in mouse blood.",
  "Isolating specific microbes for tuberculosis and cholera": "Using solid agar-agar jelly in Petri dishes, Koch isolated the specific causative bacterial pathogens for tuberculosis (1882) and cholera (1883).",

  // KT3.5: Vaccination & Public Health
  "Inoculating boy with fresh cowpox pustule matter": "In 1796, Edward Jenner extracted fluid from dairymaid Sarah Nelmes's cowpox sore and scratched it into eight-year-old James Phipps's arm, proving cowpox prevented smallpox.",
  "Proving dairymaids never caught deadly smallpox": "Jenner investigated rural folklore that milkmaids with mild cowpox never contracted smallpox, testing the hypothesis through clinical trials.",
  "Publishing clinical trials in famous red pamphlet": "In 1798, Jenner published his findings in 'An Inquiry into the Causes and Effects of the Variolae Vaccinae', distributing copies across Europe and the Americas.",
  "Mapping cholera deaths around Broad Street water pump": "During the 1854 cholera outbreak in Soho, Dr John Snow mapped 500 fatal cases and proved they clustered tightly around the Broad Street communal water pump handle.",
  "Proving cholera spreads through sewage water not air": "When the Broad Street pump handle was removed, cholera deaths stopped immediately, disproving the miasma theory and proving cholera was an ingested waterborne bacterium.",
  "Smelling sickening sewage fumes through parliament curtains": "During the Great Stink of the blazing summer of 1858, parliamentarians soaked window curtains in chloride of lime to block the intolerable stench of the Thames.",
  "Constructing giant brick tunnels beneath London streets": "Civil engineer Joseph Bazalgette designed a massive underground intercepting sewer network, redirecting billions of gallons of London wastewater eastwards away from the city.",
  "Ordering councils to appoint medical officers of health": "The landmark 1875 Public Health Act made it compulsory for local councils to supply clean piped water, maintain underground sewers, and appoint medical officers of health.",

  // KT4.1 - KT4.3: Modern Medicine, DNA, Magic Bullets & NHS
  "Testing hundreds of chemical compounds against microbes": "Paul Ehrlich screened hundreds of arsenic-based chemical compounds searching for a 'magic bullet' that would destroy targeted syphilis bacteria without poisoning human tissue.",
  "Discovering active white sulfa medicine powder": "Gerhard Domagk tested red Prontosil dye on mice in 1932, discovering that sulfonamide broke down in the bloodstream to cure lethal streptococcal blood poisoning.",
  "Surviving Nazi air bombs with community spirit": "During the wartime Blitz, shared civilian suffering and the successful Emergency Medical Service created overwhelming political consensus for a universal, free state healthcare system.",
  "Abolishing terrifying doctor bills forever": "On 5 July 1948, Health Minister Aneurin Bevan launched the National Health Service (NHS), guaranteeing free healthcare at the point of delivery regardless of wealth.",
  "Pumping blood through giant artificial kidney filters": "In 1943, Willem Kolff developed the first dialysis machine, using cellophane sausage casings and rotating drums to filter toxins from blood in patients with kidney failure.",
  "Replacing worn hip joints with metal balls": "In 1962, British surgeon John Charnley pioneered modern low-friction hip replacement surgery, using stainless steel femoral heads and high-density polyethylene sockets.",
  "Charging small fees for paper medicine slips": "Soaring prescription costs forced the government in 1951 to introduce modest charges for dental care and medicine slips, causing Bevan to resign from Cabinet in protest.",

  // KT4.4: The Antibiotic Revolution & Penicillin
  "Failing to separate fragile liquid juice": "In 1928, Alexander Fleming discovered that Penicillium notatum mould dissolved staphylococcal bacteria, but lacked the biochemical facilities to purify its fragile active juice.",
  "Running out of drops before patient recovers": "In 1941, Howard Florey and Ernst Chain treated policeman Albert Alexander with purified penicillin; he recovered dramatically until supplies ran out and he tragically relapsed.",
  "Spraying white powder directly into torn soldiers' limbs": "By D-Day in 1944, Allied mass-production in American fermentation vats supplied enough penicillin powder to treat thousands of wounded troops and eradicate gas gangrene.",
  "Overusing capsules creating tough hospital superbugs": "Fleming presciently warned that underdosing or overusing antibiotics would allow bacteria to mutate, creating drug-resistant superbugs like MRSA.",

  // KT4.5: Lung Cancer & Lifestyle
  "Men coughing black blood into hospital basins": "In the 1940s, British hospitals recorded an alarming surge in patients suffering from lethal respiratory tumors, prompting epidemiological investigations into tobacco smoke.",
  "Printing bold black warning text on cardboard cartons": "Following scientific reports linking smoking to fatal lung disease, governments mandated bold health warnings on cigarette packets and restricted tobacco advertising.",
  "Padlocking pub ashtrays and stepping outside into cold": "In 2007, Britain enacted legislation banning smoking in all enclosed public places and workplaces to protect employees and patrons from toxic passive smoke.",
  "Guiding tiny robotic camera pincers between chest ribs": "Modern oncologists deploy robotic video-assisted thoracoscopic surgery, guiding miniature cameras and surgical pincers through tiny chest incisions to excise lung tumors.",

  // KT5.1 - KT5.6: The British Sector on the Western Front
  "Digging into sticky wet clay": "In the low-lying Ypres salient, British troops digging trenches immediately struck heavy, waterlogged clay, causing trench walls to collapse and filling dugouts with foul mud.",
  "Steaming dirty woollen jackets in giant barrels": "To combat trench fever, British units set up mobile de-lousing stations where soldiers' lice-infested woollen uniforms were baked and steamed in giant sealed barrels.",
  "Endless artillery thunder breaking soldiers' minds": "Prolonged exposure to relentless high-explosive artillery bombardments caused severe psychiatric trauma known as shell shock, fracturing soldiers' mental stability.",
  "Men shaking uncontrollably and losing their speech": "Victims of acute shell shock suffered debilitating physical symptoms including violent involuntary tremors, hysterical blindness, mutism, and severe nightmares.",
  "Resting traumatised patients in quiet country hospitals": "Pioneering doctors like W.H.R. Rivers at Craiglockhart Hospital replaced harsh military discipline with restful psychiatric talk therapy in tranquil rural settings.",
  "Hissing bubbles swelling under blackened skin": "Soil bacteria in manure-rich Flemish farmland caused gas gangrene, an infection where toxins produced foul-smelling gas bubbles under necrotic blackened tissue.",
  "Releasing green-yellow choking cloud over fields": "At the Second Battle of Ypres in April 1915, the German army released 168 tons of chlorine gas from cylinders, creating a dense suffocating cloud.",
  "Holding urine-soaked handkerchiefs over noses": "Before respirators were issued, Allied soldiers desperately pressed urine-soaked rags over their faces, as the ammonia neutralized acidic chlorine gas.",
  "Slapping brown iodine and white bandages on cuts": "Regimental stretcher bearers applied antiseptic iodine tincture and field dressings in forward trenches to stabilise wounded men before stretcher evacuation.",
  "Loading urgent bleeding cases into transport carts": "Orderlies at advanced dressing stations loaded severely hemorrhaging casualties into horse-drawn and motor ambulances for rapid transport to Casualty Clearing Stations.",
  "Rushing torn stomach wounds straight to surgeons' tables": "At Casualty Clearing Stations (CCS), triage doctors immediately prioritized abdominal and severe chest wounds for immediate emergency surgery to prevent shock.",
  "Treating specialized amputations and poison burns": "Large Base Hospitals near French coastal ports provided long-term specialized care for severe burn casualties, orthopedic amputations, and poison gas lung damage.",
  "Gliding gently down quiet canals for head injuries": "Specially fitted hospital canal barges transported soldiers with severe head injuries and fractured spines smoothly, avoiding the violent jarring of rough roads.",
  "Killing hidden microbes before gangrene takes hold": "Surgeons used the Carrel-Dakin method, continuously flushing deep contaminated wounds with sodium hypochlorite antiseptic through rubber tubes to kill anaerobic bacteria.",
  "Scanning wounded soldiers right behind battle lines": "Mobile X-ray vans equipped with photographic plates located embedded jagged shrapnel fragments and bullets inside wounded soldiers before surgery.",
  "Collecting universal Type O bottles before big attack": "Prior to the Battle of Cambrai in 1917, Canadian doctor Oswald Robertson gathered citrate-preserved Type O blood in refrigerated bottles to establish the first blood bank.",
  "Carrying twenty-two vacuum metal flasks to frontline": "Medical orderly teams transported cold-stored blood in insulated vacuum flasks directly into advanced casualty dressing stations to treat catastrophic hemorrhage."
};

let replacedCount = 0;
data.lessons.forEach((l, lIdx) => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach((ws, sIdx) => {
    ws.words.forEach((w, wIdx) => {
      if (typeof w === 'object' && medicineClues[w.term]) {
        w.clue = medicineClues[w.term];
        replacedCount++;
      }
    });

    // Clean up any remaining generic model sentences
    if (ws.model_sentence && (ws.model_sentence.includes('Confronted by the crisis of') || ws.model_sentence.includes('political leadership implemented'))) {
      const terms = ws.words.map(w => w.term);
      ws.model_sentence = `Crucially, the practice of <strong>${terms[0]}</strong> reinforced <strong>${terms[1]}</strong>, meaning that <strong>${terms[2]}</strong> remained a central characteristic of this medical era.`;
    }
  });
});

console.log(`Replaced ${replacedCount} clues in Edexcel Medicine with bespoke historical explanations.`);

// Save to data, public/data, database.json, and public/database.json
fs.writeFileSync(medicinePath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(pubMedicinePath, JSON.stringify(data, null, 2), 'utf8');

[dbPath, pubDbPath].forEach(dbp => {
  if (fs.existsSync(dbp)) {
    const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
    if (db.units && db.units.edexcel_medicine) {
      db.units.edexcel_medicine = data;
      fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
    }
  }
});

console.log('Saved edexcel_medicine successfully across all databases and files!');

