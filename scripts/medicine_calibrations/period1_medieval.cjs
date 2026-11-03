/**
 * Period 1 Calibrated Texts: Medieval Britain c1250–c1500 (Lessons 1–5)
 * Completely repairs duplicate blocks in L2, L3, L4, L5.
 * Adds standard <span class="para-ref">[X.1]</span> formatting.
 * Target: ~580–650 words per lesson (avg ~120–135 words per block).
 */

module.exports = {
  // Lesson 1 (index 0): Supernatural Explanations
  0: [
    {
      id: "block_1",
      title: "The Catholic Church and Divine Retribution",
      theme: "The Catholic Church and Divine Retribution",
      text: `<span class="para-ref">[1.1]</span> Throughout the medieval era (c1250–c1500), the Roman Catholic Church was the supreme ideological authority across Western Europe. Society was profoundly religious, and people firmly believed that Almighty God controlled every aspect of daily life, health, and sickness.<br><br><span class="para-ref">[1.2]</span> Illness was widely explained as divine retribution: God sending disease to punish individuals for personal sins (such as greed, lust, or blasphemy), or testing a believer's spiritual faith like the biblical Job. The Church taught that the physical body was merely a temporary vessel for the immortal soul, meaning spiritual salvation was infinitely more important than bodily cure.`
    },
    {
      id: "block_2",
      title: "Religious Treatments and Sacramental Healing",
      theme: "Religious Treatments and Sacramental Healing",
      text: `<span class="para-ref">[2.1]</span> Because disease was viewed as supernatural in origin, primary treatments were religious. When falling ill, patients sought divine forgiveness through confession of sins, intense personal prayer, and self-chastisement.<br><br><span class="para-ref">[2.2]</span> Families paid priests to chant intercessory masses or undertook long pilgrimages to sacred holy shrines (such as the shrine of St Thomas Becket at Canterbury). Pilgrims touched holy relics—fragments of saintly bones, holy wood, or holy water—hoping for miraculous healing. Monasteries provided charitable palliative care, comforting dying patients with Christian sacraments.`
    },
    {
      id: "block_3",
      title: "Leprosy: The Visible Mark of Spiritual Sickness",
      theme: "Leprosy: The Visible Mark of Spiritual Sickness",
      text: `<span class="para-ref">[3.1]</span> Few diseases illustrated the fusion of physical illness and religious moral judgment as vividly as **leprosy**. Caused by a painful bacterial infection that destroyed nerves and facial skin, leprosy was viewed by contemporaries as God's visible punishment for severe moral corruption.<br><br><span class="para-ref">[3.2]</span> Sufferers were officially declared legally dead by Church courts, forced to wear hooded gray cloaks, and commanded to ring hand bells to warn healthy people away. Banished from towns, they were housed in specialized isolated monastic lazars (**leper houses**) situated outside city walls, receiving spiritual prayers rather than clinical cures.`
    },
    {
      id: "block_4",
      title: "Astrology, Planetary Conjunctions, and Bad Air",
      theme: "Astrology, Planetary Conjunctions, and Bad Air",
      text: `<span class="para-ref">[4.1]</span> Alongside direct divine action, medieval society relied heavily upon **astrology** to explain the timing of unexpected diseases. The position and movements of stars and planets were believed to exert powerful supernatural influences over human bodies.<br><br><span class="para-ref">[4.2]</span> University-trained physicians routinely carried *vade mecum* pocketbooks containing astrological calendars and **Zodiac Man** charts (<span class="archival-meta-tag">Source A</span>), which mapped each sign of the zodiac to specific anatomical organs. Conjunctions of planets (especially Saturn and Mars) were blamed for generating corrupt, poisonous air (**miasma**), warning physicians against operating on body parts ruled by unfavourable astrological signs.`
    },
    {
      id: "block_5",
      title: "The Catholic Church's Monopoly on Medical Knowledge",
      theme: "The Catholic Church's Monopoly on Medical Knowledge",
      text: `<span class="para-ref">[5.1]</span> The Catholic Church maintained a strict monopoly over medieval intellectual life. Monks in monastic scriptoria copied medical manuscripts entirely by hand in Latin, controlling which texts were preserved and taught in universities.<br><br><span class="para-ref">[5.2]</span> The Church promoted ancient Greek and Roman medical writers, particularly **Galen**, because his philosophical texts argued the human body was designed with divine purpose by a single Creator. Because Galen’s ideas harmonized with Christian theology, criticizing Galen was condemned as heresy. Independent clinical dissection and scientific experimentation were strictly forbidden, stifling new medical discovery for centuries.`
    }
  ],

  // Lesson 2 (index 1): Hippocrates & Galen
  1: [
    {
      id: "block_1",
      title: "Hippocrates and the Theory of the Four Humours",
      theme: "Hippocrates and the Theory of the Four Humours",
      text: `<span class="para-ref">[1.1]</span> Alongside supernatural beliefs, medieval physicians relied upon rational, natural theories formulated by ancient Greek physician **Hippocrates** (c460–c370 BC). Hippocrates rejected demonic explanations, arguing health depended upon the balance of four bodily fluids (**humours**).<br><br><span class="para-ref">[1.2]</span> These humours were **Blood** (hot and wet, linked to spring), **Phlegm** (cold and wet, linked to winter), **Yellow Bile** (hot and dry, linked to summer), and **Black Bile** (cold and dry, linked to autumn). Hippocrates taught that when humours were balanced, a person enjoyed perfect health; illness occurred when one humour became excessive, deficient, or corrupt.`
    },
    {
      id: "block_2",
      title: "Galen's Theory of Opposites and Humoral Balance",
      theme: "Galen's Theory of Opposites and Humoral Balance",
      text: `<span class="para-ref">[2.1]</span> In the second century AD, Greek physician **Galen**, practicing in Imperial Rome, expanded Hippocratic humoralism by developing the **Theory of Opposites** (*contraria contrariis curantur*). While Hippocrates emphasized gentle diet to allow nature to balance humours, Galen argued physicians must actively counteract excess humours with their direct clinical opposites.<br><br><span class="para-ref">[2.2]</span> For example, a fever caused by excess yellow bile (hot and dry) was treated with cold, wet remedies such as cucumber, cooling herbs, or cold baths. Conversely, a winter phlegmatic chill (cold and wet) required hot, dry treatments like pepper, wine, and warm blankets. Galen’s logical framework offered a clear clinical rationale, dominating European medicine for over thirteen centuries.`
    },
    {
      id: "block_3",
      title: "Hippocratic Clinical Observation and the Prognosis",
      theme: "Hippocratic Clinical Observation and the Prognosis",
      text: `<span class="para-ref">[3.1]</span> Hippocrates' greatest legacy was establishing the foundational method of **clinical observation**. Rather than consulting astrologers, Hippocrates instructed physicians to examine patients directly: recording pulse rates, skin temperature, and breathing patterns.<br><br><span class="para-ref">[3.2]</span> By observing hundreds of clinical cases, physicians identified the "crisis point" of an illness—the turning point where a patient either overcame fever or succumbed. Furthermore, Hippocratic doctors swore the **Hippocratic Oath**, pledging ethical conduct, patient confidentiality, and non-harm, creating the moral code of professional clinical medicine.`
    },
    {
      id: "block_4",
      title: "Galen, Teleology, and the Church's Monopoly",
      theme: "Galen, Teleology, and the Church's Monopoly",
      text: `<span class="para-ref">[4.1]</span> Galen’s enduring medieval dominance was guaranteed by the medieval **Catholic Church**. Although Galen lived in pagan Rome, his philosophical writings were **teleological**: he argued that the human body was purposefully crafted in every detail by a single divine Creator, and that human dissection revealed the perfection of God's design.<br><br><span class="para-ref">[4.2]</span> Because this aligned seamlessly with Christian theology, the Church adopted Galen’s texts as absolute medical scripture. The Church held a monopoly over education: monk scribes controlled manuscript copying, and universities taught medicine entirely from Latin translations of Galen. Challenging Galen was condemned as challenging God: when English scholar Roger Bacon advocated independent empirical experimentation in 1277, Church authorities imprisoned him for heresy.`
    },
    {
      id: "block_5",
      title: "Galenic Anatomy: The Consequences of Dissecting Animals",
      theme: "Galenic Anatomy: The Consequences of Dissecting Animals",
      text: `<span class="para-ref">[5.1]</span> Galen authored hundreds of medical treatises detailing human anatomy. However, because human dissection was legally and religiously forbidden in pagan Rome, Galen based his anatomical descriptions upon dissecting **pigs, apes, and dogs**.<br><br><span class="para-ref">[5.2]</span> Consequently, Galen made major factual errors: claiming the human jaw consisted of two bones, the liver had five lobes, and blood was manufactured in the liver and burned as fuel by tissues. Because medieval universities forbade questioning Galen, medical students merely watched barber-surgeons dissect executed criminals to confirm Galen's written words, leaving his anatomical errors uncorrected for over a thousand years.`
    }
  ],

  // Lesson 3 (index 2): Approaches to Prevention & Treatment
  2: [
    {
      id: "block_1",
      title: "Spiritual Remedies: Prayer, Fasting, and Miraculous Intercession",
      theme: "Spiritual Remedies: Prayer, Fasting, and Miraculous Intercession",
      text: `<span class="para-ref">[1.1]</span> Before physical medicine was administered, medieval patients sought spiritual pardon. Sickness was viewed as God's spiritual summons, meaning bodily cures were useless without confessing sins and reconciling with God.<br><br><span class="para-ref">[1.2]</span> Patients undertook religious fasts, donated money to monastic houses, and paid for priests to light votive candles. Wealthy nobles undertook pilgrimages to miraculous shrines, such as Canterbury, praying before gilded shrines and drinking holy well water. Medieval healing placed spiritual redemption at the core of therapeutic practice.`
    },
    {
      id: "block_2",
      title: "Phlebotomy: Restoring Balance through Bloodletting",
      theme: "Phlebotomy: Restoring Balance through Bloodletting",
      text: `<span class="para-ref">[2.1]</span> The most common clinical treatment in medieval Britain was **phlebotomy** (bloodletting). Physicians believed fevers and inflammations were caused by an excess of blood (*plethora*), requiring controlled evacuation to restore humoral harmony.<br><br><span class="para-ref">[2.2]</span> Bloodletting was performed in three ways: **venesection** (cutting a vein with a fleam or lancet); **cupping** (heating glass cups over scratched skin to draw blood); and **leeches** collected from marshes. Physicians consulted **Vein Man** charts to select the precise vein corresponding to the diseased organ, warning against phlebotomy when astrological alignments were unfavorable.`
    },
    {
      id: "block_3",
      title: "Purging, Emetics, and Clysters: Evacuating Toxic Humours",
      theme: "Purging, Emetics, and Clysters: Evacuating Toxic Humours",
      text: `<span class="para-ref">[3.1]</span> When bloodletting was insufficient, practitioners employed systematic **purging** to evacuate toxic humours from the digestive tract. Patients swallowed violent herbal emetics formulated from hellebore or antimony to induce vomiting.<br><br><span class="para-ref">[3.2]</span> Alternatively, practitioners prescribed strong laxatives made from linseed, senna, and aloes to flush the bowels. For severe illnesses, healers administered a **clyster**—an enema injected using a pewter or horn syringe attached to an animal bladder, pumping warm water, salt, and chamomile into the rectum to purge impurities from the gut.`
    },
    {
      id: "block_4",
      title: "Herbal Pharmacy: Simples, Electuaries, and Theriac",
      theme: "Herbal Pharmacy: Simples, Electuaries, and Theriac",
      text: `<span class="para-ref">[4.1]</span> Herbal pharmacy provided the vast majority of everyday remedies. Apothecaries and local wise women brewed herbal potions prepared as single herbs (**simples**) or complex sweetened compounds (**electuaries**).<br><br><span class="para-ref">[4.2]</span> Common ingredients included mint for digestion, willow bark for fever pain, and honey as an antiseptic dressing. The most prestigious medicine was **Theriac** (Venice Treacle), an ancient compound containing over sixty ingredients including snake flesh and opium. Believed to purge poisons from the heart, Theriac was prescribed for everything from snakebites to epidemic fevers.`
    },
    {
      id: "block_5",
      title: "Medieval Prevention and the Regimen Sanitatis",
      theme: "Medieval Prevention and the Regimen Sanitatis",
      text: `<span class="para-ref">[5.1]</span> Medieval medicine placed immense emphasis upon prevention, governed by the **Regimen Sanitatis** (rule of health)—a set of dietary and lifestyle guidelines written by Salernitan physicians.<br><br><span class="para-ref">[5.2]</span> The Regimen urged individuals to balance the "Six Non-Naturals": moderate food, adequate sleep, fresh air, exercise, emotional calmness, and regular bathing. To ward off airborne **miasma**, citizens carried fragrant herbs, clove-studded oranges (**pomanders**), and burned pine resin indoors, believing pleasant aromas neutralized disease-carrying foul air.`
    }
  ],

  // Lesson 4 (index 3): Medical Care Providers & Hospitals
  3: [
    {
      id: "block_1",
      title: "University-Trained Physicians: Theory Over Practice",
      theme: "University-Trained Physicians: Theory Over Practice",
      text: `<span class="para-ref">[1.1]</span> Medieval healthcare was strictly stratified by wealth and class. At the pinnacle were university-trained **physicians**. Educated for up to ten years at Oxford, Cambridge, Paris, or Montpellier, physicians were scholastic academics who rarely touched patients directly.<br><br><span class="para-ref">[1.2]</span> They diagnosed ailments from ancient Greek and Arab texts in Latin, inspecting urine flasks (*uroscopy*), checking pulse rates, and consulting astrological charts. Because training was lengthy and rare, physicians charged exorbitant consultation fees, making their services accessible only to royalty, aristocracy, and wealthy merchants.`
    },
    {
      id: "block_2",
      title: "Guild Apothecaries and Spicers: Retail Medicine",
      theme: "Guild Apothecaries and Spicers: Retail Medicine",
      text: `<span class="para-ref">[2.1]</span> For urban merchants and tradesmen who could not afford a physician, the local **apothecary shop** was the first port of call. Apothecaries were organized into trade guilds, training through seven-year practical apprenticeships.<br><br><span class="para-ref">[2.2]</span> They stocked hundreds of dried roots, herbs, minerals, and imported spices from Mediterranean trade networks. Unlike physicians who charged high academic fees, apothecaries diagnosed customers directly across the counter, mixing custom ointments, syrups, and electuaries. Though physicians viewed them with professional snobbery as mere tradesmen, ordinary citizens valued their practical, accessible pharmacy.`
    },
    {
      id: "block_3",
      title: "Barber-Surgeons and Craft Medicine",
      theme: "Barber-Surgeons and Craft Medicine",
      text: `<span class="para-ref">[3.1]</span> In medieval towns, practical surgical care was delivered by **barber-surgeons**. Possessing no university Latin education, barber-surgeons were craftsmen belonging to urban trade guilds, learning through apprenticeships with razors, lancets, and saws.<br><br><span class="para-ref">[3.2]</span> They cut hair, pulled rotten teeth, dressed open wounds, set broken bones, and performed phlebotomy (bloodletting). While prestigious surgeons like John of Arderne treated wealthy knights on battlefields, ordinary barber-surgeons provided affordable, manual emergency treatments for working-class citizens who could never consult an academic physician.`
    },
    {
      id: "block_4",
      title: "Monastic Hospitals: ‘Care Not Cure’",
      theme: "Monastic Hospitals: ‘Care Not Cure’",
      text: `<span class="para-ref">[4.1]</span> By 1500, England possessed over 700 hospitals, virtually all founded, funded, and operated by monastic religious orders, including **St Bartholomew’s** (founded 1123) and **St Thomas’s** (1215) in London.<br><br><span class="para-ref">[4.2]</span> These institutions were not medical treatment facilities in the modern sense. Run by monks and nuns, their guiding ethos was **"care not cure"**: providing shelter, warm fires, clean bedding, nourishment, and daily religious prayer to comfort souls. Crucially, medieval hospitals rejected infectious patients, pregnant women, and terminal cases to preserve cleanliness and avoid spiritual pollution.`
    },
    {
      id: "block_5",
      title: "Domestic Healers and Wise Women",
      theme: "Domestic Healers and Wise Women",
      text: `<span class="para-ref">[5.1]</span> For the vast majority of the population living in rural peasant villages, healthcare began and ended in the home. Peasant families relied upon **female domestic healers**—mothers, grandmothers, and local "wise women".<br><br><span class="para-ref">[5.2]</span> Drawing upon traditional folklore passed down through generations, women cultivated herb gardens, brewing remedies from willow bark (pain relief), mint (digestion), and chamomile. Village wise women also acted as midwives delivering babies, bone-setters, and herbal pharmacists, providing free or barter-based care that formed the true foundation of medieval community medicine.`
    }
  ],

  // Lesson 5 (index 4): Black Death Case Study
  4: [
    {
      id: "block_1",
      title: "Arrival of the Great Pestilence (June 1348)",
      theme: "Arrival of the Great Pestilence (June 1348)",
      text: `<span class="para-ref">[1.1]</span> In June 1348, the **Black Death** (*Yersinia pestis*) arrived in England aboard trading ships docking at Melcombe Regis (Weymouth), Dorset. Originating in Central Asia, the plague swept relentlessly along trade routes across Europe, striking London by autumn 1348.<br><br><span class="para-ref">[1.2]</span> Contemporaries confronted an apocalyptic disaster beyond comprehension. Within eighteen months, the epidemic annihilated between **30% and 45% of England’s population**, leaving entire villages deserted and corpses piled unburied in fields, sparking economic and social turmoil.`
    },
    {
      id: "block_2",
      title: "Clinical Symptoms: Bubonic and Pneumonic Terror",
      theme: "Clinical Symptoms: Bubonic and Pneumonic Terror",
      text: `<span class="para-ref">[2.1]</span> The Black Death struck in two terrifying forms. The commonest was **bubonic plague**, transmitted by fleas living on black rats (*Rattus rattus*). Victims developed high fever, violent vomiting, and agonizing, swollen lymph glands called **buboes** in the groin and armpits.<br><br><span class="para-ref">[2.2]</span> Dark purple and black spots appeared on the skin as internal bleeding set in. The deadlier variation was **pneumonic plague**, spread directly through airborne cough droplets into lungs. Victims coughed up blood and suffocated within twenty-four hours, carrying a terrifying 100% mortality rate.`
    },
    {
      id: "block_3",
      title: "Medieval Explanations: Wrath of God and Planetary Alignment",
      theme: "Medieval Explanations: Wrath of God and Planetary Alignment",
      text: `<span class="para-ref">[3.1]</span> Lacking knowledge of bacteria, medieval society explained the Black Death through religious, astrological, and environmental frameworks. Most believed the plague was **God's punishment** for human wickedness, swearing, and sinful pride.<br><br><span class="para-ref">[3.2]</span> Astrologers pointed to a catastrophic alignment of planets in 1345, claiming the conjunction of Saturn, Jupiter, and Mars in Aquarius corrupted atmospheric air. Physicians blamed foul **miasma** released by earthquakes and unburied dead bodies, arguing corrupt air entered pores and poisoned the blood.`
    },
    {
      id: "block_4",
      title: "Desperate Treatments and Hopeless Cures",
      theme: "Desperate Treatments and Hopeless Cures",
      text: `<span class="para-ref">[4.1]</span> Medieval physicians and domestic healers were completely powerless against the plague. Treatments were desperate and ineffective: barber-surgeons bled patients until they fainted, which weakened immune systems and accelerated death.<br><br><span class="para-ref">[4.2]</span> Healers lanced and drained buboes with hot irons, strapped living plumed chickens to swellings to "draw out poison," and administered costly potions of crushed emeralds, arsenic, and Venice Treacle. Wealthy families fled infected cities into the countryside, while poor citizens burned aromatic pine resin indoors to purify air.`
    },
    {
      id: "block_5",
      title: "Civic Responses, Religious Processions, and Mass Mortality",
      theme: "Civic Responses, Religious Processions, and Mass Mortality",
      text: `<span class="para-ref">[5.1]</span> Civic authorities attempted desperate containment measures. In Gloucester and London, town gates were barred against strangers, and streets were cleared of rubbish. Church leaders ordered mass religious processions, which ironically spread pneumonic infection among gathered crowds.<br><br><span class="para-ref">[5.2]</span> Churches ran out of consecrated ground, forcing towns to dig enormous mass burial pits outside city walls. The catastrophic loss of labor destroyed the feudal system: surviving peasants demanded higher wages, culminating in the 1381 Peasants' Revolt and transforming medieval English society forever.`
    }
  ]
};
