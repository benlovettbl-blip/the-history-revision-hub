const fs = require('fs');
const path = require('path');

const modernLessonsUpdates = {
  lesson_4_2: {
    blocks: [
      {
        act: 1,
        title: "Wilhelm Röntgen & The Discovery of X-Rays (1895–1918)",
        theme_heading: "Wilhelm Röntgen & The Discovery of X-Rays (1895–1918)",
        theme: "Wilhelm Röntgen & The Discovery of X-Rays (1895–1918)",
        text: `<span class="para-ref">[1.1]</span> In 1895, doctors had very few ways to diagnose illnesses inside the living body: they listened to chests, checked pulses, and examined urine, but could only find internal broken bones, bullets, or tumours through painful exploratory surgery. This diagnostic limitation changed dramatically in November 1895 when German physicist Wilhelm Röntgen accidentally discovered X-rays. Röntgen found that an invisible type of radiation could pass through human flesh and cardboard, but was blocked by dense materials like bone, leaving a shadow on photographic plates.<br><br><span class="para-ref">[1.2]</span> In December 1895, Röntgen placed his wife Bertha’s hand over a photographic plate (<span class="archival-meta-tag">Source A</span>). The developed image revealed the bones of her fingers and her wedding ring, proving that doctors could see inside living human bodies without making a single cut. British hospitals quickly adopted X-ray machines to diagnose fractures. During the First World War (1914–1918), Polish-French scientist Marie Curie equipped twenty mobile X-ray vans ("petites Curies") to bring diagnostic equipment directly to casualty clearing stations, helping surgeons locate bullets and shrapnel before fatal infections set in.`,
        content: `<span class="para-ref">[1.1]</span> In 1895, doctors had very few ways to diagnose illnesses inside the living body: they listened to chests, checked pulses, and examined urine, but could only find internal broken bones, bullets, or tumours through painful exploratory surgery. This diagnostic limitation changed dramatically in November 1895 when German physicist Wilhelm Röntgen accidentally discovered X-rays. Röntgen found that an invisible type of radiation could pass through human flesh and cardboard, but was blocked by dense materials like bone, leaving a shadow on photographic plates.<br><br><span class="para-ref">[1.2]</span> In December 1895, Röntgen placed his wife Bertha’s hand over a photographic plate (<span class="archival-meta-tag">Source A</span>). The developed image revealed the bones of her fingers and her wedding ring, proving that doctors could see inside living human bodies without making a single cut. British hospitals quickly adopted X-ray machines to diagnose fractures. During the First World War (1914–1918), Polish-French scientist Marie Curie equipped twenty mobile X-ray vans ("petites Curies") to bring diagnostic equipment directly to casualty clearing stations, helping surgeons locate bullets and shrapnel before fatal infections set in.`
      },
      {
        act: 2,
        title: "Blood Testing & Flexible Endoscopy (1930s–1960s)",
        theme_heading: "Blood Testing & Flexible Endoscopy (1930s–1960s)",
        theme: "Blood Testing & Flexible Endoscopy (1930s–1960s)",
        text: `<span class="para-ref">[2.1]</span> As the twentieth century progressed, diagnostic advances moved beyond bones to internal body chemistry. Instead of guessing diseases from external symptoms, hospitals introduced routine blood testing. Doctors could now count white blood cells to detect hidden infections, test blood sugar levels to diagnose diabetes, and monitor blood pressure to measure cardiovascular strain. These tests provided precise, scientific evidence to guide treatment before symptoms became severe.<br><br><span class="para-ref">[2.2]</span> Another breakthrough was the invention of flexible endoscopy in the 1950s and 1960s. Previously, doctors could only inspect internal organs using rigid metal tubes, which risked tearing internal tissue. Optical scientists developed thin, flexible cables made of glass fibres that could transmit light and camera images around bends. Doctors could now slide an endoscope down a patient’s throat or into the bowel, allowing them to inspect stomach ulcers and detect early cancers without any surgical incisions.`,
        content: `<span class="para-ref">[2.1]</span> As the twentieth century progressed, diagnostic advances moved beyond bones to internal body chemistry. Instead of guessing diseases from external symptoms, hospitals introduced routine blood testing. Doctors could now count white blood cells to detect hidden infections, test blood sugar levels to diagnose diabetes, and monitor blood pressure to measure cardiovascular strain. These tests provided precise, scientific evidence to guide treatment before symptoms became severe.<br><br><span class="para-ref">[2.2]</span> Another breakthrough was the invention of flexible endoscopy in the 1950s and 1960s. Previously, doctors could only inspect internal organs using rigid metal tubes, which risked tearing internal tissue. Optical scientists developed thin, flexible cables made of glass fibres that could transmit light and camera images around bends. Doctors could now slide an endoscope down a patient’s throat or into the bowel, allowing them to inspect stomach ulcers and detect early cancers without any surgical incisions.`
      },
      {
        act: 3,
        title: "Godfrey Hounsfield, CT Scans & MRI (1971–1980s)",
        theme_heading: "Godfrey Hounsfield, CT Scans & MRI (1971–1980s)",
        theme: "Godfrey Hounsfield, CT Scans & MRI (1971–1980s)",
        text: `<span class="para-ref">[3.1]</span> Despite their usefulness, standard 2D X-rays had a major blind spot: dense bones cast thick white shadows that hid soft internal organs, leaving brain tumours, blood clots, and internal bleeding invisible. In 1967, British electrical engineer Godfrey Hounsfield solved this problem by inventing the Computerised Tomography (CT) scanner. Hounsfield combined rotating X-ray beams with powerful computer processing to assemble thousands of measurements into detailed 3D cross-sectional "slices" of internal body organs.<br><br><span class="para-ref">[3.2]</span> In October 1971, Hounsfield tested his prototype CT scanner (<span class="archival-meta-tag">Source C</span>) at Atkinson Morley Hospital in London, successfully pinpointing a brain tumour in a patient so surgeons could safely remove it. This was followed in the 1970s and 1980s by Magnetic Resonance Imaging (MRI). MRI used powerful magnetic fields and radio waves instead of radiation to produce crystal-clear images of soft tissues, the spinal cord, and brain matter, giving doctors unprecedented non-invasive diagnostic precision.`,
        content: `<span class="para-ref">[3.1]</span> Despite their usefulness, standard 2D X-rays had a major blind spot: dense bones cast thick white shadows that hid soft internal organs, leaving brain tumours, blood clots, and internal bleeding invisible. In 1967, British electrical engineer Godfrey Hounsfield solved this problem by inventing the Computerised Tomography (CT) scanner. Hounsfield combined rotating X-ray beams with powerful computer processing to assemble thousands of measurements into detailed 3D cross-sectional "slices" of internal body organs.<br><br><span class="para-ref">[3.2]</span> In October 1971, Hounsfield tested his prototype CT scanner (<span class="archival-meta-tag">Source C</span>) at Atkinson Morley Hospital in London, successfully pinpointing a brain tumour in a patient so surgeons could safely remove it. This was followed in the 1970s and 1980s by Magnetic Resonance Imaging (MRI). MRI used powerful magnetic fields and radio waves instead of radiation to produce crystal-clear images of soft tissues, the spinal cord, and brain matter, giving doctors unprecedented non-invasive diagnostic precision.`
      },
      {
        act: 4,
        title: "The Shift to Chronic & Lifestyle Diseases (c1950–1980s)",
        theme_heading: "The Shift to Chronic & Lifestyle Diseases (c1950–1980s)",
        theme: "The Shift to Chronic & Lifestyle Diseases (c1950–1980s)",
        text: `<span class="para-ref">[4.1]</span> In 1900, infectious diseases—such as tuberculosis, pneumonia, and cholera—were the leading causes of death in Britain, keeping average life expectancy to roughly 46 for men and 50 for women. Over the next sixty years, clean water supplies, mass childhood vaccinations, and penicillin brought bacterial epidemics under historic control. By the 1980s, average UK life expectancy had risen past 75 years.<br><br><span class="para-ref">[4.2]</span> However, living decades longer revealed a major shift in disease causation: the leading causes of death changed from infectious diseases to chronic lifestyle illnesses. Medical researchers proved that personal habits directly caused severe illnesses: cigarette smoking caused lung cancer; heavy alcohol consumption damaged the liver; and high-fat, high-sugar diets caused heart disease and type 2 diabetes. Modern medicine realized that many of the deadliest modern conditions were self-inflicted through daily lifestyle choices.`,
        content: `<span class="para-ref">[4.1]</span> In 1900, infectious diseases—such as tuberculosis, pneumonia, and cholera—were the leading causes of death in Britain, keeping average life expectancy to roughly 46 for men and 50 for women. Over the next sixty years, clean water supplies, mass childhood vaccinations, and penicillin brought bacterial epidemics under historic control. By the 1980s, average UK life expectancy had risen past 75 years.<br><br><span class="para-ref">[4.2]</span> However, living decades longer revealed a major shift in disease causation: the leading causes of death changed from infectious diseases to chronic lifestyle illnesses. Medical researchers proved that personal habits directly caused severe illnesses: cigarette smoking caused lung cancer; heavy alcohol consumption damaged the liver; and high-fat, high-sugar diets caused heart disease and type 2 diabetes. Modern medicine realized that many of the deadliest modern conditions were self-inflicted through daily lifestyle choices.`
      },
      {
        act: 5,
        title: "State Lifestyle Campaigns & Prevention vs Cure (1980s–Present)",
        theme_heading: "State Lifestyle Campaigns & Prevention vs Cure (1980s–Present)",
        theme: "State Lifestyle Campaigns & Prevention vs Cure (1980s–Present)",
        text: `<span class="para-ref">[5.1]</span> High-tech diagnostic scanners and hospital intensive care are extraordinarily expensive for the National Health Service (NHS). Consequently, the British government realized that preventing disease through public health campaigns was far more effective than trying to cure advanced illness. From the 1980s onward, the government introduced major health initiatives: compulsory seatbelts (1983), public education on healthy eating (Change4Life), warning labels on alcohol, and taxing sugary soft drinks.<br><br><span class="para-ref">[5.2]</span> The most decisive government intervention was the Health Act 2006, which banned smoking in all enclosed public places and workplaces across England from 1 July 2007. This legislation drastically reduced secondhand smoke exposure and lowered heart attack rates. For GCSE historians, this highlights the modern medical balance: while science and technology provide revolutionary diagnostic machines, government legislation and public health prevention remain essential to stop people becoming ill in the first place.`,
        content: `<span class="para-ref">[5.1]</span> High-tech diagnostic scanners and hospital intensive care are extraordinarily expensive for the National Health Service (NHS). Consequently, the British government realized that preventing disease through public health campaigns was far more effective than trying to cure advanced illness. From the 1980s onward, the government introduced major health initiatives: compulsory seatbelts (1983), public education on healthy eating (Change4Life), warning labels on alcohol, and taxing sugary soft drinks.<br><br><span class="para-ref">[5.2]</span> The most decisive government intervention was the Health Act 2006, which banned smoking in all enclosed public places and workplaces across England from 1 July 2007. This legislation drastically reduced secondhand smoke exposure and lowered heart attack rates. For GCSE historians, this highlights the modern medical balance: while science and technology provide revolutionary diagnostic machines, government legislation and public health prevention remain essential to stop people becoming ill in the first place.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], how did the discovery of X-rays transform surgical diagnosis?",
        answer: "Doctors could see inside the living body to locate fractures and bullets without performing painful exploratory surgery."
      },
      {
        question: "Using paragraph [2.2], why was flexible endoscopy an improvement over older diagnostic methods?",
        answer: "Doctors could slide a flexible camera down the throat to inspect organs and tumours directly without cutting open the body."
      },
      {
        question: "According to paragraph [3.1], what was the main advantage of CT scans over traditional X-rays?",
        answer: "Traditional X-rays only showed dense bones, whereas CT scans used computers to create 3D cross-sectional slices showing soft internal tissues."
      },
      {
        question: "Using paragraph [4.2], what are two major lifestyle factors that modern doctors identified as causes of disease?",
        answer: "Smoking (causing lung cancer) and unhealthy diets high in sugar and fat (causing heart disease and diabetes)."
      }
    ]
  },
  lesson_4_3: {
    blocks: [
      {
        act: 1,
        title: "Paul Ehrlich & Salvarsan 606 (1906–1909)",
        theme_heading: "Paul Ehrlich & Salvarsan 606 (1906–1909)",
        theme: "Paul Ehrlich & Salvarsan 606 (1906–1909)",
        text: `<span class="para-ref">[1.1]</span> By 1900, scientists knew which bacteria caused deadly diseases like cholera and tuberculosis, but they had no medicines that could kill bacteria inside a living person without poisoning the patient. In Germany, scientist Paul Ehrlich set out to find what he called a "magic bullet"—a synthetic chemical that would target and destroy specific disease-causing microbes while leaving healthy body cells completely unharmed.<br><br><span class="para-ref">[1.2]</span> Working with Japanese scientist Sahachiro Hata, Ehrlich tested hundreds of chemical compounds based on arsenic. In 1909, on their 606th attempt, Hata discovered that compound 606 successfully destroyed the microbe causing syphilis, a deadly sexually transmitted disease. Marketed under the name Salvarsan 606, this was the world’s first synthetic chemical cure ("magic bullet"), proving that modern laboratory chemistry could cure specific internal bacterial infections.`,
        content: `<span class="para-ref">[1.1]</span> By 1900, scientists knew which bacteria caused deadly diseases like cholera and tuberculosis, but they had no medicines that could kill bacteria inside a living person without poisoning the patient. In Germany, scientist Paul Ehrlich set out to find what he called a "magic bullet"—a synthetic chemical that would target and destroy specific disease-causing microbes while leaving healthy body cells completely unharmed.<br><br><span class="para-ref">[1.2]</span> Working with Japanese scientist Sahachiro Hata, Ehrlich tested hundreds of chemical compounds based on arsenic. In 1909, on their 606th attempt, Hata discovered that compound 606 successfully destroyed the microbe causing syphilis, a deadly sexually transmitted disease. Marketed under the name Salvarsan 606, this was the world’s first synthetic chemical cure ("magic bullet"), proving that modern laboratory chemistry could cure specific internal bacterial infections.`
      },
      {
        act: 2,
        title: "Gerhard Domagk & Prontosil (1932–1935)",
        theme_heading: "Gerhard Domagk & Prontosil (1932–1935)",
        theme: "Gerhard Domagk & Prontosil (1932–1935)",
        text: `<span class="para-ref">[2.1]</span> Although Salvarsan 606 was a major scientific breakthrough, it had serious limitations: it was difficult to administer and only worked against the syphilis microbe. Common and deadly infections like blood poisoning, pneumonia, and scarlet fever remained untreatable. In 1932, German doctor Gerhard Domagk began testing industrial chemical dyes to see if they could kill everyday bacteria.<br><br><span class="para-ref">[2.2]</span> Domagk discovered that a bright red leather dye called Prontosil killed streptococcal bacteria in mice without harming them. In 1935, when his own daughter pricked her finger on an infected needle and faced fatal blood poisoning, Domagk gave her Prontosil and she made a miraculous recovery. Prontosil became the second magic bullet, and scientists soon discovered its active ingredient, sulphonamide, opening the way for cheap, mass-produced pills that saved millions of lives from bacterial infections.`,
        content: `<span class="para-ref">[2.1]</span> Although Salvarsan 606 was a major scientific breakthrough, it had serious limitations: it was difficult to administer and only worked against the syphilis microbe. Common and deadly infections like blood poisoning, pneumonia, and scarlet fever remained untreatable. In 1932, German doctor Gerhard Domagk began testing industrial chemical dyes to see if they could kill everyday bacteria.<br><br><span class="para-ref">[2.2]</span> Domagk discovered that a bright red leather dye called Prontosil killed streptococcal bacteria in mice without harming them. In 1935, when his own daughter pricked her finger on an infected needle and faced fatal blood poisoning, Domagk gave her Prontosil and she made a miraculous recovery. Prontosil became the second magic bullet, and scientists soon discovered its active ingredient, sulphonamide, opening the way for cheap, mass-produced pills that saved millions of lives from bacterial infections.`
      },
      {
        act: 3,
        title: "The Beveridge Report & Wartime Reconstruction (1942)",
        theme_heading: "The Beveridge Report & Wartime Reconstruction (1942)",
        theme: "The Beveridge Report & Wartime Reconstruction (1942)",
        text: `<span class="para-ref">[3.1]</span> While laboratory medicines were advancing, healthcare in Britain before 1948 was deeply unequal. Under the 1911 National Insurance Act, only employed workers paid into a scheme giving them access to a doctor. Wives, children, the elderly, and the unemployed were excluded, forcing poor families to delay seeing a doctor or rely on charity hospitals. A serious illness often meant financial ruin for working-class families.<br><br><span class="para-ref">[3.2]</span> The Second World War dramatically changed British attitudes towards public healthcare. The shared danger of the Blitz, national evacuation, and wartime rationing convinced citizens that everyone deserved equal protection from the state. In December 1942, economist William Beveridge published the famous Beveridge Report, proposing a comprehensive Welfare State to defeat the "Five Giants" of Want, Disease, Ignorance, Squalor, and Idleness. The report was an instant bestseller, creating irresistible public demand for a free national healthcare system.`,
        content: `<span class="para-ref">[3.1]</span> While laboratory medicines were advancing, healthcare in Britain before 1948 was deeply unequal. Under the 1911 National Insurance Act, only employed workers paid into a scheme giving them access to a doctor. Wives, children, the elderly, and the unemployed were excluded, forcing poor families to delay seeing a doctor or rely on charity hospitals. A serious illness often meant financial ruin for working-class families.<br><br><span class="para-ref">[3.2]</span> The Second World War dramatically changed British attitudes towards public healthcare. The shared danger of the Blitz, national evacuation, and wartime rationing convinced citizens that everyone deserved equal protection from the state. In December 1942, economist William Beveridge published the famous Beveridge Report, proposing a comprehensive Welfare State to defeat the "Five Giants" of Want, Disease, Ignorance, Squalor, and Idleness. The report was an instant bestseller, creating irresistible public demand for a free national healthcare system.`
      },
      {
        act: 4,
        title: "Aneurin Bevan & The Launch of the NHS (1945–1948)",
        theme_heading: "Aneurin Bevan & The Launch of the NHS (1945–1948)",
        theme: "Aneurin Bevan & The Launch of the NHS (1945–1948)",
        text: `<span class="para-ref">[4.1]</span> In July 1945, the Labour Party won a landslide election victory promising to build the Welfare State. Prime Minister Clement Attlee appointed fiery former Welsh coal miner Aneurin Bevan as Minister of Health. Bevan was determined to create a National Health Service (NHS) based on three revolutionary principles: it would be free at the point of delivery, funded entirely through general taxation, and accessible to every British citizen regardless of wealth.<br><br><span class="para-ref">[4.2]</span> Bevan faced intense opposition from the British Medical Association (BMA), where over 90% of private doctors voted against joining the NHS, fearing they would lose their independent incomes as state employees. Bevan compromised by allowing hospital consultants to continue treating fee-paying private patients alongside NHS work, famously remarking that he "stuffed their mouths with gold." On 5 July 1948, the NHS officially opened at Park Hospital in Manchester, immediately providing free doctor visits, hospital care, prescriptions, glasses, and dental treatment to millions of people.`,
        content: `<span class="para-ref">[4.1]</span> In July 1945, the Labour Party won a landslide election victory promising to build the Welfare State. Prime Minister Clement Attlee appointed fiery former Welsh coal miner Aneurin Bevan as Minister of Health. Bevan was determined to create a National Health Service (NHS) based on three revolutionary principles: it would be free at the point of delivery, funded entirely through general taxation, and accessible to every British citizen regardless of wealth.<br><br><span class="para-ref">[4.2]</span> Bevan faced intense opposition from the British Medical Association (BMA), where over 90% of private doctors voted against joining the NHS, fearing they would lose their independent incomes as state employees. Bevan compromised by allowing hospital consultants to continue treating fee-paying private patients alongside NHS work, famously remarking that he "stuffed their mouths with gold." On 5 July 1948, the NHS officially opened at Park Hospital in Manchester, immediately providing free doctor visits, hospital care, prescriptions, glasses, and dental treatment to millions of people.`
      },
      {
        act: 5,
        title: "High-Tech Care, Surgical Milestones & Escalating Costs (1950s–Present)",
        theme_heading: "High-Tech Care, Surgical Milestones & Escalating Costs (1950s–Present)",
        theme: "High-Tech Care, Surgical Milestones & Escalating Costs (1950s–Present)",
        text: `<span class="para-ref">[5.1]</span> The creation of the NHS coincided with a dramatic revolution in high-tech hospital treatments. Over the following decades, British surgeons achieved extraordinary milestones: Sir John Charnley pioneered the modern artificial hip replacement in 1962; kidney dialysis machines cleansed the blood of patients with organ failure; and the first successful human heart transplant was performed in 1967. Advances in anaesthetics, antiseptic conditions, and miniature cameras enabled keyhole surgery, drastically reducing recovery times.<br><br><span class="para-ref">[5.2]</span> However, the enormous success of high-tech modern medicine created a serious financial challenge for the NHS. Because people live much longer and expect cutting-edge treatments, the cost of funding modern hospitals, advanced cancer drugs, and intensive care has skyrocketed. For GCSE historians, this highlights the great paradox of modern healthcare: while medical technology can now perform once-unimaginable surgical miracles, providing free, equal healthcare to an ageing population remains one of Britain's greatest ongoing political and economic debates.`,
        content: `<span class="para-ref">[5.1]</span> The creation of the NHS coincided with a dramatic revolution in high-tech hospital treatments. Over the following decades, British surgeons achieved extraordinary milestones: Sir John Charnley pioneered the modern artificial hip replacement in 1962; kidney dialysis machines cleansed the blood of patients with organ failure; and the first successful human heart transplant was performed in 1967. Advances in anaesthetics, antiseptic conditions, and miniature cameras enabled keyhole surgery, drastically reducing recovery times.<br><br><span class="para-ref">[5.2]</span> However, the enormous success of high-tech modern medicine created a serious financial challenge for the NHS. Because people live much longer and expect cutting-edge treatments, the cost of funding modern hospitals, advanced cancer drugs, and intensive care has skyrocketed. For GCSE historians, this highlights the great paradox of modern healthcare: while medical technology can now perform once-unimaginable surgical miracles, providing free, equal healthcare to an ageing population remains one of Britain's greatest ongoing political and economic debates.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what was meant by Paul Ehrlich’s concept of a \"magic bullet\"?",
        answer: "A synthetic chemical designed to target and kill specific disease-causing bacteria without harming healthy human cells."
      },
      {
        question: "Using paragraph [2.2], what illness did Gerhard Domagk’s daughter recover from after receiving Prontosil?",
        answer: "Severe blood poisoning caused by an infected needle prick."
      },
      {
        question: "According to paragraph [3.1], which groups were excluded from doctor care under the old 1911 National Insurance scheme?",
        answer: "Wives, children, the elderly, and the unemployed."
      },
      {
        question: "Using paragraph [4.2], on what date was the National Health Service officially launched?",
        answer: "5 July 1948 (at Park Hospital in Manchester)."
      }
    ]
  },
  lesson_4_4: {
    blocks: [
      {
        act: 1,
        title: "Alexander Fleming’s Accidental Discovery (1928–1929)",
        theme_heading: "Alexander Fleming’s Accidental Discovery (1928–1929)",
        theme: "Alexander Fleming’s Accidental Discovery (1928–1929)",
        text: `<span class="para-ref">[1.1]</span> During the First World War, Scottish doctor Alexander Fleming witnessed thousands of soldiers die from infected gunshot wounds in French military hospitals. Antiseptics like carbolic acid only cleaned the surface of wounds and actually damaged healthy white blood cells deep inside body tissues. Fleming returned to St Mary’s Hospital in London determined to find a natural substance that could destroy bacteria without harming living human tissue.<br><br><span class="para-ref">[1.2]</span> In September 1928, Fleming made his legendary accidental breakthrough. Returning from a holiday, he noticed that a petri dish of staphylococcus bacteria on his untidy workbench had been contaminated by a drifting mould spore. Looking closely, he saw that the bacteria directly around the mould had dissolved and vanished. Fleming identified the mould as <em>Penicillium notatum</em> and named the bacterial-killing fluid it produced "penicillin." Although Fleming published his findings in 1929, he could not extract or purify the pure chemical, and government funders showed little interest, leaving penicillin an abandoned laboratory curiosity for a decade.`,
        content: `<span class="para-ref">[1.1]</span> During the First World War, Scottish doctor Alexander Fleming witnessed thousands of soldiers die from infected gunshot wounds in French military hospitals. Antiseptics like carbolic acid only cleaned the surface of wounds and actually damaged healthy white blood cells deep inside body tissues. Fleming returned to St Mary’s Hospital in London determined to find a natural substance that could destroy bacteria without harming living human tissue.<br><br><span class="para-ref">[1.2]</span> In September 1928, Fleming made his legendary accidental breakthrough. Returning from a holiday, he noticed that a petri dish of staphylococcus bacteria on his untidy workbench had been contaminated by a drifting mould spore. Looking closely, he saw that the bacteria directly around the mould had dissolved and vanished. Fleming identified the mould as <em>Penicillium notatum</em> and named the bacterial-killing fluid it produced "penicillin." Although Fleming published his findings in 1929, he could not extract or purify the pure chemical, and government funders showed little interest, leaving penicillin an abandoned laboratory curiosity for a decade.`
      },
      {
        act: 2,
        title: "Florey, Chain & The Oxford Team (1938–1940)",
        theme_heading: "Florey, Chain & The Oxford Team (1938–1940)",
        theme: "Florey, Chain & The Oxford Team (1938–1940)",
        text: `<span class="para-ref">[2.1]</span> In 1938, a team of university researchers at Oxford reopened Fleming’s forgotten paper. The team was led by Australian pathologist Howard Florey and German-Jewish biochemist Ernst Chain, who had fled Nazi Germany. While Fleming had worked alone, Florey and Chain assembled an interdisciplinary scientific team, bringing together biologists, chemists, and skilled laboratory technicians to solve the challenge of purifying penicillin.<br><br><span class="para-ref">[2.2]</span> The key problem was growing enough mould to extract tiny drops of pure drug. Skilled Oxford technician Norman Heatley devised ingenious laboratory apparatus, using hundreds of glass bottles, milk churns, and bedpans to brew the mould in hospital basements. By carefully freeze-drying the fluid, Chain and Heatley finally succeeded in producing a tiny quantity of brown penicillin powder, pure enough to safely test on living animals.`,
        content: `<span class="para-ref">[2.1]</span> In 1938, a team of university researchers at Oxford reopened Fleming’s forgotten paper. The team was led by Australian pathologist Howard Florey and German-Jewish biochemist Ernst Chain, who had fled Nazi Germany. While Fleming had worked alone, Florey and Chain assembled an interdisciplinary scientific team, bringing together biologists, chemists, and skilled laboratory technicians to solve the challenge of purifying penicillin.<br><br><span class="para-ref">[2.2]</span> The key problem was growing enough mould to extract tiny drops of pure drug. Skilled Oxford technician Norman Heatley devised ingenious laboratory apparatus, using hundreds of glass bottles, milk churns, and bedpans to brew the mould in hospital basements. By carefully freeze-drying the fluid, Chain and Heatley finally succeeded in producing a tiny quantity of brown penicillin powder, pure enough to safely test on living animals.`
      },
      {
        act: 3,
        title: "Mice Trials & The Tragic Case of Albert Alexander (1940–1941)",
        theme_heading: "Mice Trials & The Tragic Case of Albert Alexander (1940–1941)",
        theme: "Mice Trials & The Tragic Case of Albert Alexander (1940–1941)",
        text: `<span class="para-ref">[3.1]</span> In May 1940, the Oxford team conducted a decisive animal experiment. Eight mice were injected with lethal doses of deadly streptococcus bacteria. Four mice were given injections of penicillin, while the other four received nothing. Within twenty-four hours, the four untreated mice were dead, while all four penicillin-treated mice survived completely healthy. This proved conclusively that penicillin was a miraculous, non-toxic antibiotic that could cure fatal blood infections in living animals.<br><br><span class="para-ref">[3.2]</span> In February 1941, the team tested penicillin on a human patient: police constable Albert Alexander, who was dying from severe blood poisoning after scratching his face on a rose thorn. Alexander was administered penicillin, and his fever dropped dramatically within days. However, the team did not have enough drug; they even recycled penicillin from his urine, but the supply ran out and Alexander tragically relapsed and died. This proved both that penicillin cured human infections and that large-scale industrial mass-production was desperately needed.`,
        content: `<span class="para-ref">[3.1]</span> In May 1940, the Oxford team conducted a decisive animal experiment. Eight mice were injected with lethal doses of deadly streptococcus bacteria. Four mice were given injections of penicillin, while the other four received nothing. Within twenty-four hours, the four untreated mice were dead, while all four penicillin-treated mice survived completely healthy. This proved conclusively that penicillin was a miraculous, non-toxic antibiotic that could cure fatal blood infections in living animals.<br><br><span class="para-ref">[3.2]</span> In February 1941, the team tested penicillin on a human patient: police constable Albert Alexander, who was dying from severe blood poisoning after scratching his face on a rose thorn. Alexander was administered penicillin, and his fever dropped dramatically within days. However, the team did not have enough drug; they even recycled penicillin from his urine, but the supply ran out and Alexander tragically relapsed and died. This proved both that penicillin cured human infections and that large-scale industrial mass-production was desperately needed.`
      },
      {
        act: 4,
        title: "Peoria & US Industrial Mass Production (1941–1944)",
        theme_heading: "Peoria & US Industrial Mass Production (1941–1944)",
        theme: "Peoria & US Industrial Mass Production (1941–1944)",
        text: `<span class="para-ref">[4.1]</span> Because British chemical factories were being relentlessly bombed during the Blitz and fully committed to making wartime explosives, British pharmaceutical companies could not produce penicillin in bulk. In July 1941, Florey and Heatley flew to the neutral United States to seek help. They partnered with the US Department of Agriculture research laboratory in Peoria, Illinois, where scientists made two crucial discoveries: using a sugary byproduct called corn-steep liquor boosted mould growth, and a strain of mould found on a Peoria cantaloupe produced two hundred times more penicillin.<br><br><span class="para-ref">[4.2]</span> When the US entered the war after Pearl Harbor, the American government declared penicillin a top wartime priority, offering huge subsidies and tax breaks to major chemical corporations (such as Pfizer) to build industrial "deep-tank fermentation" factories. By early 1944, American factories were mass-producing millions of doses every month, creating the world's first true pharmaceutical wonder drug.`,
        content: `<span class="para-ref">[4.1]</span> Because British chemical factories were being relentlessly bombed during the Blitz and fully committed to making wartime explosives, British pharmaceutical companies could not produce penicillin in bulk. In July 1941, Florey and Heatley flew to the neutral United States to seek help. They partnered with the US Department of Agriculture research laboratory in Peoria, Illinois, where scientists made two crucial discoveries: using a sugary byproduct called corn-steep liquor boosted mould growth, and a strain of mould found on a Peoria cantaloupe produced two hundred times more penicillin.<br><br><span class="para-ref">[4.2]</span> When the US entered the war after Pearl Harbor, the American government declared penicillin a top wartime priority, offering huge subsidies and tax breaks to major chemical corporations (such as Pfizer) to build industrial "deep-tank fermentation" factories. By early 1944, American factories were mass-producing millions of doses every month, creating the world's first true pharmaceutical wonder drug.`
      },
      {
        act: 5,
        title: "D-Day Allied Victory & The Superbug Threat (1944–Present)",
        theme_heading: "D-Day Allied Victory & The Superbug Threat (1944–Present)",
        theme: "D-Day Allied Victory & The Superbug Threat (1944–Present)",
        text: `<span class="para-ref">[5.1]</span> Mass-produced penicillin transformed the Second World War. By June 1944, over two million doses were available for the Allied D-Day landings in Normandy, ensuring that wounded soldiers no longer died from wound gangrene or amputations. After 1945, penicillin became cheap and universally available to civilians through the new NHS, virtually eliminating deadly bacterial killers like scarlet fever, pneumonia, and bacterial meningitis. Fleming, Florey, and Chain were jointly awarded the 1945 Nobel Prize in Medicine.<br><br><span class="para-ref">[5.2]</span> However, the antibiotic revolution faces a major modern crisis: bacterial resistance. Through decades of over-prescription by doctors and misuse in animal farming, bacteria have evolved resistance to standard antibiotics, creating dangerous "superbugs" like MRSA. For GCSE historians, penicillin is the ultimate demonstration of how multiple factors—Fleming’s individual chance discovery, Florey and Chain’s scientific teamwork, US government funding, and the pressure of wartime need—combined to create a medical revolution that saved hundreds of millions of lives.`,
        content: `<span class="para-ref">[5.1]</span> Mass-produced penicillin transformed the Second World War. By June 1944, over two million doses were available for the Allied D-Day landings in Normandy, ensuring that wounded soldiers no longer died from wound gangrene or amputations. After 1945, penicillin became cheap and universally available to civilians through the new NHS, virtually eliminating deadly bacterial killers like scarlet fever, pneumonia, and bacterial meningitis. Fleming, Florey, and Chain were jointly awarded the 1945 Nobel Prize in Medicine.<br><br><span class="para-ref">[5.2]</span> However, the antibiotic revolution faces a major modern crisis: bacterial resistance. Through decades of over-prescription by doctors and misuse in animal farming, bacteria have evolved resistance to standard antibiotics, creating dangerous "superbugs" like MRSA. For GCSE historians, penicillin is the ultimate demonstration of how multiple factors—Fleming’s individual chance discovery, Florey and Chain’s scientific teamwork, US government funding, and the pressure of wartime need—combined to create a medical revolution that saved hundreds of millions of lives.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.2], how did Alexander Fleming accidentally discover penicillin in September 1928?",
        answer: "A drifting mould spore landed on an untidy petri dish of staphylococcus bacteria, and the bacteria around the mould dissolved."
      },
      {
        question: "Using paragraph [2.2], what practical challenge did Howard Florey and Ernst Chain solve at Oxford?",
        answer: "They developed laboratory methods to brew enough mould in bottles and extract pure, concentrated penicillin powder."
      },
      {
        question: "According to paragraph [3.1], what did the Oxford team’s 1940 experiment on eight mice prove?",
        answer: "That penicillin could safely cure lethal bacterial infections inside living animals without harming them."
      },
      {
        question: "Using paragraph [4.2], which two factors allowed American factories in Peoria to mass-produce penicillin?",
        answer: "Using corn-steep liquor with a high-yield cantaloupe mould, and US government wartime funding for deep-tank fermentation factories."
      }
    ]
  },
  lesson_4_5: {
    blocks: [
      {
        act: 1,
        title: "The 20th-Century Smoking Epidemic & Tobacco Advertising (1920s–1950)",
        theme_heading: "The 20th-Century Smoking Epidemic & Tobacco Advertising (1920s–1950)",
        theme: "The 20th-Century Smoking Epidemic & Tobacco Advertising (1920s–1950)",
        text: `<span class="para-ref">[1.1]</span> In 1900, lung cancer was an extremely rare disease in Great Britain, with hospital doctors seeing only a handful of cases in their entire careers. However, during the First and Second World Wars, cigarette smoking exploded in popularity. Tobacco was cheap, heavily marketed as glamorous and relaxing, and even issued free to soldiers in frontline rations. By 1950, over 80% of British men smoked regularly, and cigarettes were viewed as completely harmless by the public.<br><br><span class="para-ref">[1.2]</span> By the late 1940s, British hospital wards were suddenly overflowing with patients dying from agonizing lung tumours, and doctors could not explain the terrifying surge. Many physicians initially blamed industrial smog, coal smoke, or tarmac fumes from new motor roads. Lung cancer is also extraordinarily difficult to detect in its early stages because the lungs have few pain receptors; by the time a patient developed symptoms like coughing up blood, the tumour had usually spread, making surgery ineffective.`,
        content: `<span class="para-ref">[1.1]</span> In 1900, lung cancer was an extremely rare disease in Great Britain, with hospital doctors seeing only a handful of cases in their entire careers. However, during the First and Second World Wars, cigarette smoking exploded in popularity. Tobacco was cheap, heavily marketed as glamorous and relaxing, and even issued free to soldiers in frontline rations. By 1950, over 80% of British men smoked regularly, and cigarettes were viewed as completely harmless by the public.<br><br><span class="para-ref">[1.2]</span> By the late 1940s, British hospital wards were suddenly overflowing with patients dying from agonizing lung tumours, and doctors could not explain the terrifying surge. Many physicians initially blamed industrial smog, coal smoke, or tarmac fumes from new motor roads. Lung cancer is also extraordinarily difficult to detect in its early stages because the lungs have few pain receptors; by the time a patient developed symptoms like coughing up blood, the tumour had usually spread, making surgery ineffective.`
      },
      {
        act: 2,
        title: "Doll & Hill’s Epidemiological Breakthrough (1950–1954)",
        theme_heading: "Doll & Hill’s Epidemiological Breakthrough (1950–1954)",
        theme: "Doll & Hill’s Epidemiological Breakthrough (1950–1954)",
        text: `<span class="para-ref">[2.1]</span> Alarmed by the surging death toll, the Medical Research Council commissioned two brilliant British researchers, Dr Richard Doll and Professor Austin Bradford Hill, to investigate. Instead of examining tissue under microscopes, Doll and Hill pioneered epidemiology—the statistical study of disease patterns across large populations. In 1948, they surveyed thousands of hospital patients across London, asking detailed questions about their diets, workplaces, and lifestyle habits.<br><br><span class="para-ref">[2.2]</span> In September 1950, Doll and Hill published their findings in the <em>British Medical Journal</em>, demonstrating that heavy smokers were twenty-five times more likely to develop lung cancer than non-smokers. To prove this link beyond any doubt, they launched the famous 1951 British Doctors Study, tracking over 40,000 doctors over several years. The data was indisputable: doctors who smoked died of lung cancer at vastly higher rates, and doctors who gave up smoking saw their risk drop, proving scientifically for the first time that tobacco smoke caused lung cancer.`,
        content: `<span class="para-ref">[2.1]</span> Alarmed by the surging death toll, the Medical Research Council commissioned two brilliant British researchers, Dr Richard Doll and Professor Austin Bradford Hill, to investigate. Instead of examining tissue under microscopes, Doll and Hill pioneered epidemiology—the statistical study of disease patterns across large populations. In 1948, they surveyed thousands of hospital patients across London, asking detailed questions about their diets, workplaces, and lifestyle habits.<br><br><span class="para-ref">[2.2]</span> In September 1950, Doll and Hill published their findings in the <em>British Medical Journal</em>, demonstrating that heavy smokers were twenty-five times more likely to develop lung cancer than non-smokers. To prove this link beyond any doubt, they launched the famous 1951 British Doctors Study, tracking over 40,000 doctors over several years. The data was indisputable: doctors who smoked died of lung cancer at vastly higher rates, and doctors who gave up smoking saw their risk drop, proving scientifically for the first time that tobacco smoke caused lung cancer.`
      },
      {
        act: 3,
        title: "Royal College of Physicians & Early Statutory Advertising Bans (1962–1971)",
        theme_heading: "Royal College of Physicians & Early Statutory Advertising Bans (1962–1971)",
        theme: "Royal College of Physicians & Early Statutory Advertising Bans (1962–1971)",
        text: `<span class="para-ref">[3.1]</span> Despite Doll and Hill’s statistical proof, the British government dragged its feet throughout the 1950s. Tobacco taxes brought in hundreds of millions of pounds for the Treasury, and ministers feared angering millions of smoking voters. Meanwhile, powerful commercial tobacco corporations launched massive advertising campaigns to dismiss health concerns and reassure the public.<br><br><span class="para-ref">[3.2]</span> The turning point came in 1962 when the Royal College of Physicians published a landmark report titled <em>Smoking and Health</em>, warning that cigarettes were a national health catastrophe. Facing overwhelming medical pressure, the government began taking legislative action: in 1965, cigarette advertising was banned from British television, and in 1971, health warnings were printed on all cigarette packets for the first time, beginning a long shift in public attitudes.`,
        content: `<span class="para-ref">[3.1]</span> Despite Doll and Hill’s statistical proof, the British government dragged its feet throughout the 1950s. Tobacco taxes brought in hundreds of millions of pounds for the Treasury, and ministers feared angering millions of smoking voters. Meanwhile, powerful commercial tobacco corporations launched massive advertising campaigns to dismiss health concerns and reassure the public.<br><br><span class="para-ref">[3.2]</span> The turning point came in 1962 when the Royal College of Physicians published a landmark report titled <em>Smoking and Health</em>, warning that cigarettes were a national health catastrophe. Facing overwhelming medical pressure, the government began taking legislative action: in 1965, cigarette advertising was banned from British television, and in 1971, health warnings were printed on all cigarette packets for the first time, beginning a long shift in public attitudes.`
      },
      {
        act: 4,
        title: "The Public Indoor Smoking Ban & Secondhand Smoke (2000s)",
        theme_heading: "The Public Indoor Smoking Ban & Secondhand Smoke (2000s)",
        theme: "The Public Indoor Smoking Ban & Secondhand Smoke (2000s)",
        text: `<span class="para-ref">[4.1]</span> For decades, tobacco had been treated as an individual personal choice. However, by the late 1990s, medical science proved the lethal reality of passive smoking (secondhand smoke): breathing in other people's smoke caused lung cancer and heart attacks in non-smokers, particularly bar staff, children, and hospital patients. This gave the government a powerful moral and legal reason to intervene directly in public spaces.<br><br><span class="para-ref">[4.2]</span> On 1 July 2007, the British government enacted the historic Health Act 2006, making it illegal to smoke in all enclosed public places, workplaces, pubs, restaurants, and public transport across England. Despite fierce opposition from pub owners who predicted economic collapse, the ban was widely supported, virtually eliminating secondhand smoke in public venues and encouraging hundreds of thousands of smokers to quit permanently.`,
        content: `<span class="para-ref">[4.1]</span> For decades, tobacco had been treated as an individual personal choice. However, by the late 1990s, medical science proved the lethal reality of passive smoking (secondhand smoke): breathing in other people's smoke caused lung cancer and heart attacks in non-smokers, particularly bar staff, children, and hospital patients. This gave the government a powerful moral and legal reason to intervene directly in public spaces.<br><br><span class="para-ref">[4.2]</span> On 1 July 2007, the British government enacted the historic Health Act 2006, making it illegal to smoke in all enclosed public places, workplaces, pubs, restaurants, and public transport across England. Despite fierce opposition from pub owners who predicted economic collapse, the ban was widely supported, virtually eliminating secondhand smoke in public venues and encouraging hundreds of thousands of smokers to quit permanently.`
      },
      {
        act: 5,
        title: "Plain Packaging, Advanced Oncology & The Smoke-Free Goal (2010s–Present)",
        theme_heading: "Plain Packaging, Advanced Oncology & The Smoke-Free Goal (2010s–Present)",
        theme: "Plain Packaging, Advanced Oncology & The Smoke-Free Goal (2010s–Present)",
        text: `<span class="para-ref">[5.1]</span> In the twenty-first century, the government introduced even stricter public health measures: the legal age to purchase cigarettes was raised from 16 to 18 (2007), smoking in cars carrying children was banned (2015), and standardized plain packaging was introduced in 2016, requiring all cigarettes to be sold in drab olive-green boxes covered with graphic photographs of diseased lungs and tumours.<br><br><span class="para-ref">[5.2]</span> Alongside prevention, modern hospital treatment has advanced significantly. High-tech CT scanners can detect chest tumours earlier, while robotic surgery and targeted chemotherapy have improved survival rates. However, lung cancer remains one of Britain's deadliest diseases with low 5-year survival rates, proving the central GCSE lesson of the unit: prevention through government legislation and lifestyle education is vastly more effective than attempting to cure advanced disease with high-tech medicine.`,
        content: `<span class="para-ref">[5.1]</span> In the twenty-first century, the government introduced even stricter public health measures: the legal age to purchase cigarettes was raised from 16 to 18 (2007), smoking in cars carrying children was banned (2015), and standardized plain packaging was introduced in 2016, requiring all cigarettes to be sold in drab olive-green boxes covered with graphic photographs of diseased lungs and tumours.<br><br><span class="para-ref">[5.2]</span> Alongside prevention, modern hospital treatment has advanced significantly. High-tech CT scanners can detect chest tumours earlier, while robotic surgery and targeted chemotherapy have improved survival rates. However, lung cancer remains one of Britain's deadliest diseases with low 5-year survival rates, proving the central GCSE lesson of the unit: prevention through government legislation and lifestyle education is vastly more effective than attempting to cure advanced disease with high-tech medicine.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], how common was lung cancer in Britain around 1900?",
        answer: "It was extraordinarily rare, with hospital doctors seeing only a handful of cases in their entire careers."
      },
      {
        question: "Using paragraph [2.2], what did Richard Doll and Austin Bradford Hill’s 1951 British Doctors Study prove?",
        answer: "That cigarette smoking directly caused lung cancer, and that stopping smoking reduced the risk of death."
      },
      {
        question: "According to paragraph [3.2], what two government actions were taken in 1965 and 1971 following the Royal College of Physicians report?",
        answer: "Banning cigarette television advertisements (1965) and printing health warnings on cigarette packets (1971)."
      },
      {
        question: "Using paragraph [4.2], what did the historic Health Act 2006 do on 1 July 2007?",
        answer: "Banned smoking in all enclosed public places, workplaces, pubs, restaurants, and public transport across England."
      }
    ]
  }
};

function applyUpdatesToLessons(lessons) {
  let count = 0;
  Object.keys(modernLessonsUpdates).forEach(lessonId => {
    const l = lessons.find(x => x.id === lessonId);
    if (!l) return;
    const update = modernLessonsUpdates[lessonId];
    update.blocks.forEach((nb, idx) => {
      const b = l.narrative_blocks[idx];
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
  const updatedCount = applyUpdatesToLessons(json.lessons);
  fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} lessons in ${rel}`);
});

// 2. Update units/edexcel_medicine/data.js
const unitJsPath = path.resolve(__dirname, '../units/edexcel_medicine/data.js');
if (fs.existsSync(unitJsPath)) {
  let content = fs.readFileSync(unitJsPath, 'utf8');
  let clean = content;
  if (clean.startsWith('export default ')) clean = clean.substring('export default '.length);
  if (clean.endsWith(';\n')) clean = clean.substring(0, clean.length - 2);
  else if (clean.endsWith(';')) clean = clean.substring(0, clean.length - 1);
  const parsed = JSON.parse(clean);
  const updatedCount = applyUpdatesToLessons(parsed.lessons);
  fs.writeFileSync(unitJsPath, `export default ${JSON.stringify(parsed, null, 2)};\n`, 'utf8');
  console.log(`Updated ${updatedCount} lessons in units/edexcel_medicine/data.js`);
}

// 3. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  const medUnit = db.edexcel_medicine?.data || db.edexcel_medicine || (db.units ? db.units.find(u => u.id === 'edexcel_medicine') : null);
  if (medUnit && medUnit.lessons) {
    const updatedCount = applyUpdatesToLessons(medUnit.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${updatedCount} lessons in ${rel}`);
  }
});

console.log('Phase 1 Modern Medicine lessons successfully refactored!');

