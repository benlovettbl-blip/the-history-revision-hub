const fs = require('fs');
const path = require('path');

const realisticModels = {
  // Lesson 1: Supernatural & Religious (c1250-c1500)
  0: [
    {
      qIdx: 0,
      model: "One way ideas about the cause of disease were similar was the continuing belief in **miasma** (bad air). In the Medieval period, people believed the 1348 Black Death was caused by poisonous foul air from decaying waste. Similarly, during the 1665 Great Plague in the Renaissance, people still blamed bad air, carrying sweet-smelling posies and smoking tobacco to ward off disease."
    },
    {
      qIdx: 1,
      model: "One reason the Catholic Church had such a major influence on disease ideas was its control over education and books. In the Middle Ages, books were hand-copied by monks, and the Church only allowed medical texts that agreed with Christian teachings. Because Galen argued the body was created by a single God, the Church taught his theories as absolute fact, and universities forbade students from questioning him.<br><br>Furthermore, the Church taught that disease was sent directly by God as punishment for sins or a test of faith. Because illness was seen as supernatural, questioning Church dogma was treated as heresy. For example, Roger Bacon was imprisoned in 1277 for suggesting that doctors should learn through observation and experiments rather than relying only on ancient books.<br><br>Finally, the Church controlled care institutions like hospitals. Monastic hospitals were founded on 'care not cure', focusing on prayer, confession, and saving souls rather than medical treatment. Because ordinary people attended church weekly and heard that epidemics like the Black Death were divine punishment, supernatural ideas remained unchallenged."
    }
  ],

  // Lesson 2: Rational Explanations: Four Humours
  1: [
    {
      qIdx: 0,
      model: "One way ideas differed was the belief in **humoural balance compared to modern germ theory**. In the Medieval period, doctors believed illness was caused by an internal imbalance of the Four Humours (blood, phlegm, yellow bile, black bile). In contrast, in the Modern period, doctors know that infectious diseases are caused by microscopic external pathogens like bacteria and viruses, discovered using electron microscopes."
    },
    {
      qIdx: 1,
      model: "One reason the Theory of the Four Humours remained dominant was that it was a logical, universal theory that could explain almost any illness. It linked the body directly to the seasons, elements, and diet (such as fevers being hot and dry), allowing medieval doctors to prescribe simple treatments like bloodletting or dietary changes that made sense to ordinary patients.<br><br>Furthermore, the theory was strongly supported by the Catholic Church. Hippocrates and Galen were the ancient creators of humoural medicine, and because Galen believed in a single Creator, the Church made his writings official medical doctrine. Disagreeing with Galen or suggesting alternative ideas was treated as heresy, preventing any medical challenges.<br><br>Finally, there was a total lack of alternative scientific knowledge. In medieval Europe, human dissection was strictly limited, and microscopes did not exist. Because people could not see bacteria or cellular pathology, Galen's humoural balance remained the only rational explanation available to physicians."
    }
  ],

  // Lesson 3: Approaches to Prevention & Treatment
  2: [
    {
      qIdx: 0,
      model: "One way approaches to prevention were similar was the use of **diet and purging to keep the body balanced**. In the Medieval period, people followed the *Regimen Sanitatis*, regulating diet, exercise, and bathing to maintain humoural balance. Similarly, in the Renaissance, people continued to use special diets, laxatives, and routine bloodletting to avoid bodily corruption, as germs were still completely unknown."
    },
    {
      qIdx: 1,
      model: "One reason bloodletting and purging remained so common was that they directly matched the Theory of the Four Humours. Medieval doctors believed illness was caused by an excess of humour (such as too much blood causing fevers). Bleeding patients with leeches or fleams, and purging with laxatives, visibly removed fluids from the body, making patients believe their balance was being restored.<br><br>Furthermore, these treatments were strongly reinforced by Galen's Theory of Opposites. Galen taught that an excess of a hot humour should be treated with cold remedies or by removing blood. Because the Church promoted Galen's writings as unchallengeable truth, medieval physicians followed his bleeding charts (vein man diagrams) without testing whether they actually helped.<br><br>Finally, ordinary people demanded these treatments from barber-surgeons and apothecaries. Unlike expensive university-trained physicians, local barber-surgeons offered cheap, quick bleeding. Because patients expected bleeding and purging when sick, tradition kept these practices popular despite their lack of medical benefit."
    }
  ],

  // Lesson 4: Medical Care Providers & Monastic Hospitals
  3: [
    {
      qIdx: 0,
      model: "One way the work of hospitals differed was their **fundamental purpose: spiritual care versus curative medicine**. In the Medieval period, hospitals like St Bartholomew’s were run by monks and nuns who offered 'care not cure', focusing on prayer, warmth, and shelter for the soul. In contrast, nineteenth-century hospitals were secular institutions staffed by trained doctors and Nightingale nurses, using antiseptic surgery and anaesthetics to physically cure illness."
    },
    {
      qIdx: 1,
      model: "One reason medieval hospital care was based on 'care not cure' was the Christian religious mission of hospitals. Medieval hospitals were funded by the Church or wealthy benefactors as acts of Christian charity. Monks and nuns saw their primary duty as comforting sick pilgrims and praying for the salvation of patients' souls, rather than offering medical treatments.<br><br>Furthermore, medieval hospitals lacked trained medical staff. Physicians were expensive and rarely worked in hospitals; instead, patients were cared for by nuns and monks who had no formal medical training. Hospitals actively turned away infectious patients, pregnant women, and the incurably sick, admitting only the elderly, poor, and weary travellers who needed shelter and food.<br><br>Finally, medical knowledge was too limited to cure disease. Because doctors had no understanding of germs or effective medicines, hospitals could not cure serious illnesses. Providing a clean bed, warm fires, regular broth, and daily prayers was the most compassionate help medieval society could offer."
    }
  ],

  // Lesson 5: Case Study: Black Death
  4: [
    {
      qIdx: 0,
      model: "One way responses were similar was the **use of quarantine to stop disease spreading**. In 1348, town authorities attempted to quarantine newcomers and isolate victims, while the wealthy fled infected areas. Similarly, in 1665, the Lord Mayor enforced quarantine by locking infected families in their homes for 40 days, marked with a red cross and the words 'Lord have mercy upon us'."
    },
    {
      qIdx: 1,
      model: "Governments in 1348 had no effective public health machinery to halt the Black Death, which contributed significantly to the catastrophic death toll. Medieval town councils took limited local steps, such as Gloucester attempting to isolate itself from infected travelers and London digging mass burial pits outside the city. However, the national government had no central health board, no trained officials, and no power to enforce lockdowns. Because the king and parliament could not coordinate national quarantine, the plague spread unchecked along trade routes.<br><br>On the other hand, the primary reason so many died was the complete lack of accurate scientific knowledge about the cause of the disease. Medieval people had no understanding of bacteria (*Yersinia pestis*) or fleas living on black rats. Instead, doctors blamed miasma, planetary conjunctions, and divine retribution for sin. Consequently, preventive measures—such as lighting bonfires, carrying posies, praying, and flagellation—were biologically useless against flea-borne bubonic plague. Even if local councils had tried stricter measures, their actions were based on flawed theories.<br><br>Furthermore, living conditions in medieval towns made rapid contagion inevitable. Crowded wooden houses, narrow streets filled with rotting animal waste and open cesspools, and poor personal hygiene provided ideal breeding grounds for rats and vermin. In conclusion, while weak government response allowed the plague to spread, the fundamental cause of the mass mortality was ignorance of bacteriology. Without knowing that fleas spread the disease, no medieval government could have prevented the disaster."
    }
  ],

  // Lesson 6: The New Spirit of Enquiry: Printing Press & Royal Society
  5: [
    {
      qIdx: 0,
      model: "One way ideas were similar was the **belief that God sent epidemics as a punishment for sin**. In the Medieval period, people believed the Black Death was divine retribution, leading flagellants to whip themselves for forgiveness. Similarly, during the 1665 Great Plague in the Renaissance, clergy held public prayer days and repentance services, believing God was punishing England for moral wickedness."
    },
    {
      qIdx: 1,
      model: "One reason new ideas spread more rapidly in the Renaissance was the invention of the printing press by Johannes Gutenberg in the 1440s. Before printing, books had to be copied by hand by monks, which was slow, expensive, and heavily censored. Printing allowed thousands of identical copies of medical books and detailed anatomical drawings to be published cheaply and distributed across Europe within months.<br><br>Furthermore, the establishment of the Royal Society in London in 1660 encouraged scientists to share and debate discoveries. Under its motto *Nullius in verba* ('Take nobody's word for it'), the Royal Society published Europe’s first scientific journal, *Philosophical Transactions*, enabling doctors to read about new experiments, microscopes, and discoveries like blood circulation.<br><br>Finally, the growing spirit of humanism encouraged scholars to question ancient authority. Renaissance thinkers broke away from blind obedience to Galen and the Church, seeking empirical proof through personal observation and dissection. This intellectual curiosity made doctors eager to read and test new medical ideas."
    }
  ],

  // Lesson 7: Thomas Sydenham
  6: [
    {
      qIdx: 0,
      model: "One way treatments differed was the **introduction of chemical remedies alongside traditional herbal recipes**. In the Medieval period, treatments relied entirely on herbal mixtures and humoural bleeding based on Galen's Theory of Opposites. In contrast, in the Renaissance, physicians influenced by Paracelsus began prescribing chemical remedies, such as antimony and mercury, to treat specific illnesses like syphilis."
    },
    {
      qIdx: 1,
      model: "One reason Thomas Sydenham was important was his emphasis on direct clinical observation at the patient's bedside. Rather than relying on ancient textbooks by Galen, Sydenham spent years carefully observing symptoms, taking detailed notes on the progression of illnesses, and diagnosing patients based on real clinical evidence.<br><br>Furthermore, Sydenham revolutionized disease classification by treating illnesses as distinct species. He argued that diseases could be grouped like plants, with their own specific causes and symptoms, rather than assuming illness was unique to each person’s humoural balance. This allowed him to accurately distinguish between scarlet fever and measles for the first time.<br><br>Finally, Sydenham advocated simple, gentle treatments instead of aggressive bleeding. For example, he treated smallpox with cool air, light bedcovers, and fluids rather than overheating patients in dark rooms, and he popularized quinine from Peruvian bark to treat malaria. His practical, observational approach earned him the title 'the English Hippocrates'."
    }
  ],

  // Lesson 8: Andreas Vesalius
  7: [
    {
      qIdx: 0,
      model: "One way anatomical training was similar was the **central role of human dissection carried out directly by students**. In the Renaissance, Andreas Vesalius insisted that medical students dissect human corpses themselves rather than passively watching a barber-surgeon. Similarly, by the nineteenth century, medical schools required all surgical trainees to carry out hands-on human dissections in anatomical theatres to master internal anatomy before operating."
    },
    {
      qIdx: 1,
      model: "One reason Andreas Vesalius made significant breakthroughs was his insistence on carrying out human dissections himself. In the Middle Ages, professors sat high above the dissection theatre reading ancient texts while barber-surgeons cut open bodies. Vesalius carried out the dissections with his own hands, allowing him to observe the human body directly and spot anatomical mistakes.<br><br>Furthermore, Vesalius proved that Galen's classical anatomy was flawed. Because Roman law forbade human dissection, Galen had dissected apes and pigs, leading to major errors such as claiming the human jawbone had two pieces instead of one. Vesalius corrected over 200 of Galen’s mistakes, proving that ancient texts were not infallible.<br><br>Finally, Vesalius used the printing press to publish his masterpiece, *The Fabric of the Human Body* (1543). Illustrated by Renaissance artists from Titian's workshop, his book provided highly accurate, labeled anatomical plates that were distributed to medical schools across Europe, permanently transforming anatomical training."
    }
  ],

  // Lesson 9: William Harvey
  8: [
    {
      qIdx: 0,
      model: "One way ideas differed was the **understanding of how blood moves around the body**. In the Medieval period, doctors followed Galen's belief that blood was continuously made in the liver and consumed by the body like fuel. In contrast, in the Renaissance, William Harvey proved in 1628 that blood circulates repeatedly through the body, pumped continuously by the heart through one-way valves."
    },
    {
      qIdx: 1,
      model: "One reason William Harvey discovered the circulation of the blood was his use of meticulous scientific experiments and mathematical calculations. By measuring the capacity of the heart, Harvey calculated that it pumped hundreds of pints of blood every hour—far more than the body could possibly manufacture from food or consume as fuel, proving blood had to circulate.<br><br>Furthermore, Harvey observed live cold-blooded animals and carried out experiments on human veins. By tying tight ligatures on arms and trying to push blood backward past valves, he proved that veins only permit blood to flow toward the heart, directly disproving Galen’s theory that blood sloshed back and forth.<br><br>Finally, Harvey was influenced by Renaissance mechanical inventions, particularly mechanical water pumps used in firefighting. This mechanical mindset allowed him to view the heart as a muscular pump rather than a furnace, publishing his findings in 1628 (*De Motu Cordis*) to transform cardiovascular science."
    }
  ],

  // Lesson 10: Continuity in Treatment & Great Plague of 1665
  9: [
    {
      qIdx: 0,
      model: "One way government responses differed was the **level of organised local regulation**. In 1348, the medieval government took little coordinated action beyond closing some town gates and digging mass burial pits. In contrast, in 1665, the Mayor of London enforced strict regulations: appointing searchers and wardens, locking infected families in their homes for 40 days, and banning theatres and large public funerals."
    },
    {
      qIdx: 1,
      model: "Government and municipal responses to the Great Plague of 1665 were significantly more organized and bureaucratic than the response to the Black Death in 1348. In 1665, the Mayor of London enforced detailed regulations: appointing official searchers and watchmen, systematically locking infected households inside their homes for 40 days with red crosses painted on doors, and banning public assemblies, theatres, and large funerals. Furthermore, stray dogs and cats were culled, and weekly Bills of Mortality tracked death rates across parishes. In contrast, in 1348, government action was minimal and uncoordinated, limited to digging mass trenches and closing occasional town gates.<br><br>However, in terms of underlying medical understanding, responses in 1665 remained remarkably similar to 1348. In both epidemics, doctors and authorities remained completely ignorant of bacteria and rat fleas. Consequently, people in 1665 still blamed miasma, carrying sweet pomanders, smoking tobacco, and burning tar barrels in streets, exactly as medieval people had done with herbs. Similarly, both eras viewed plague as divine punishment from God, responding with public prayer days, fasting, and religious repentance. Furthermore, the wealthy elite in 1665 fled the capital to rural estates, just as landowners had done in 1348, leaving the poor to suffer trapped in infected cities.<br><br>In conclusion, while the administrative organization of quarantine and surveillance in 1665 was far more systematic than in 1348, the medical and supernatural thinking behind prevention remained largely unchanged. Without understanding microbiology, seventeenth-century responses were still powerless to prevent catastrophic mortality."
    }
  ],

  // Lesson 11: Germ Theory & Koch
  10: [
    {
      qIdx: 0,
      model: "One way ideas differed was the **discovery that specific microscopic bacteria cause disease rather than miasma**. In the Renaissance, doctors still believed disease arose from foul air or spontaneous generation in decaying matter. In contrast, by the late nineteenth century, Louis Pasteur's 1861 Germ Theory and Robert Koch’s work proved that specific living microorganisms (bacteria) cause specific diseases like anthrax and cholera."
    },
    {
      qIdx: 1,
      model: "One reason for rapid progress in understanding disease causation was the scientific breakthrough of Louis Pasteur's Germ Theory in 1861. By demonstrating that souring wine was caused by living microbes from the air, Pasteur disproved spontaneous generation. He proved that microorganisms were the cause of decay, prompting doctors to investigate whether microbes also caused human illness.<br><br>Furthermore, Robert Koch developed revolutionary laboratory techniques that turned Germ Theory into practical bacteriology. Koch invented methods to culture bacteria on solid agar jelly and stained microbes with chemical dyes to make them visible under optical microscopes. His 'Koch's Postulates' allowed scientists to isolate and prove the exact bacteria causing anthrax (1876), tuberculosis (1882), and cholera (1883).<br><br>Finally, technological improvements in microscopes made this research possible. The development of achromatic lenses by Joseph Jackson Lister eliminated image distortion, enabling optical microscopes to magnify clear, high-resolution images of bacteria for the first time."
    }
  ],

  // Lesson 12: Edward Jenner & Smallpox Vaccine
  11: [
    {
      qIdx: 0,
      model: "One way prevention differed was the **development of vaccination using cowpox rather than inoculation using live smallpox**. In the seventeenth and early eighteenth centuries, people used inoculation (variolation), scratching live smallpox scabs into the skin, which was dangerous and could trigger fatal outbreaks. In contrast, in 1796, Edward Jenner developed vaccination using mild cowpox pus, providing safe, permanent immunity without risking death."
    },
    {
      qIdx: 1,
      model: "Edward Jenner’s development of the smallpox vaccine in 1796 was a revolutionary breakthrough in disease prevention. Before Jenner, smallpox was one of Britain’s deadliest killers. Jenner's discovery that inoculation with mild cowpox granted immunity against smallpox replaced dangerous variolation with a safe, painless preventative method. In 1853, the British government made smallpox vaccination compulsory for all infants, which led to a dramatic collapse in smallpox deaths and ultimately the global eradication of the disease, proving the immense significance of Jenner's work.<br><br>However, Jenner’s breakthrough was limited because it was a one-off discovery that Jenner himself could not scientifically explain. Jenner did not know that viruses or antibodies existed, meaning his method could not be immediately applied to other deadly diseases like cholera, typhus, or measles. Consequently, throughout the first half of the nineteenth century, smallpox remained the only illness preventable by vaccination, while epidemic mortality in industrial cities continued to rise from waterborne and airborne infections.<br><br>On the other hand, the late nineteenth century saw far broader breakthroughs in prevention driven by Louis Pasteur’s Germ Theory (1861). Once Pasteur understood microbes, he artificially weakened pathogens to produce vaccines for chicken cholera (1879), anthrax (1881), and rabies (1885). Furthermore, government public health reforms like the 1875 Public Health Act prevented cholera and typhoid through clean sewers and clean water.<br><br>In conclusion, while Jenner saved millions and created the concept of vaccination, his work was an isolated empirical discovery. The systematic understanding of vaccination and public sanitation after 1860 was far more significant in preventing disease across society."
    }
  ],

  // Lesson 13: Florence Nightingale & Hospitals
  12: [
    {
      qIdx: 0,
      model: "One way hospital care differed was the **focus on medical treatment rather than spiritual care**. In the Medieval period, hospitals were run by monks and nuns who offered 'care not cure', providing food and prayer for the soul rather than medical treatment. In contrast, by the late nineteenth century, hospitals were secular institutions staffed by trained nurses following Florence Nightingale's pavilion plan, focusing on ventilation, cleanliness, and physical recovery."
    },
    {
      qIdx: 1,
      model: "One reason hospital care improved dramatically in the late nineteenth century was the pioneering reform of Florence Nightingale. After drastically reducing mortality at the Scutari hospital during the Crimean War (1854–56), Nightingale published *Notes on Nursing* and *Notes on Hospitals*. She introduced the 'pavilion plan', designing hospitals with separate wards, high ceilings, large windows, and cross-ventilation to remove foul air and prevent hospital fever.<br><br>Furthermore, Nightingale professionalised nursing as a respectable, disciplined medical career. In 1860, she established the Nightingale Training School at St Thomas' Hospital in London, where nurses were trained in strict sanitation, personal cleanliness, and patient observation, transforming nurses from drunken, uneducated helpers into skilled medical professionals.<br><br>Finally, the acceptance of Pasteur's Germ Theory and Lister’s antiseptic techniques transformed hospital hygiene. Hospital wards were scrubbed daily with carbolic acid, surgical theatres were sterilised, and doctors abandoned dirty frock coats in favour of clean gowns, which slashed post-operative infection rates and made hospitals safe places to recover."
    }
  ],

  // Lesson 14: Surgical Revolution: Simpson & Lister
  13: [
    {
      qIdx: 0,
      model: "One way surgery was similar was the **absence of effective anaesthetics and antiseptics**. In the Medieval period, surgeons operated on conscious, screaming patients held down by assistants, with most dying from shock or infection. Similarly, in the early nineteenth century before ether and chloroform (1846–47), surgeons like Robert Liston had to operate in seconds because patients remained fully conscious, while infections like gangrene remained fatal."
    },
    {
      qIdx: 1,
      model: "One reason surgery became significantly safer in the mid-to-late nineteenth century was the conquest of surgical pain through anaesthetics. In 1847, James Simpson discovered the anaesthetic properties of chloroform. This allowed surgeons to operate on still, unconscious patients, ending the agony of the knife and giving surgeons time to perform careful, complex operations rather than rushing in seconds.<br><br>Furthermore, Joseph Lister conquered surgical infection by introducing antiseptics in 1865. Applying Pasteur’s Germ Theory to surgery, Lister realised gangrene and sepsis were caused by airborne microbes. By spraying carbolic acid over incisions, soaking bandages, and washing instruments, Lister reduced his post-operative amputation mortality from 46% to 15% within three years.<br><br>Finally, surgery progressed from antiseptic techniques to aseptic surgery by the 1890s. Surgeons realised it was safer to keep germs out of theatres entirely rather than killing them with chemicals. Operating rooms were tiled and steamed, instruments were sterilised in autoclaves, and surgeons began wearing sterilised rubber gloves, surgical gowns, and masks, making surgery safe and sterile."
    }
  ],

  // Lesson 15: Public Health: John Snow & 1875 Act
  14: [
    {
      qIdx: 0,
      model: "One way government action differed was the **shift from laissez-faire to compulsory national public health legislation**. In the Renaissance, governments took almost no action to clean streets or provide clean water, leaving sanitation entirely to individuals. In contrast, under the 1875 Public Health Act, the British government made it compulsory for local councils to provide clean water, inspect sewers, and collect household refuse."
    },
    {
      qIdx: 1,
      model: "John Snow's 1854 investigation of the Broad Street cholera outbreak was a crucial turning point in nineteenth-century public health. By mapping cholera deaths in Soho and removing the handle of the contaminated Broad Street pump, Snow proved that cholera was a waterborne disease caused by drinking sewage, rather than airborne miasma. His empirical proof challenged medical orthodoxy and provided the scientific justification for investing in clean municipal water infrastructure.<br><br>However, Snow’s work on its own was not the main reason for nationwide public health improvements. The medical establishment and government initially rejected Snow’s findings because miasma theory remained dominant until Pasteur published Germ Theory in 1861. Furthermore, central government followed a laissez-faire philosophy, leaving sanitation to powerless or unwilling local authorities.<br><br>Instead, the main catalyst for widespread public health progress was the construction of London's massive sewer network and compulsory legislation. Following the 'Great Stink' of 1858, parliament funded Joseph Bazalgette to construct 1,100 miles of underground brick sewers, which transported billions of gallons of raw sewage away from the Thames, permanently eliminating cholera from London by 1866.<br><br>Furthermore, the 1875 Public Health Act marked the decisive end of government laissez-faire. The Act forced local councils across Britain to provide clean water, inspect sewers, collect rubbish, and appoint medical officers of health.<br><br>In conclusion, while John Snow proved cholera was waterborne, Bazalgette’s engineering and the compulsory legislation of the 1875 Act were far more decisive in actually transforming public health across nineteenth-century Britain."
    }
  ],

  // Lesson 16: Genetics, DNA & Human Genome
  15: [
    {
      qIdx: 0,
      model: "One way methods differed was the **use of genetic sequencing rather than bacterial staining**. In the late nineteenth century, scientists like Robert Koch used optical microscopes and chemical dyes to identify single-celled bacteria on agar plates. In contrast, in the late twentieth century, scientists used X-ray crystallography, electron microscopes, and computer sequencing to map human DNA and identify inherited genetic mutations."
    },
    {
      qIdx: 1,
      model: "One reason for rapid progress in understanding disease causes after 1953 was the discovery of the structure of DNA by James Watson, Francis Crick, and Rosalind Franklin. Franklin's X-ray crystallography photograph (Photo 51) revealed the double helix shape of DNA, enabling scientists to understand how genetic code is stored and passed down through generations.<br><br>Furthermore, the international Human Genome Project (1990–2003) dramatically accelerated genetic understanding. Scientists across the world collaborated to map all 3 billion chemical base pairs in human DNA. This enabled doctors to identify specific faulty genes responsible for hereditary conditions like cystic fibrosis, Huntington's disease, and inherited breast cancer.<br><br>Finally, lifestyle research revealed the environmental causes of non-infectious illnesses. Large-scale epidemiological studies, such as Richard Doll and Austin Bradford Hill’s 1950 study linking cigarette smoking to lung cancer, proved that lifestyle choices like smoking, poor diet, alcohol, and lack of exercise directly cause cancer, heart disease, and diabetes."
    }
  ],

  // Lesson 17: Diagnosis Technology & Lifestyle
  16: [
    {
      qIdx: 0,
      model: "One way diagnosis differed was the **use of advanced internal imaging technology**. In the nineteenth century, doctors diagnosed illness mainly through external physical examination, using stethoscopes, thermometers, and tapping the chest (percussion). In contrast, by the late twentieth century, doctors used non-invasive digital scans like CT, MRI, and ultrasound to see detailed, three-dimensional images of internal organs and soft tissue without surgery."
    },
    {
      qIdx: 1,
      model: "Technological innovations in medical diagnosis revolutionized modern healthcare by allowing doctors to identify diseases earlier and far more accurately than ever before. Throughout the twentieth century, breakthroughs like Wilhelm Röntgen’s X-rays (1895), ultrasound (1950s), CT scans (1970s), and MRI scans enabled physicians to see inside the living body without exploratory surgery. Furthermore, modern blood tests and DNA screening allow doctors to detect cancer markers and genetic predispositions before symptoms even appear, enabling targeted therapies and saving countless lives.<br><br>However, diagnostic technology alone cannot prevent disease from occurring in the first place; it can only identify conditions once a patient is screened. In contrast, public health and lifestyle campaigns have been crucial in preventing disease on a mass scale across the population. In the modern era, chronic non-communicable diseases—such as lung cancer, coronary heart disease, and Type 2 diabetes—are largely caused by behavioral lifestyle factors like smoking, poor diet, and alcohol.<br><br>Public health campaigns, such as anti-smoking legislation (banning tobacco advertising in 1965 and enforcing the 2007 indoor smoking ban), have cut smoking rates from over 50% in the 1950s to under 15% today, preventing hundreds of thousands of premature deaths. Similarly, government campaigns like the 'Change4Life' healthy eating drive, sugar taxes, and national vaccination campaigns have protected entire generations from illness before they ever require diagnostic hospital scans.<br><br>In conclusion, while diagnostic imaging has transformed clinical treatment for individual patients, public health lifestyle campaigns have had a vastly greater impact on improving overall population health by preventing disease at its source."
    }
  ],

  // Lesson 18: Magic Bullets, NHS & High-Tech
  17: [
    {
      qIdx: 0,
      model: "One way healthcare access differed was that **medical care became free at the point of delivery for all citizens**. In the 1930s, only employed workers had basic health insurance; women, children, and the elderly had to pay doctors' fees or rely on charity. In contrast, after the NHS was founded in 1948, everyone was entitled to free doctor visits, hospital treatment, and medicines funded through general taxation."
    },
    {
      qIdx: 1,
      model: "The founding of the National Health Service (NHS) on 5 July 1948 by Minister of Health Aneurin Bevan was undoubtedly one of the greatest turning points in British medical history. Before 1948, healthcare was unequal: while male workers had basic GP coverage under the 1911 National Insurance Act, women, children, the elderly, and the unemployed had to pay out-of-pocket, join voluntary insurance schemes, or rely on charity hospitals. The NHS made healthcare free at the point of delivery for every citizen based on need rather than ability to pay, instantly giving millions access to doctors, hospitals, dentists, and opticians.<br><br>However, the NHS was an administrative and social reform rather than a scientific medical cure. Free healthcare alone could not cure patients without the revolutionary therapeutic breakthroughs developed during the same period. For example, before Alexander Fleming’s discovery of penicillin was mass-produced by Florey and Chain in 1943, even free hospital beds could not save patients dying from simple bacterial blood poisoning or pneumonia.<br><br>Furthermore, the twentieth century saw major public health preventative breakthroughs that had an equally transformative impact on life expectancy. Compulsory government vaccination campaigns eradicated polio and diphtheria, while the Clean Air Act of 1956 and modern anti-smoking legislation tackled environmental killers that hospital treatments could not prevent.<br><br>In conclusion, while the NHS was the decisive turning point in guaranteeing equal access to medical treatment, its true success depended entirely on simultaneous breakthroughs in antibiotics, high-tech surgery, and public health prevention."
    }
  ],

  // Lesson 19: Penicillin
  18: [
    {
      qIdx: 0,
      model: "One way both discoveries were similar was that **both came from careful observation of a chance event**. In 1796, Jenner observed that milkmaids who caught mild cowpox never caught smallpox, prompting his investigation. Similarly, in 1928, Fleming noticed by chance that a stray mould (*Penicillium*) on an unwashed Petri dish had killed the surrounding *Staphylococcus* bacteria, leading him to discover penicillin."
    },
    {
      qIdx: 1,
      model: "One reason penicillin was successfully developed was the scientific dedication of Howard Florey and Ernst Chain at Oxford University. Reading Fleming’s 1929 paper, Florey and Chain assembled a team of biochemists in 1938 to purify and stabilize penicillin. In 1940, they proved penicillin cured lethal streptococcal infections in mice, and in 1941, successfully treated policeman Albert Alexander until their tiny supply ran out.<br><br>Furthermore, World War Two created an urgent military need for a mass-produced antibiotic. With thousands of Allied soldiers suffering infected battlefield wounds, the British and US governments realized penicillin could save troops and return them to the front lines, prioritizing antibiotic research as a vital war measure.<br><br>Finally, the industrial power of the United States made mass production possible. In 1941, Florey traveled to the USA, where American pharmaceutical companies and the US government invested millions in industrial deep-tank fermentation using corn-steep liquor. By D-Day in June 1944, Allied factories had produced enough penicillin to treat every wounded Allied soldier, launching the antibiotic revolution."
    }
  ],

  // Lesson 20: Lung Cancer
  19: [
    {
      qIdx: 0,
      model: "One way government intervention was similar was the **use of compulsory national laws to protect public health**. Under the 1875 Public Health Act, the government forced local councils to clean sewers and provide fresh water. Similarly, against lung cancer, the government passed compulsory bans: banning TV cigarette adverts in 1965, printing health warnings on packets, and banning smoking in enclosed public places in 2007."
    },
    {
      qIdx: 1,
      model: "Government public health legislation and regulation have been the most effective weapons in the modern fight against lung cancer. Following Richard Doll and Austin Bradford Hill’s 1950 epidemiological study linking smoking to lung cancer, the government used compulsory legal bans: banning cigarette advertising on television in 1965, banning smoking on public transport in the 1980s, and passing the Health Act 2006, which banned smoking in all enclosed workplaces and public buildings from 2007. Combined with high taxation and compulsory graphic health warnings on plain packaging (2016), legislation has dramatically reduced smoking prevalence from over 50% in the 1950s to under 15% today.<br><br>However, legislation alone could not have succeeded without extensive public education campaigns. The government funded hard-hitting television and digital advertising campaigns showing the physical damage caused by smoking and promoting NHS smoking cessation services. These campaigns transformed social attitudes, making smoking socially unacceptable rather than glamorous.<br><br>On the other hand, advances in medical diagnosis and clinical treatment have also played a vital role in combating lung cancer. While early lung cancer was almost universally fatal, modern technologies like CT scans, PET scans, and bronchoscopies allow earlier detection before tumours spread. Furthermore, advanced treatments—including surgical tumour resection, radiotherapy, chemotherapy, and immunotherapy—have extended and saved thousands of patient lives.<br><br>In conclusion, while clinical treatments and early diagnosis have improved survival rates, compulsory government legislation was the most decisive factor because it attacked the root cause of lung cancer, preventing millions of people from ever developing the disease."
    }
  ],

  // Lesson 21: Trench Geography (Western Front)
  20: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> Communication trenches ran between the frontline, support, and reserve trenches. This allowed soldiers, supplies, and stretcher-bearers to move safely without being exposed to enemy fire.<br><br><strong>Feature 2:</strong> The underground hospital at Arras was built inside existing chalk quarries. It had 700 beds and operating theatres, completely protected from German artillery shelling."
    },
    {
      qIdx: 1,
      model: "Source A is useful for an enquiry into trench layout because it shows the zig-zag design used on the Western Front. From my own knowledge, trenches were dug in zig-zags with fire bays rather than straight lines. This ensured that if an artillery shell hit or enemy troops entered the trench, blast fragments were confined to a single section rather than traveling down the whole trench. The aerial photo also clearly shows the depth of the network, connecting frontline trenches to support lines and reserve lines.<br><br>In terms of provenance, Source A is a contemporary aerial photograph taken by the Royal Flying Corps for tactical military mapping. Because it was created to plan defense and artillery rather than for propaganda, it has high accuracy. However, it is limited because an aerial view cannot show ground-level conditions like mud, duckboards, or flooded dugouts. Overall, the source is very useful for demonstrating the defensive layout and depth of Western Front trenches."
    }
  ],

  // Lesson 22: Trench Environment & Illnesses
  21: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> To prevent trench foot, soldiers were ordered to change into dry socks twice daily and rub whale oil into their feet to protect against cold and water.<br><br><strong>Feature 2:</strong> Trench fever was caused by body lice living in uniforms. It caused severe joint pain, shivering, and high fever, keeping soldiers out of action for a month."
    },
    {
      qIdx: 1,
      model: `<table class="follow-up-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem;">
  <tbody>
    <tr>
      <td style="padding: 6px; font-weight: 700; width: 32%; border: 1px solid #cbd5e1;">Detail in Source A I would follow up:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">"Standing continuously in waterlogged mud and suffering severe pain in their feet."</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Question I would ask:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">How many soldiers in this battalion were evacuated with trench foot during winter 1914–1915?</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Type of source I would use:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">Battalion Medical Officer casualty registers and war diaries from that sector.</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">How this source would help my enquiry:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">It would show exact numbers of admissions for trench foot, revealing how severe the problem was.</td>
    </tr>
  </tbody>
</table>`
    }
  ],

  // Lesson 23: Weapons & Injuries
  22: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> Poison gas, like chlorine and mustard gas, caused severe internal and external burning, blinding soldiers and suffocating them by blistering their lungs.<br><br><strong>Feature 2:</strong> The Brodie steel helmet had a wide brim that shielded soldiers' heads and shoulders from falling shrapnel, significantly reducing fatal head injuries."
    },
    {
      qIdx: 1,
      model: "Source B is useful for an enquiry into gas protection methods because it shows British soldiers wearing the Small Box Respirator (SBR), introduced in 1916. From my own knowledge, early improvised masks like urine-soaked pads and flannel Hypo helmets gave poor protection. In contrast, the SBR had a rubber mask connected to a chest canister containing charcoal and chemical filters, which successfully filtered out chlorine and phosgene gas.<br><br>In terms of provenance, Source B is a contemporary photograph of British soldiers in frontline trenches. It provides authentic visual evidence of how the respirator was worn under active service conditions. However, the source has limitations: a photograph cannot show the intense claustrophobia and breathing difficulties soldiers felt wearing it for hours, nor does it show protection against mustard gas, which burned through uniforms. Overall, Source B is very useful for showing the design and use of the Small Box Respirator on the Western Front."
    }
  ],

  // Lesson 24: Casualty Evacuation Chain
  23: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> Casualty Clearing Stations used triage to divide wounded men into three groups: the walking wounded, those needing immediate surgery, and the hopeless cases who were only given painkillers.<br><br><strong>Feature 2:</strong> FANY women drove frontline motor ambulances and transported wounded soldiers over rough roads from dressing stations to clearing stations."
    },
    {
      qIdx: 1,
      model: `<table class="follow-up-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem;">
  <tbody>
    <tr>
      <td style="padding: 6px; font-weight: 700; width: 32%; border: 1px solid #cbd5e1;">Detail in Source A I would follow up:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">"Taking six hours to carry a single stretcher through deep mud."</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Question I would ask:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">How did frontline conditions at Passchendaele affect the survival rates of severely wounded soldiers?</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Type of source I would use:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">RAMC Field Ambulance war diaries and casualty admission registers from the Third Battle of Ypres.</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">How this source would help my enquiry:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">It would record evacuation delays and show whether longer transport times caused more wound infections and deaths.</td>
    </tr>
  </tbody>
</table>`
    }
  ],

  // Lesson 25: Surgical Breakthroughs
  24: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> The Thomas Splint pulled and stabilised broken femur bones rigid during transport, stopping bone ends grinding and cutting arteries, which reduced leg fracture mortality from 80% to 20%.<br><br><strong>Feature 2:</strong> The Carrel-Dakin method flushed infected open wounds with sterilised salt solution through rubber tubes, killing gas gangrene bacteria before sewing wounds shut."
    },
    {
      qIdx: 1,
      model: "Source A is useful for an enquiry into the treatment of fractures because it shows the Thomas Splint in active clinical use on a wounded soldier. From my own knowledge, before Hugh Owen Thomas's splint was introduced in 1915, compound fractures of the femur had an 80% death rate because broken bone ends cut arteries during transit. The splint pulled the leg into rigid traction, preventing movement and slashing femur mortality to 20% by 1916.<br><br>In terms of provenance, Source A is an official photograph taken by a military photographer at a British base hospital in France. It provides clear, authentic evidence of the metal frame supporting the patient's leg. However, as an official photograph intended for documentation, it shows an orderly hospital ward rather than chaotic battlefield conditions where stretcher-bearers had to apply splints under fire in shellholes. Overall, the source is very useful for illustrating the mechanical design and use of the Thomas Splint."
    }
  ],

  // Lesson 26: Innovations: Blood & Plastic Surgery
  25: [
    {
      qIdx: 0,
      model: "<strong>Feature 1:</strong> Harvey Cushing operated under local anaesthetic rather than general anaesthetic, using powerful electromagnets to extract brain shrapnel, raising survival rates to 71%.<br><br><strong>Feature 2:</strong> Harold Gillies developed plastic surgery using pedicle tubes of skin, grafting undamaged flesh to rebuild soldiers' shattered jaws and facial disfigurements."
    },
    {
      qIdx: 1,
      model: `<table class="follow-up-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem;">
  <tbody>
    <tr>
      <td style="padding: 6px; font-weight: 700; width: 32%; border: 1px solid #cbd5e1;">Detail in Source A I would follow up:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">"Oswald Robertson treated 20 severely wounded soldiers with stored blood."</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Question I would ask:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">How many of the 20 patients treated at the Cambrai blood bank fully recovered from wound shock?</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">Type of source I would use:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">Captain Oswald Robertson’s medical reports and CCS casualty records from November 1917.</td>
    </tr>
    <tr>
      <td style="padding: 6px; font-weight: 700; border: 1px solid #cbd5e1;">How this source would help my enquiry:</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">It would provide medical outcome data proving whether stored blood successfully prevented fatal shock in battlefield surgeries.</td>
    </tr>
  </tbody>
</table>`
    }
  ]
};

