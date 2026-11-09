const fs = require('fs');
const path = require('path');

const kt3Updates = {
  lesson_3_1: {
    blocks: [
      {
        act: 1,
        title: "Spontaneous Generation & Miasma Orthodoxy (c1700–1850s)",
        theme_heading: "Spontaneous Generation & Miasma Orthodoxy (c1700–1850s)",
        theme: "Spontaneous Generation & Miasma Orthodoxy (c1700–1850s)",
        text: `<span class="para-ref">[1.1]</span> In the first half of the nineteenth century, doctors still did not know what caused infectious disease. Most physicians believed in "Miasma"—the ancient theory that diseases like cholera and tuberculosis were caused by poisonous smells rising from rotting waste, swamps, and filthy streets. When powerful microscopes revealed tiny microbes living inside decaying food, scientists assumed that the rotting material created the germs. This mistaken belief was known as "Spontaneous Generation."<br><br><span class="para-ref">[1.2]</span> Because doctors believed rotting matter produced germs out of nothing, they saw no point in trying to kill bacteria to prevent disease. In Britain, prominent doctors like Dr Henry Bastian argued that microbes were simply harmless byproducts of decay, not the cause of disease. As long as doctors believed in Spontaneous Generation and Miasma, they could neither prevent infections in hospitals nor stop deadly epidemics in British cities.`,
        content: `<span class="para-ref">[1.1]</span> In the first half of the nineteenth century, doctors still did not know what caused infectious disease. Most physicians believed in "Miasma"—the ancient theory that diseases like cholera and tuberculosis were caused by poisonous smells rising from rotting waste, swamps, and filthy streets. When powerful microscopes revealed tiny microbes living inside decaying food, scientists assumed that the rotting material created the germs. This mistaken belief was known as "Spontaneous Generation."<br><br><span class="para-ref">[1.2]</span> Because doctors believed rotting matter produced germs out of nothing, they saw no point in trying to kill bacteria to prevent disease. In Britain, prominent doctors like Dr Henry Bastian argued that microbes were simply harmless byproducts of decay, not the cause of disease. As long as doctors believed in Spontaneous Generation and Miasma, they could neither prevent infections in hospitals nor stop deadly epidemics in British cities.`
      },
      {
        act: 2,
        title: "Louis Pasteur & The Germ Theory Breakthrough (1861)",
        theme_heading: "Louis Pasteur & The Germ Theory Breakthrough (1861)",
        theme: "Louis Pasteur & The Germ Theory Breakthrough (1861)",
        text: `<span class="para-ref">[2.1]</span> The breakthrough came in France in the late 1850s through chemist Louis Pasteur. A brewing company asked Pasteur to investigate why their beer and wine were turning sour. Using microscopes, Pasteur discovered that living microorganisms in the air caused fermentation and spoiling. To prove that germs came from the air rather than generating spontaneously, Pasteur conducted his famous "swan-necked flask" experiments: boiled liquid remained completely fresh in a flask with a curved neck, but spoiled as soon as the neck was snapped to let airborne germs enter.<br><br><span class="para-ref">[2.2]</span> In 1861, Pasteur published his historic Germ Theory, proving that microscopic germs were living airborne organisms that caused decay. He also showed that heating liquids killed these harmful bacteria, a process known as pasteurisation. Crucially, Pasteur suggested that if microscopic germs could turn beer sour, they might also invade the human body and cause disease. Germ Theory provided the fundamental scientific turning point in modern medicine.`,
        content: `<span class="para-ref">[2.1]</span> The breakthrough came in France in the late 1850s through chemist Louis Pasteur. A brewing company asked Pasteur to investigate why their beer and wine were turning sour. Using microscopes, Pasteur discovered that living microorganisms in the air caused fermentation and spoiling. To prove that germs came from the air rather than generating spontaneously, Pasteur conducted his famous "swan-necked flask" experiments: boiled liquid remained completely fresh in a flask with a curved neck, but spoiled as soon as the neck was snapped to let airborne germs enter.<br><br><span class="para-ref">[2.2]</span> In 1861, Pasteur published his historic Germ Theory, proving that microscopic germs were living airborne organisms that caused decay. He also showed that heating liquids killed these harmful bacteria, a process known as pasteurisation. Crucially, Pasteur suggested that if microscopic germs could turn beer sour, they might also invade the human body and cause disease. Germ Theory provided the fundamental scientific turning point in modern medicine.`
      },
      {
        act: 3,
        title: "British Scepticism & John Tyndall (1867–1876)",
        theme_heading: "British Scepticism & John Tyndall (1867–1876)",
        theme: "British Scepticism & John Tyndall (1867–1876)",
        text: `<span class="para-ref">[3.1]</span> Despite its brilliance, Germ Theory was not immediately accepted in Britain. Many British doctors dismissed Pasteur because he was an industrial chemist, not a qualified medical doctor. Sceptics pointed out that microscopes revealed millions of harmless bacteria living inside healthy people's mouths and guts, asking how germs could be the cause of fatal diseases if they were present everywhere.<br><br><span class="para-ref">[3.2]</span> The debate shifted in the 1870s thanks to British physicist John Tyndall. Tyndall conducted experiments showing that dust particles in the air carried living microbes, and gave public lectures championing Pasteur’s ideas. Meanwhile, surgeon Joseph Lister successfully applied Germ Theory to antiseptic surgery in 1865, drastically reducing hospital wound infections and forcing British medical opinion to take germs seriously.`,
        content: `<span class="para-ref">[3.1]</span> Despite its brilliance, Germ Theory was not immediately accepted in Britain. Many British doctors dismissed Pasteur because he was an industrial chemist, not a qualified medical doctor. Sceptics pointed out that microscopes revealed millions of harmless bacteria living inside healthy people's mouths and guts, asking how germs could be the cause of fatal diseases if they were present everywhere.<br><br><span class="para-ref">[3.2]</span> The debate shifted in the 1870s thanks to British physicist John Tyndall. Tyndall conducted experiments showing that dust particles in the air carried living microbes, and gave public lectures championing Pasteur’s ideas. Meanwhile, surgeon Joseph Lister successfully applied Germ Theory to antiseptic surgery in 1865, drastically reducing hospital wound infections and forcing British medical opinion to take germs seriously.`
      },
      {
        act: 4,
        title: "Robert Koch & Specific Bacteria (1876–1882)",
        theme_heading: "Robert Koch & Specific Bacteria (1876–1882)",
        theme: "Robert Koch & Specific Bacteria (1876–1882)",
        text: `<span class="para-ref">[4.1]</span> While Pasteur showed that germs caused decay, he had not proved which specific microbe caused which specific human disease. This final proof was achieved by German doctor Robert Koch. Koch developed pioneering laboratory techniques: he used synthetic chemical aniline dyes to stain transparent bacteria so they stood out clearly under microscopes, and he used solid agar jelly in flat petri dishes to grow pure cultures of single bacterial strains.<br><br><span class="para-ref">[4.2]</span> In 1876, Koch made his first breakthrough by identifying the bacterium that caused anthrax in sheep and humans. In 1882, he achieved a monumental triumph by discovering the specific microbe that caused tuberculosis, Britain’s deadliest killer. Koch photographed each bacterium through the microscope, providing undeniable visual proof that silenced sceptics across the world.`,
        content: `<span class="para-ref">[4.1]</span> While Pasteur showed that germs caused decay, he had not proved which specific microbe caused which specific human disease. This final proof was achieved by German doctor Robert Koch. Koch developed pioneering laboratory techniques: he used synthetic chemical aniline dyes to stain transparent bacteria so they stood out clearly under microscopes, and he used solid agar jelly in flat petri dishes to grow pure cultures of single bacterial strains.<br><br><span class="para-ref">[4.2]</span> In 1876, Koch made his first breakthrough by identifying the bacterium that caused anthrax in sheep and humans. In 1882, he achieved a monumental triumph by discovering the specific microbe that caused tuberculosis, Britain’s deadliest killer. Koch photographed each bacterium through the microscope, providing undeniable visual proof that silenced sceptics across the world.`
      },
      {
        act: 5,
        title: "Koch’s Postulates & The Fall of Miasma (1883–1890)",
        theme_heading: "Koch’s Postulates & The Fall of Miasma (1883–1890)",
        theme: "Koch’s Postulates & The Fall of Miasma (1883–1890)",
        text: `<span class="para-ref">[5.1]</span> In 1883, Koch traveled to Egypt and India and isolated the comma-shaped bacterium that caused cholera (*Vibrio cholerae*) in contaminated water, finally proving that cholera was a waterborne bacterial infection rather than an airborne miasma. Koch established strict scientific rules, known as "Koch's Postulates", to prove scientifically that a specific germ was the true cause of a disease.<br><br><span class="para-ref">[5.2]</span> Together, Pasteur and Koch completely destroyed the ancient theories of Miasma and Spontaneous Generation. By identifying the exact microbes causing disease, they allowed scientists to develop targeted vaccines, enabled municipal governments to clean up contaminated water supplies, and opened the door to the modern search for "magic bullets" and antibiotics.`,
        content: `<span class="para-ref">[5.1]</span> In 1883, Koch traveled to Egypt and India and isolated the comma-shaped bacterium that caused cholera (*Vibrio cholerae*) in contaminated water, finally proving that cholera was a waterborne bacterial infection rather than an airborne miasma. Koch established strict scientific rules, known as "Koch's Postulates", to prove scientifically that a specific germ was the true cause of a disease.<br><br><span class="para-ref">[5.2]</span> Together, Pasteur and Koch completely destroyed the ancient theories of Miasma and Spontaneous Generation. By identifying the exact microbes causing disease, they allowed scientists to develop targeted vaccines, enabled municipal governments to clean up contaminated water supplies, and opened the door to the modern search for "magic bullets" and antibiotics.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what was the theory of Spontaneous Generation?",
        answer: "The mistaken belief that rotting matter and decay created living microbes out of nothing."
      },
      {
        question: "Using paragraph [2.1], what did Louis Pasteur's swan-necked flask experiment prove?",
        answer: "That boiled liquid only spoiled when exposed to airborne microbes, proving germs came from the air rather than generating spontaneously."
      },
      {
        question: "According to paragraph [4.1], what two experimental techniques did Robert Koch invent to study bacteria?",
        answer: "Using chemical aniline dyes to stain transparent bacteria, and using agar jelly in petri dishes to grow pure bacterial cultures."
      },
      {
        question: "Using paragraph [5.1], what specific disease-causing bacterium did Robert Koch isolate in contaminated water in 1883?",
        answer: "The cholera bacterium (Vibrio cholerae), proving cholera was spread by contaminated drinking water rather than airborne miasma."
      }
    ]
  },
  lesson_3_2: {
    blocks: [
      {
        act: 1,
        title: "The Scourge of Smallpox & Risky Inoculation (1721–1795)",
        theme_heading: "The Scourge of Smallpox & Risky Inoculation (1721–1795)",
        theme: "The Scourge of Smallpox & Risky Inoculation (1721–1795)",
        text: `<span class="para-ref">[1.1]</span> Throughout the eighteenth century, smallpox was the most terrifying epidemic killer in Britain, killing roughly one in three infected people and leaving survivors blind or disfigured with deep scars. The only known prevention was "inoculation" (variolation), introduced to Britain from the Ottoman Empire by Lady Mary Wortley Montagu in 1721. Doctors made a small cut in a patient's arm and inserted live pus from an active smallpox scab, hoping to cause a mild case of the illness.<br><br><span class="para-ref">[1.2]</span> Inoculation had fatal drawbacks: patients often developed full-blown smallpox and died, and inoculated patients could spark deadly new outbreaks among their neighbours. Inoculation was also expensive, meaning only wealthy families could afford private inoculation clinics, while poor communities remained unprotected.`,
        content: `<span class="para-ref">[1.1]</span> Throughout the eighteenth century, smallpox was the most terrifying epidemic killer in Britain, killing roughly one in three infected people and leaving survivors blind or disfigured with deep scars. The only known prevention was "inoculation" (variolation), introduced to Britain from the Ottoman Empire by Lady Mary Wortley Montagu in 1721. Doctors made a small cut in a patient's arm and inserted live pus from an active smallpox scab, hoping to cause a mild case of the illness.<br><br><span class="para-ref">[1.2]</span> Inoculation had fatal drawbacks: patients often developed full-blown smallpox and died, and inoculated patients could spark deadly new outbreaks among their neighbours. Inoculation was also expensive, meaning only wealthy families could afford private inoculation clinics, while poor communities remained unprotected.`
      },
      {
        act: 2,
        title: "Edward Jenner & The Cowpox Vaccine (1796–1798)",
        theme_heading: "Edward Jenner & The Cowpox Vaccine (1796–1798)",
        theme: "Edward Jenner & The Cowpox Vaccine (1796–1798)",
        text: `<span class="para-ref">[2.1]</span> In Gloucestershire, country doctor Edward Jenner observed a piece of rural folklore: local dairy maids who caught mild cowpox from cows never caught deadly smallpox. Jenner decided to test this scientifically. In May 1796, Jenner took pus from a cowpox sore on dairymaid Sarah Nelmes and scratched it into the arm of eight-year-old James Phipps (<span class="archival-meta-tag">Source A</span>). Phipps developed a mild fever but recovered quickly.<br><br><span class="para-ref">[2.2]</span> Several weeks later, Jenner inoculated Phipps with real smallpox pus. The boy developed no smallpox whatsoever. Jenner repeated the experiment on over twenty people, proving that cowpox provided complete immunity against smallpox. Jenner called this new procedure "vaccination", from *vacca*, the Latin word for cow. Unlike inoculation, vaccination was completely safe, never caused smallpox, and could not pass disease to others.`,
        content: `<span class="para-ref">[2.1]</span> In Gloucestershire, country doctor Edward Jenner observed a piece of rural folklore: local dairy maids who caught mild cowpox from cows never caught deadly smallpox. Jenner decided to test this scientifically. In May 1796, Jenner took pus from a cowpox sore on dairymaid Sarah Nelmes and scratched it into the arm of eight-year-old James Phipps (<span class="archival-meta-tag">Source A</span>). Phipps developed a mild fever but recovered quickly.<br><br><span class="para-ref">[2.2]</span> Several weeks later, Jenner inoculated Phipps with real smallpox pus. The boy developed no smallpox whatsoever. Jenner repeated the experiment on over twenty people, proving that cowpox provided complete immunity against smallpox. Jenner called this new procedure "vaccination", from *vacca*, the Latin word for cow. Unlike inoculation, vaccination was completely safe, never caused smallpox, and could not pass disease to others.`
      },
      {
        act: 3,
        title: "Medical Opposition & Religious Resistance (1798–1810s)",
        theme_heading: "Medical Opposition & Religious Resistance (1798–1810s)",
        theme: "Medical Opposition & Religious Resistance (1798–1810s)",
        text: `<span class="para-ref">[3.1]</span> When Jenner published his findings in 1798, he faced fierce opposition. The Royal Society refused to print his paper, claiming his evidence was too small. Religious leaders preached that injecting fluid from diseased animals into humans was sinful and against God’s will, while satirical cartoons depicted vaccinated patients growing cow horns and tails.<br><br><span class="para-ref">[3.2]</span> Furthermore, commercial inoculators who made huge fortunes charging wealthy clients for private smallpox inoculations campaigned aggressively against vaccination to protect their profits. Because Jenner could not explain *how* cowpox provided immunity (since Germ Theory had not yet been discovered), many London doctors were reluctant to trust his method.`,
        content: `<span class="para-ref">[3.1]</span> When Jenner published his findings in 1798, he faced fierce opposition. The Royal Society refused to print his paper, claiming his evidence was too small. Religious leaders preached that injecting fluid from diseased animals into humans was sinful and against God’s will, while satirical cartoons depicted vaccinated patients growing cow horns and tails.<br><br><span class="para-ref">[3.2]</span> Furthermore, commercial inoculators who made huge fortunes charging wealthy clients for private smallpox inoculations campaigned aggressively against vaccination to protect their profits. Because Jenner could not explain *how* cowpox provided immunity (since Germ Theory had not yet been discovered), many London doctors were reluctant to trust his method.`
      },
      {
        act: 4,
        title: "Parliamentary Grants & The 1840 Vaccination Act (1802–1840)",
        theme_heading: "Parliamentary Grants & The 1840 Vaccination Act (1802–1840)",
        theme: "Parliamentary Grants & The 1840 Vaccination Act (1802–1840)",
        text: `<span class="para-ref">[4.1]</span> Despite early opposition, vaccination’s overwhelming success won over the British government. In 1802 and 1807, Parliament awarded Jenner £30,000 to fund his research, and the royal family had their children vaccinated. The British Army and Navy made vaccination compulsory for soldiers and sailors, eliminating smallpox outbreaks among troops.<br><br><span class="para-ref">[4.2]</span> In 1840, Parliament took decisive legislative action: the 1840 Vaccination Act banned dangerous smallpox inoculation entirely and provided free, state-funded cowpox vaccination for all infants, marking an important step away from laissez-faire government towards state-funded preventive medicine.`,
        content: `<span class="para-ref">[4.1]</span> Despite early opposition, vaccination’s overwhelming success won over the British government. In 1802 and 1807, Parliament awarded Jenner £30,000 to fund his research, and the royal family had their children vaccinated. The British Army and Navy made vaccination compulsory for soldiers and sailors, eliminating smallpox outbreaks among troops.<br><br><span class="para-ref">[4.2]</span> In 1840, Parliament took decisive legislative action: the 1840 Vaccination Act banned dangerous smallpox inoculation entirely and provided free, state-funded cowpox vaccination for all infants, marking an important step away from laissez-faire government towards state-funded preventive medicine.`
      },
      {
        act: 5,
        title: "Compulsory Vaccination & The Anti-Vaccination League (1852–1871)",
        theme_heading: "Compulsory Vaccination & The Anti-Vaccination League (1852–1871)",
        theme: "Compulsory Vaccination & The Anti-Vaccination League (1852–1871)",
        text: `<span class="para-ref">[5.1]</span> In 1852, the government made smallpox vaccination compulsory for all infants, and in 1871 introduced strict fines for parents who refused. This sparked major civil protests, with critics forming the Anti-Vaccination League to defend personal liberty against government control.<br><br><span class="para-ref">[5.2]</span> Nevertheless, government enforcement drastically reduced smallpox deaths across Britain, leading the World Health Organization to declare smallpox completely eradicated worldwide in 1980. For GCSE historians, Jenner demonstrated the power of careful scientific experimentation, while the government’s vaccination acts marked the start of modern public health legislation.`,
        content: `<span class="para-ref">[5.1]</span> In 1852, the government made smallpox vaccination compulsory for all infants, and in 1871 introduced strict fines for parents who refused. This sparked major civil protests, with critics forming the Anti-Vaccination League to defend personal liberty against government control.<br><br><span class="para-ref">[5.2]</span> Nevertheless, government enforcement drastically reduced smallpox deaths across Britain, leading the World Health Organization to declare smallpox completely eradicated worldwide in 1980. For GCSE historians, Jenner demonstrated the power of careful scientific experimentation, while the government’s vaccination acts marked the start of modern public health legislation.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what was smallpox inoculation (variolation)?",
        answer: "Inserting live pus from an active smallpox scab into a cut on a patient's arm to produce a mild case of the disease."
      },
      {
        question: "Using paragraph [2.1], what folklore observation led Edward Jenner to develop the cowpox vaccine?",
        answer: "Dairymaids who caught mild cowpox from cows never caught deadly smallpox."
      },
      {
        question: "According to paragraph [3.1], why did religious leaders and commercial inoculators oppose vaccination?",
        answer: "Religious leaders called animal inoculation sinful, while commercial inoculators feared losing private profits from smallpox inoculation."
      },
      {
        question: "Using paragraph [4.2], what two major steps did the 1840 Vaccination Act take?",
        answer: "It banned dangerous smallpox inoculation entirely and provided free, state-funded cowpox vaccination for all infants."
      }
    ]
  },
  lesson_3_3: {
    blocks: [
      {
        act: 1,
        title: "Pestilential Wards & Pre-Modern Nursing (c1700–1850)",
        theme_heading: "Pestilential Wards & Pre-Modern Nursing (c1700–1850)",
        theme: "Pestilential Wards & Pre-Modern Nursing (c1700–1850)",
        text: `<span class="para-ref">[1.1]</span> In the first half of the nineteenth century, British hospitals were dirty and dangerous places. Patients were crammed into overcrowded wards with poor ventilation, unwashed bedsheets, and open latrines that spread foul odours and infections. Wounds regularly developed hospital gangrene, meaning patients who entered hospital often caught fatal infections inside.<br><br><span class="para-ref">[1.2]</span> Nurses were viewed with low social respect: they received no formal medical training and were widely regarded as uneducated, poorly paid, and often drunk (famously stereotyped by Charles Dickens as "Betsy Prig"). Respectable women avoided nursing, and doctors treated nurses as domestic servants rather than skilled medical professionals.`,
        content: `<span class="para-ref">[1.1]</span> In the first half of the nineteenth century, British hospitals were dirty and dangerous places. Patients were crammed into overcrowded wards with poor ventilation, unwashed bedsheets, and open latrines that spread foul odours and infections. Wounds regularly developed hospital gangrene, meaning patients who entered hospital often caught fatal infections inside.<br><br><span class="para-ref">[1.2]</span> Nurses were viewed with low social respect: they received no formal medical training and were widely regarded as uneducated, poorly paid, and often drunk (famously stereotyped by Charles Dickens as "Betsy Prig"). Respectable women avoided nursing, and doctors treated nurses as domestic servants rather than skilled medical professionals.`
      },
      {
        act: 2,
        title: "Scutari Hospital & The Crimean Sanitary Revolution (1854–1856)",
        theme_heading: "Scutari Hospital & The Crimean Sanitary Revolution (1854–1856)",
        theme: "Scutari Hospital & The Crimean Sanitary Revolution (1854–1856)",
        text: `<span class="para-ref">[2.1]</span> In 1854, Britain entered the Crimean War against Russia. Newspaper reports revealed horrific conditions in the British military hospital at Scutari: wounded soldiers lay in filthy wards infested with lice, contaminated with sewage, and lacking clean bandages. The hospital death rate reached a catastrophic 42%, with far more soldiers dying from cholera and typhoid than battlefield injuries.<br><br><span class="para-ref">[2.2]</span> The British government sent Florence Nightingale and thirty-eight volunteer nurses to Scutari. Nightingale immediately enforced strict cleanliness: she organized soldiers' wives to boil bedsheets, cleaned hospital wards, provided nutritious food, and opened windows for fresh air. Although Nightingale believed in Miasma theory rather than germs, her sanitary reforms and the arrival of a government Sanitary Commission to clear blocked sewers caused the death rate at Scutari to plummet from 42% to 2%.`,
        content: `<span class="para-ref">[2.1]</span> In 1854, Britain entered the Crimean War against Russia. Newspaper reports revealed horrific conditions in the British military hospital at Scutari: wounded soldiers lay in filthy wards infested with lice, contaminated with sewage, and lacking clean bandages. The hospital death rate reached a catastrophic 42%, with far more soldiers dying from cholera and typhoid than battlefield injuries.<br><br><span class="para-ref">[2.2]</span> The British government sent Florence Nightingale and thirty-eight volunteer nurses to Scutari. Nightingale immediately enforced strict cleanliness: she organized soldiers' wives to boil bedsheets, cleaned hospital wards, provided nutritious food, and opened windows for fresh air. Although Nightingale believed in Miasma theory rather than germs, her sanitary reforms and the arrival of a government Sanitary Commission to clear blocked sewers caused the death rate at Scutari to plummet from 42% to 2%.`
      },
      {
        act: 3,
        title: "Notes on Nursing & Statistical Reforms (1859)",
        theme_heading: "Notes on Nursing & Statistical Reforms (1859)",
        theme: "Notes on Nursing & Statistical Reforms (1859)",
        text: `<span class="para-ref">[3.1]</span> Returning to Britain as a national heroine, Nightingale used her fame to demand permanent hospital reform. She was a brilliant statistician who invented the "coxcomb" pie chart to prove visually to politicians that hospital filth and preventable infections killed vastly more British soldiers than Russian bullets.<br><br><span class="para-ref">[3.2]</span> In 1859, Nightingale published *Notes on Nursing*, an accessible guide for ordinary women on patient care. She argued that the essential requirements for health were pure air, pure water, efficient drainage, cleanliness, and light, establishing hygiene as the foundation of modern nursing care.`,
        content: `<span class="para-ref">[3.1]</span> Returning to Britain as a national heroine, Nightingale used her fame to demand permanent hospital reform. She was a brilliant statistician who invented the "coxcomb" pie chart to prove visually to politicians that hospital filth and preventable infections killed vastly more British soldiers than Russian bullets.<br><br><span class="para-ref">[3.2]</span> In 1859, Nightingale published *Notes on Nursing*, an accessible guide for ordinary women on patient care. She argued that the essential requirements for health were pure air, pure water, efficient drainage, cleanliness, and light, establishing hygiene as the foundation of modern nursing care.`
      },
      {
        act: 4,
        title: "The Pavilion Plan & Hospital Design (1860s)",
        theme_heading: "The Pavilion Plan & Hospital Design (1860s)",
        theme: "The Pavilion Plan & Hospital Design (1860s)",
        text: `<span class="para-ref">[4.1]</span> In 1859, Nightingale published *Notes on Hospitals*, advocating a complete transformation of hospital architecture known as the "Pavilion Plan." Instead of large single blocks, hospitals were built with separate pavilion wings connected by covered walkways, preventing foul air from circulating between infectious patients.<br><br><span class="para-ref">[4.2]</span> Wards were designed with high ceilings and large opposing windows to create cross-ventilation, while walls and floors were lined with easily washable glazed tiles. This architectural design was adopted in major hospitals like St Thomas’s in London, drastically reducing cross-infection rates.`,
        content: `<span class="para-ref">[4.1]</span> In 1859, Nightingale published *Notes on Hospitals*, advocating a complete transformation of hospital architecture known as the "Pavilion Plan." Instead of large single blocks, hospitals were built with separate pavilion wings connected by covered walkways, preventing foul air from circulating between infectious patients.<br><br><span class="para-ref">[4.2]</span> Wards were designed with high ceilings and large opposing windows to create cross-ventilation, while walls and floors were lined with easily washable glazed tiles. This architectural design was adopted in major hospitals like St Thomas’s in London, drastically reducing cross-infection rates.`
      },
      {
        act: 5,
        title: "Professional Nurse Training & Mary Seacole (1860–1890s)",
        theme_heading: "Professional Nurse Training & Mary Seacole (1860–1890s)",
        theme: "Professional Nurse Training & Mary Seacole (1860–1890s)",
        text: `<span class="para-ref">[5.1]</span> In 1860, Nightingale used public donations to establish the Nightingale Training School for Nurses at St Thomas’s Hospital in London. For the first time, nursing became a respected, trained profession for educated women, with strict codes of discipline, clinical standards, and hygiene.<br><br><span class="para-ref">[5.2]</span> Alongside Nightingale, Jamaican-Scottish nurse Mary Seacole made a heroic contribution in the Crimea. After being rejected by the War Office, Seacole funded her own journey to Crimea, establishing the "British Hotel" near Sevastopol to provide hot meals, herbal medicines, and direct battlefield first aid to wounded soldiers under fire. For GCSE historians, Nightingale and Seacole together transformed nursing from disreputable servant work into a vital, life-saving medical profession.`,
        content: `<span class="para-ref">[5.1]</span> In 1860, Nightingale used public donations to establish the Nightingale Training School for Nurses at St Thomas’s Hospital in London. For the first time, nursing became a respected, trained profession for educated women, with strict codes of discipline, clinical standards, and hygiene.<br><br><span class="para-ref">[5.2]</span> Alongside Nightingale, Jamaican-Scottish nurse Mary Seacole made a heroic contribution in the Crimea. After being rejected by the War Office, Seacole funded her own journey to Crimea, establishing the "British Hotel" near Sevastopol to provide hot meals, herbal medicines, and direct battlefield first aid to wounded soldiers under fire. For GCSE historians, Nightingale and Seacole together transformed nursing from disreputable servant work into a vital, life-saving medical profession.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], why were early nineteenth-century British hospitals dangerous places for patients?",
        answer: "Overcrowded wards, poor ventilation, and open latrines spread deadly hospital infections like gangrene."
      },
      {
        question: "Using paragraph [2.2], what practical hygiene reforms did Florence Nightingale introduce at Scutari hospital?",
        answer: "Boiling dirty bedsheets, cleaning wards, opening windows for fresh air, and providing nutritious food."
      },
      {
        question: "According to paragraph [4.1], what was the \"Pavilion Plan\" for hospital design?",
        answer: "Building hospitals with separate pavilion wings connected by walkways to stop contaminated air circulating between wards."
      },
      {
        question: "Using paragraph [5.2], how did Mary Seacole provide medical care to soldiers during the Crimean War?",
        answer: "She funded her own journey to open the British Hotel, providing hot meals, herbal treatments, and battlefield aid under fire."
      }
    ]
  },
  lesson_3_4: {
    blocks: [
      {
        act: 1,
        title: "Pre-Anaesthetic Surgery: Raw Speed & Agony (c1700–1846)",
        theme_heading: "Pre-Anaesthetic Surgery: Raw Speed & Agony (c1700–1846)",
        theme: "Pre-Anaesthetic Surgery: Raw Speed & Agony (c1700–1846)",
        text: `<span class="para-ref">[1.1]</span> Before the mid-nineteenth century, surgery was an ordeal of unimaginable agony. Surgeons faced three fatal obstacles: pain, bleeding, and infection. Because patients were fully conscious and screaming in agony, surgery had to be performed with blinding speed. Surgeons were judged by how quickly they could operate, such as Robert Liston who famously amputated a leg in twenty-eight seconds.<br><br><span class="para-ref">[1.2]</span> Patients had to be physically pinned down by powerful assistants. The sheer shock of pain frequently caused patients' hearts to stop on the operating table, and complex internal operations inside the chest or abdomen were impossible. Most people preferred to face death rather than undergo surgery.`,
        content: `<span class="para-ref">[1.1]</span> Before the mid-nineteenth century, surgery was an ordeal of unimaginable agony. Surgeons faced three fatal obstacles: pain, bleeding, and infection. Because patients were fully conscious and screaming in agony, surgery had to be performed with blinding speed. Surgeons were judged by how quickly they could operate, such as Robert Liston who famously amputated a leg in twenty-eight seconds.<br><br><span class="para-ref">[1.2]</span> Patients had to be physically pinned down by powerful assistants. The sheer shock of pain frequently caused patients' hearts to stop on the operating table, and complex internal operations inside the chest or abdomen were impossible. Most people preferred to face death rather than undergo surgery.`
      },
      {
        act: 2,
        title: "James Simpson & The Discovery of Chloroform (1847–1853)",
        theme_heading: "James Simpson & The Discovery of Chloroform (1847–1853)",
        theme: "James Simpson & The Discovery of Chloroform (1847–1853)",
        text: `<span class="para-ref">[2.1]</span> Early chemical pain relief had major drawbacks: nitrous oxide (laughing gas) was too weak, while ether (first used in 1846) irritated patients' lungs and was dangerously explosive. In Edinburgh in 1847, obstetrician James Simpson and his medical friends tested various chemicals around his dining table. After inhaling chloroform vapour, they immediately collapsed unconscious under the table, waking up completely unharmed.<br><br><span class="para-ref">[2.2]</span> Simpson began administering chloroform to women during childbirth. Although some religious preachers objected that pain in childbirth was God’s will, opposition collapsed in 1853 when Queen Victoria used chloroform during the birth of Prince Leopold, declaring the pain relief "delightful beyond measure." Chloroform conquered the problem of surgical pain.`,
        content: `<span class="para-ref">[2.1]</span> Early chemical pain relief had major drawbacks: nitrous oxide (laughing gas) was too weak, while ether (first used in 1846) irritated patients' lungs and was dangerously explosive. In Edinburgh in 1847, obstetrician James Simpson and his medical friends tested various chemicals around his dining table. After inhaling chloroform vapour, they immediately collapsed unconscious under the table, waking up completely unharmed.<br><br><span class="para-ref">[2.2]</span> Simpson began administering chloroform to women during childbirth. Although some religious preachers objected that pain in childbirth was God’s will, opposition collapsed in 1853 when Queen Victoria used chloroform during the birth of Prince Leopold, declaring the pain relief "delightful beyond measure." Chloroform conquered the problem of surgical pain.`
      },
      {
        act: 3,
        title: "The \"Black Period\" of Surgery (1846–1865)",
        theme_heading: "The \"Black Period\" of Surgery (1846–1865)",
        theme: "The \"Black Period\" of Surgery (1846–1865)",
        text: `<span class="para-ref">[3.1]</span> Paradoxically, conquering pain led directly to the disastrous "Black Period" of surgery (1846–1865), in which surgical death rates actually increased. Because patients were unconscious and motionless, surgeons operated for much longer and attempted deeper, more complicated internal operations.<br><br><span class="para-ref">[3.2]</span> However, because Germ Theory was not yet known, surgeons still operated in filthy, blood-stained coats, used unwashed instruments, and used unsterilized catgut stitches. Operating deeper for longer introduced bacteria straight into internal body cavities, causing hundreds of patients to die from fatal wound infections (sepsis and gangrene) days after painless operations.`,
        content: `<span class="para-ref">[3.1]</span> Paradoxically, conquering pain led directly to the disastrous "Black Period" of surgery (1846–1865), in which surgical death rates actually increased. Because patients were unconscious and motionless, surgeons operated for much longer and attempted deeper, more complicated internal operations.<br><br><span class="para-ref">[3.2]</span> However, because Germ Theory was not yet known, surgeons still operated in filthy, blood-stained coats, used unwashed instruments, and used unsterilized catgut stitches. Operating deeper for longer introduced bacteria straight into internal body cavities, causing hundreds of patients to die from fatal wound infections (sepsis and gangrene) days after painless operations.`
      },
      {
        act: 4,
        title: "Joseph Lister & The Carbolic Acid Spray (1865–1870s)",
        theme_heading: "Joseph Lister & The Carbolic Acid Spray (1865–1870s)",
        theme: "Joseph Lister & The Carbolic Acid Spray (1865–1870s)",
        text: `<span class="para-ref">[4.1]</span> In 1865, Scottish surgeon Joseph Lister resolved to conquer surgical infection. Reading Louis Pasteur’s 1861 Germ Theory, Lister realized that wound sepsis was not caused by bad air, but by living airborne microbes entering open wounds. Lister knew that carbolic acid was used to treat smelly sewage, and decided to test it as an antiseptic to kill bacteria on wounds.<br><br><span class="para-ref">[4.2]</span> In August 1865, Lister treated eleven-year-old Jamie Greenlees, who had suffered a compound leg fracture after being run over by a cart. Instead of amputating, Lister soaked bandages in carbolic acid; the fracture healed without any infection. Lister developed a carbolic spray machine to mist the air over operating tables and soaked instruments and dressings. In his Glasgow hospital wards, post-operative death rates dropped dramatically from 46% to 15%.`,
        content: `<span class="para-ref">[4.1]</span> In 1865, Scottish surgeon Joseph Lister resolved to conquer surgical infection. Reading Louis Pasteur’s 1861 Germ Theory, Lister realized that wound sepsis was not caused by bad air, but by living airborne microbes entering open wounds. Lister knew that carbolic acid was used to treat smelly sewage, and decided to test it as an antiseptic to kill bacteria on wounds.<br><br><span class="para-ref">[4.2]</span> In August 1865, Lister treated eleven-year-old Jamie Greenlees, who had suffered a compound leg fracture after being run over by a cart. Instead of amputating, Lister soaked bandages in carbolic acid; the fracture healed without any infection. Lister developed a carbolic spray machine to mist the air over operating tables and soaked instruments and dressings. In his Glasgow hospital wards, post-operative death rates dropped dramatically from 46% to 15%.`
      },
      {
        act: 5,
        title: "From Antiseptic to Aseptic Surgery (1880s–1890s)",
        theme_heading: "From Antiseptic to Aseptic Surgery (1880s–1890s)",
        theme: "From Antiseptic to Aseptic Surgery (1880s–1890s)",
        text: `<span class="para-ref">[5.1]</span> While carbolic acid was effective, it had unpleasant drawbacks: it cracked surgeons' hands, irritated patients' lungs, and slowed down operations. By the late 1880s, surgeons moved from "antiseptic surgery" (killing germs already present) to "aseptic surgery" (preventing germs from entering the operating theatre in the first place).<br><br><span class="para-ref">[5.2]</span> Operating theatres were redesigned with scrubbed, sterilized surfaces. In 1881, Charles Chamberland and Robert Koch developed the steam autoclave to sterilize instruments with high-temperature steam. Surgeons scrubbed their hands, wore sterile white gowns, masks, and rubber gloves (invented by William Halsted in 1890). Surgery was transformed from a terrifying lottery into a clean, safe science.`,
        content: `<span class="para-ref">[5.1]</span> While carbolic acid was effective, it had unpleasant drawbacks: it cracked surgeons' hands, irritated patients' lungs, and slowed down operations. By the late 1880s, surgeons moved from "antiseptic surgery" (killing germs already present) to "aseptic surgery" (preventing germs from entering the operating theatre in the first place).<br><br><span class="para-ref">[5.2]</span> Operating theatres were redesigned with scrubbed, sterilized surfaces. In 1881, Charles Chamberland and Robert Koch developed the steam autoclave to sterilize instruments with high-temperature steam. Surgeons scrubbed their hands, wore sterile white gowns, masks, and rubber gloves (invented by William Halsted in 1890). Surgery was transformed from a terrifying lottery into a clean, safe science.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what were the three major obstacles facing surgeons before the mid-nineteenth century?",
        answer: "Pain, bleeding, and infection."
      },
      {
        question: "Using paragraph [2.2], whose royal endorsement in 1853 made chloroform widely accepted in Britain?",
        answer: "Queen Victoria, who used chloroform during the birth of Prince Leopold."
      },
      {
        question: "According to paragraph [3.1], why did the \"Black Period\" of surgery occur between 1846 and 1865?",
        answer: "Surgeons operated deeper and longer on unconscious patients, but without hygiene, death rates from infection soared."
      },
      {
        question: "Using paragraph [5.1], what is the difference between antiseptic surgery and aseptic surgery?",
        answer: "Antiseptic surgery kills germs already in the wound, while aseptic surgery keeps germs out of the operating room completely."
      }
    ]
  },
  lesson_3_5: {
    blocks: [
      {
        act: 1,
        title: "Industrial Slums, Edwin Chadwick & The 1848 Public Health Act (1831–1848)",
        theme_heading: "Industrial Slums, Edwin Chadwick & The 1848 Public Health Act (1831–1848)",
        theme: "Industrial Slums, Edwin Chadwick & The 1848 Public Health Act (1831–1848)",
        text: `<span class="para-ref">[1.1]</span> During the Industrial Revolution, British towns and cities grew at dizzying speed. Factories drew millions of rural workers into overcrowded slums with back-to-back housing, no piped water, and overflowing shared cesspools. In 1831, a terrifying new epidemic arrived in Britain from India: cholera, an agonizing waterborne disease causing severe vomiting and diarrhoea that could kill a healthy adult within hours.<br><br><span class="para-ref">[1.2]</span> In 1842, reformer Edwin Chadwick published a shocking report on *The Sanitary Condition of the Labouring Population*, proving that filthy living conditions directly caused disease and reduced life expectancy for industrial workers to just nineteen years. Following a second cholera epidemic, Parliament passed the 1848 Public Health Act, allowing towns to set up local health boards. However, the act was not compulsory, and most local councils refused to spend taxpayers' money on sewers, leaving public health in the grip of *laissez-faire* ("leave alone") government.`,
        content: `<span class="para-ref">[1.1]</span> During the Industrial Revolution, British towns and cities grew at dizzying speed. Factories drew millions of rural workers into overcrowded slums with back-to-back housing, no piped water, and overflowing shared cesspools. In 1831, a terrifying new epidemic arrived in Britain from India: cholera, an agonizing waterborne disease causing severe vomiting and diarrhoea that could kill a healthy adult within hours.<br><br><span class="para-ref">[1.2]</span> In 1842, reformer Edwin Chadwick published a shocking report on *The Sanitary Condition of the Labouring Population*, proving that filthy living conditions directly caused disease and reduced life expectancy for industrial workers to just nineteen years. Following a second cholera epidemic, Parliament passed the 1848 Public Health Act, allowing towns to set up local health boards. However, the act was not compulsory, and most local councils refused to spend taxpayers' money on sewers, leaving public health in the grip of *laissez-faire* ("leave alone") government.`
      },
      {
        act: 2,
        title: "John Snow & The Broad Street Pump (1854)",
        theme_heading: "John Snow & The Broad Street Pump (1854)",
        theme: "John Snow & The Broad Street Pump (1854)",
        text: `<span class="para-ref">[2.1]</span> In August 1854, a catastrophic cholera outbreak struck the crowded Soho district of central London, killing over five hundred people within ten days. While official medical orthodoxy blamed miasma (bad air), local doctor John Snow suspected that cholera was swallowed through contaminated drinking water. Snow conducted a meticulous epidemiological investigation, mapping every cholera death on a street map of Soho.<br><br><span class="para-ref">[2.2]</span> Snow’s map revealed that almost all the deaths clustered around a single public water pump on Broad Street (<span class="archival-meta-tag">Source A</span>). Nearby brewery workers who drank only beer survived completely, while a woman in distant Hampstead who had water from the Broad Street pump delivered to her died. Snow persuaded the local parish council to remove the handle from the Broad Street pump; immediately, the cholera outbreak ceased.`,
        content: `<span class="para-ref">[2.1]</span> In August 1854, a catastrophic cholera outbreak struck the crowded Soho district of central London, killing over five hundred people within ten days. While official medical orthodoxy blamed miasma (bad air), local doctor John Snow suspected that cholera was swallowed through contaminated drinking water. Snow conducted a meticulous epidemiological investigation, mapping every cholera death on a street map of Soho.<br><br><span class="para-ref">[2.2]</span> Snow’s map revealed that almost all the deaths clustered around a single public water pump on Broad Street (<span class="archival-meta-tag">Source A</span>). Nearby brewery workers who drank only beer survived completely, while a woman in distant Hampstead who had water from the Broad Street pump delivered to her died. Snow persuaded the local parish council to remove the handle from the Broad Street pump; immediately, the cholera outbreak ceased.`
      },
      {
        act: 3,
        title: "Snow’s Water Proof & Medical Scepticism (1854–1858)",
        theme_heading: "Snow’s Water Proof & Medical Scepticism (1854–1858)",
        theme: "Snow’s Water Proof & Medical Scepticism (1854–1858)",
        text: `<span class="para-ref">[3.1]</span> Further investigation proved that a cracked cesspool from an infected baby’s home had leaked raw sewage straight into the Broad Street well. Snow reinforced his findings with his "Grand Experiment" in South London, comparing two water companies: customers of the Southwark and Vauxhall company (which drew sewage-polluted water from the lower Thames) died of cholera at nine times the rate of Lambeth company customers (which drew clean water upstream).<br><br><span class="para-ref">[3.2]</span> Despite Snow’s overwhelming statistical proof, the government General Board of Health rejected his findings in 1855, stubbornly insisting that miasma caused cholera. Because Germ Theory had not yet been published, politicians resisted spending millions on clean water pipes when they still believed that bad smells were the culprit.`,
        content: `<span class="para-ref">[3.1]</span> Further investigation proved that a cracked cesspool from an infected baby’s home had leaked raw sewage straight into the Broad Street well. Snow reinforced his findings with his "Grand Experiment" in South London, comparing two water companies: customers of the Southwark and Vauxhall company (which drew sewage-polluted water from the lower Thames) died of cholera at nine times the rate of Lambeth company customers (which drew clean water upstream).<br><br><span class="para-ref">[3.2]</span> Despite Snow’s overwhelming statistical proof, the government General Board of Health rejected his findings in 1855, stubbornly insisting that miasma caused cholera. Because Germ Theory had not yet been published, politicians resisted spending millions on clean water pipes when they still believed that bad smells were the culprit.`
      },
      {
        act: 4,
        title: "The Great Stink of 1858 & Bazalgette’s London Sewers (1858–1865)",
        theme_heading: "The Great Stink of 1858 & Bazalgette’s London Sewers (1858–1865)",
        theme: "The Great Stink of 1858 & Bazalgette’s London Sewers (1858–1865)",
        text: `<span class="para-ref">[4.1]</span> What finally broke government inaction was not medical proof, but the political crisis of the "Great Stink" in the scorching summer of 1858. The River Thames, which acted as an open sewer for two million Londoners, produced a stench so nauseating that parliamentary curtains were soaked in chloride of lime and MPs were forced to flee the chamber in disgust.<br><br><span class="para-ref">[4.2]</span> Terrified that miasma would kill politicians themselves, Parliament passed emergency legislation in just eighteen days, granting £3 million to chief engineer Joseph Bazalgette. Between 1858 and 1865, Bazalgette constructed 82 miles of underground brick intercepting sewers, diverting London’s sewage eastward away from drinking water supplies. When cholera returned to London in 1866, the area connected to Bazalgette’s sewers remained completely free of the disease, proving clean infrastructure saved lives.`,
        content: `<span class="para-ref">[4.1]</span> What finally broke government inaction was not medical proof, but the political crisis of the "Great Stink" in the scorching summer of 1858. The River Thames, which acted as an open sewer for two million Londoners, produced a stench so nauseating that parliamentary curtains were soaked in chloride of lime and MPs were forced to flee the chamber in disgust.<br><br><span class="para-ref">[4.2]</span> Terrified that miasma would kill politicians themselves, Parliament passed emergency legislation in just eighteen days, granting £3 million to chief engineer Joseph Bazalgette. Between 1858 and 1865, Bazalgette constructed 82 miles of underground brick intercepting sewers, diverting London’s sewage eastward away from drinking water supplies. When cholera returned to London in 1866, the area connected to Bazalgette’s sewers remained completely free of the disease, proving clean infrastructure saved lives.`
      },
      {
        act: 5,
        title: "The 1875 Public Health Act: The Death of Laissez-Faire (1875)",
        theme_heading: "The 1875 Public Health Act: The Death of Laissez-Faire (1875)",
        theme: "The 1875 Public Health Act: The Death of Laissez-Faire (1875)",
        text: `<span class="para-ref">[5.1]</span> In the 1870s, two factors ended *laissez-faire* government: the 1867 Reform Act gave working-class male factory workers the vote, forcing politicians to compete for working-class support with promises of social reform; and Pasteur’s Germ Theory proved scientifically that dirty water and rotting waste bred deadly bacteria.<br><br><span class="para-ref">[5.2]</span> In 1875, Prime Minister Benjamin Disraeli passed the landmark **1875 Public Health Act**. Unlike the 1848 act, the 1875 Act made public health duties strictly compulsory for all local councils: they had to supply clean piped water, maintain proper underground sewers, inspect contaminated food, and appoint medical officers of health. The 1875 Act marked the complete end of *laissez-faire*, laying the foundation for modern state public health.`,
        content: `<span class="para-ref">[5.1]</span> In the 1870s, two factors ended *laissez-faire* government: the 1867 Reform Act gave working-class male factory workers the vote, forcing politicians to compete for working-class support with promises of social reform; and Pasteur’s Germ Theory proved scientifically that dirty water and rotting waste bred deadly bacteria.<br><br><span class="para-ref">[5.2]</span> In 1875, Prime Minister Benjamin Disraeli passed the landmark **1875 Public Health Act**. Unlike the 1848 act, the 1875 Act made public health duties strictly compulsory for all local councils: they had to supply clean piped water, maintain proper underground sewers, inspect contaminated food, and appoint medical officers of health. The 1875 Act marked the complete end of *laissez-faire*, laying the foundation for modern state public health.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what deadly waterborne epidemic arrived in Britain in 1831?",
        answer: "Cholera, which caused severe vomiting and dehydration and could kill within hours."
      },
      {
        question: "Using paragraph [2.2], how did John Snow prove that the Broad Street pump was the source of the 1854 cholera outbreak?",
        answer: "He plotted deaths on a street map showing they clustered around the pump, and when its handle was removed, the outbreak stopped."
      },
      {
        question: "According to paragraph [4.2], what engineering solution did Joseph Bazalgette construct to solve London’s sewage crisis?",
        answer: "82 miles of underground brick intercepting sewers to divert London's sewage eastward away from drinking water."
      },
      {
        question: "Using paragraph [5.2], why was the 1875 Public Health Act a turning point in government policy?",
        answer: "It ended laissez-faire by making clean water, sewers, and health officers strictly compulsory for all local councils."
      }
    ]
  }
};

function applyUpdates(lessons) {
  let count = 0;
  Object.keys(kt3Updates).forEach(id => {
    const l = lessons.find(x => x.id === id);
    if (!l) return;
    const update = kt3Updates[id];
    update.blocks.forEach((nb, i) => {
      const b = l.narrative_blocks[i];
      if (b) {
        b.text = nb.text;
        b.content = nb.content;
        b.title = nb.title;
        b.theme_heading = nb.theme_heading;
        b.theme = nb.theme;
      }
    });
    if (update.guided_reading) {
      l.guided_reading = update.guided_reading;
    }
    count++;
  });
  return count;
}

// 1. Update data/edexcel_medicine.json and public/data/edexcel_medicine.json
['data/edexcel_medicine.json', 'public/data/edexcel_medicine.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  const updated = applyUpdates(json.lessons);
  fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${updated} lessons in ${rel}`);
});

// 2. Update units/edexcel_medicine/data.js
const unitJs = path.resolve(__dirname, '../units/edexcel_medicine/data.js');
if (fs.existsSync(unitJs)) {
  let content = fs.readFileSync(unitJs, 'utf8');
  let clean = content;
  if (clean.startsWith('export default ')) clean = clean.substring('export default '.length);
  if (clean.endsWith(';\n')) clean = clean.substring(0, clean.length - 2);
  else if (clean.endsWith(';')) clean = clean.substring(0, clean.length - 1);
  const parsed = JSON.parse(clean);
  const updated = applyUpdates(parsed.lessons);
  fs.writeFileSync(unitJs, `export default ${JSON.stringify(parsed, null, 2)};\n`, 'utf8');
  console.log(`Updated ${updated} lessons in units/edexcel_medicine/data.js`);
}

// 3. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  const med = db.edexcel_medicine?.data || db.edexcel_medicine || (db.units ? db.units.find(u => u.id === 'edexcel_medicine') : null);
  if (med && med.lessons) {
    const updated = applyUpdates(med.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${updated} lessons in ${rel}`);
  }
});

console.log('Key Topic 3 (19th Century) successfully refactored!');