async function applyRecalibration() {
  const paths = [
    path.join(__dirname, '..', 'units', 'edexcel_medicine', 'data.js'),
    path.join(__dirname, '..', 'public', 'units', 'edexcel_medicine', 'data.js')
  ];

  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    console.log(`\nRecalibrating model answers in ${p}...`);
    const fileUrl = 'file:///' + p.replace(/\\/g, '/');
    const mod = (await import(fileUrl)).default;

    let updatedCount = 0;
    Object.entries(realisticModels).forEach(([lesIdxStr, qUpdates]) => {
      const lesIdx = parseInt(lesIdxStr, 10);
      const lesson = mod.lessons[lesIdx];
      if (!lesson || !lesson.exam_practice || !lesson.exam_practice.questions) return;

      qUpdates.forEach(update => {
        if (lesson.exam_practice.questions[update.qIdx]) {
          const oldLen = (lesson.exam_practice.questions[update.qIdx].model || '').split(/\s+/).filter(Boolean).length;
          const newLen = update.model.split(/\s+/).filter(Boolean).length;
          lesson.exam_practice.questions[update.qIdx].model = update.model;
          updatedCount++;
          // console.log(`  L${lesIdx+1} Q${update.qIdx+1}: ${oldLen} words -> ${newLen} words`);
        }
      });
    });

    fs.writeFileSync(p, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
    console.log(`✅ Successfully updated ${updatedCount} model answers in ${path.basename(p)}`);
  }
}

applyRecalibration().catch(console.error);

