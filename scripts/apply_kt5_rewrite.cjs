const fs = require('fs');
const path = require('path');

const kt5Updates = {
  lesson_5_1: {
    blocks: [
      {
        act: 1,
        title: "Flanders Terrain & The Ypres Salient (1914–1915)",
        theme_heading: "Flanders Terrain & The Ypres Salient (1914–1915)",
        theme: "Flanders Terrain & The Ypres Salient (1914–1915)",
        text: `<span class="para-ref">[1.1]</span> In August 1914, the British Expeditionary Force (BEF) arrived in France expecting a rapid war of mobile movement. However, after the Battle of the Marne and the "Race to the Sea", both armies dug an unbroken line of trenches stretching four hundred miles from the Swiss border to the English Channel. In Flanders (western Belgium), the British defended the famous "Ypres Salient"—a dangerous bulge in the Allied line jutting into German territory.<br><br><span class="para-ref">[1.2]</span> The physical terrain around Ypres was a medical and military nightmare. The soil consisted of thick, waterlogged clay with a very high water table; whenever soldiers dug down just two feet, trenches flooded with water. Crucially, the German army held the high ground surrounding the Salient (such as Passchendaele Ridge), allowing German artillery observers to look straight down into British trenches and shell them with devastating accuracy from three sides.`,
        content: `<span class="para-ref">[1.1]</span> In August 1914, the British Expeditionary Force (BEF) arrived in France expecting a rapid war of mobile movement. However, after the Battle of the Marne and the "Race to the Sea", both armies dug an unbroken line of trenches stretching four hundred miles from the Swiss border to the English Channel. In Flanders (western Belgium), the British defended the famous "Ypres Salient"—a dangerous bulge in the Allied line jutting into German territory.<br><br><span class="para-ref">[1.2]</span> The physical terrain around Ypres was a medical and military nightmare. The soil consisted of thick, waterlogged clay with a very high water table; whenever soldiers dug down just two feet, trenches flooded with water. Crucially, the German army held the high ground surrounding the Salient (such as Passchendaele Ridge), allowing German artillery observers to look straight down into British trenches and shell them with devastating accuracy from three sides.`
      },
      {
        act: 2,
        title: "Trench Architecture & Defensive Features (1914–1918)",
        theme_heading: "Trench Architecture & Defensive Features (1914–1918)",
        theme: "Trench Architecture & Defensive Features (1914–1918)",
        text: `<span class="para-ref">[2.1]</span> To survive relentless artillery fire and machine guns, soldiers transformed simple ditches into elaborate defensive earthworks. Trenches were typically six to seven feet deep. At the front was the **parapet**, built up with sandbags to protect soldiers' heads, and at the back was the **parados**, protecting them from blast fragments landing behind. Soldiers stood on a raised earthen ledge called the **firestep** to shoot over the parapet into No Man's Land.<br><br><span class="para-ref">[2.2]</span> Trenches were never dug in straight lines. Instead, they were constructed in a zig-zag pattern with right-angled bends called **traverses**. This ensured that if an artillery shell landed in a trench, the blast and flying shrapnel were contained within a single bay. It also prevented enemy soldiers who broke into a trench from firing down its entire length. Wooden **duckboards** were placed along the bottom over drainage sumps to keep soldiers’ feet out of standing mud.`,
        content: `<span class="para-ref">[2.1]</span> To survive relentless artillery fire and machine guns, soldiers transformed simple ditches into elaborate defensive earthworks. Trenches were typically six to seven feet deep. At the front was the **parapet**, built up with sandbags to protect soldiers' heads, and at the back was the **parados**, protecting them from blast fragments landing behind. Soldiers stood on a raised earthen ledge called the **firestep** to shoot over the parapet into No Man's Land.<br><br><span class="para-ref">[2.2]</span> Trenches were never dug in straight lines. Instead, they were constructed in a zig-zag pattern with right-angled bends called **traverses**. This ensured that if an artillery shell landed in a trench, the blast and flying shrapnel were contained within a single bay. It also prevented enemy soldiers who broke into a trench from firing down its entire length. Wooden **duckboards** were placed along the bottom over drainage sumps to keep soldiers’ feet out of standing mud.`
      },
      {
        act: 3,
        title: "The Trench System & Evacuation Bottlenecks (1915–1918)",
        theme_heading: "The Trench System & Evacuation Bottlenecks (1915–1918)",
        theme: "The Trench System & Evacuation Bottlenecks (1915–1918)",
        text: `<span class="para-ref">[3.1]</span> The British defensive network consisted of four parallel lines of trenches connected by linking ditches. Closest to the enemy was the **frontline trench**, where troops mounted guard and launched attacks. Several hundred yards behind was the **support trench**, housing backup troops ready to reinforce the frontline. Further back lay the **reserve trench**, holding troops and supplies in case frontline positions were overrun.<br><br><span class="para-ref">[3.2]</span> These lines were connected by narrow **communication trenches**. These ditches were vital for transporting food, ammunition, and fresh troops to the front, and for evacuating wounded soldiers to the rear. However, communication trenches were narrow, muddy, and constantly blocked by troops moving in both directions, making stretcher evacuation an agonizingly slow struggle during heavy bombardments.`,
        content: `<span class="para-ref">[3.1]</span> The British defensive network consisted of four parallel lines of trenches connected by linking ditches. Closest to the enemy was the **frontline trench**, where troops mounted guard and launched attacks. Several hundred yards behind was the **support trench**, housing backup troops ready to reinforce the frontline. Further back lay the **reserve trench**, holding troops and supplies in case frontline positions were overrun.<br><br><span class="para-ref">[3.2]</span> These lines were connected by narrow **communication trenches**. These ditches were vital for transporting food, ammunition, and fresh troops to the front, and for evacuating wounded soldiers to the rear. However, communication trenches were narrow, muddy, and constantly blocked by troops moving in both directions, making stretcher evacuation an agonizingly slow struggle during heavy bombardments.`
      },
      {
        act: 4,
        title: "Arras Underground Hospital & Caves (1916–1917)",
        theme_heading: "Arras Underground Hospital & Caves (1916–1917)",
        theme: "Arras Underground Hospital & Caves (1916–1917)",
        text: `<span class="para-ref">[4.1]</span> In northern France, the city of Arras had a unique geology: beneath the town lay vast ancient chalk quarries. In late 1916, British and New Zealand tunnelling companies linked these underground quarries to create an enormous network of subterranean tunnels stretching over eight miles.<br><br><span class="para-ref">[4.2]</span> Inside these chalk caverns, the British built the extraordinary **Arras Underground Hospital** (known as "Thompson's Cave"). It contained seven hundred hospital beds, fully equipped operating theatres, running water, and electric lighting. Because it was buried deep underground, medical staff could perform surgery safely away from German artillery shells, right beneath the front lines.`,
        content: `<span class="para-ref">[4.1]</span> In northern France, the city of Arras had a unique geology: beneath the town lay vast ancient chalk quarries. In late 1916, British and New Zealand tunnelling companies linked these underground quarries to create an enormous network of subterranean tunnels stretching over eight miles.<br><br><span class="para-ref">[4.2]</span> Inside these chalk caverns, the British built the extraordinary **Arras Underground Hospital** (known as "Thompson's Cave"). It contained seven hundred hospital beds, fully equipped operating theatres, running water, and electric lighting. Because it was buried deep underground, medical staff could perform surgery safely away from German artillery shells, right beneath the front lines.`
      },
      {
        act: 5,
        title: "Mass Battles: The Somme & Cambrai (1916–1917)",
        theme_heading: "Mass Battles: The Somme & Cambrai (1916–1917)",
        theme: "Mass Battles: The Somme & Cambrai (1916–1917)",
        text: `<span class="para-ref">[5.1]</span> The scale of medical casualties was shaped by massive battles. On 1 July 1916, the first day of the **Battle of the Somme**, the British Army suffered 57,470 casualties, with 20,000 soldiers killed in a single afternoon. The sheer volume of wounded soldiers completely overwhelmed stretcher bearers and dressing stations, forcing the medical services to rethink casualty evacuation.<br><br><span class="para-ref">[5.2]</span> In November 1917, the **Battle of Cambrai** marked another turning point: the British launched the war's first mass tank assault, breaking through German lines. To support the assault, the army established the war’s first frontline blood bank depot. Mass battles forced military medicine to modernize rapidly under extreme crisis.`,
        content: `<span class="para-ref">[5.1]</span> The scale of medical casualties was shaped by massive battles. On 1 July 1916, the first day of the **Battle of the Somme**, the British Army suffered 57,470 casualties, with 20,000 soldiers killed in a single afternoon. The sheer volume of wounded soldiers completely overwhelmed stretcher bearers and dressing stations, forcing the medical services to rethink casualty evacuation.<br><br><span class="para-ref">[5.2]</span> In November 1917, the **Battle of Cambrai** marked another turning point: the British launched the war's first mass tank assault, breaking through German lines. To support the assault, the army established the war’s first frontline blood bank depot. Mass battles forced military medicine to modernize rapidly under extreme crisis.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.2], why did the high water table and German positions make the Ypres Salient so dangerous?",
        answer: "Trenches flooded with water just two feet down, and the German army occupied the surrounding high ground to shell the British from three sides."
      },
      {
        question: "Using paragraph [2.2], why were trenches dug with right-angled bends called traverses?",
        answer: "Traverses stopped blast and shrapnel travelling down the whole trench if a shell hit, and prevented enemies firing down the line."
      },
      {
        question: "According to paragraph [3.2], why did communication trenches cause major problems for casualty evacuation?",
        answer: "They were narrow and muddy, causing severe traffic jams as stretcher bearers squeezed past troops carrying ammunition forward."
      },
      {
        question: "Using paragraph [4.2], what facilities were built inside the underground hospital at Arras?",
        answer: "Seven hundred hospital beds, operating theatres, running water, and electric lighting, protected deep underground from artillery shells."
      }
    ]
  },
  lesson_5_2: {
    blocks: [
      {
        act: 1,
        title: "The Flanders Mud & Trench Foot (1914–1915)",
        theme_heading: "The Flanders Mud & Trench Foot (1914–1915)",
        theme: "The Flanders Mud & Trench Foot (1914–1915)",
        text: `<span class="para-ref">[1.1]</span> The hostile weather and waterlogged terrain of Flanders caused severe non-combat illnesses that disabled thousands of British soldiers. The most common was **Trench Foot**, caused by standing for days in freezing mud and contaminated water inside flooded trenches while wearing tight, water-soaked leather boots and puttees.<br><br><span class="para-ref">[1.2]</span> The cold and wet restricted blood circulation, causing feet to swell, turn numb, and turn red or blue. If left untreated, the tissue died from gangrene, leaving doctors with no choice but to amputate the toes or foot. In the winter of 1914–1915 alone, over twenty thousand British soldiers were hospitalized with trench foot.`,
        content: `<span class="para-ref">[1.1]</span> The hostile weather and waterlogged terrain of Flanders caused severe non-combat illnesses that disabled thousands of British soldiers. The most common was **Trench Foot**, caused by standing for days in freezing mud and contaminated water inside flooded trenches while wearing tight, water-soaked leather boots and puttees.<br><br><span class="para-ref">[1.2]</span> The cold and wet restricted blood circulation, causing feet to swell, turn numb, and turn red or blue. If left untreated, the tissue died from gangrene, leaving doctors with no choice but to amputate the toes or foot. In the winter of 1914–1915 alone, over twenty thousand British soldiers were hospitalized with trench foot.`
      },
      {
        act: 2,
        title: "Preventing Trench Foot: Whale Oil & The Buddy System (1915–1918)",
        theme_heading: "Preventing Trench Foot: Whale Oil & The Buddy System (1915–1918)",
        theme: "Preventing Trench Foot: Whale Oil & The Buddy System (1915–1918)",
        text: `<span class="para-ref">[2.1]</span> The British Army realized that prevention was far more effective than hospital treatment. Army command introduced strict daily routines: officers inspected men’s feet twice a day, duckboards were laid along trench floors to keep feet out of water, and drainage channels were continuously dug.<br><br><span class="para-ref">[2.2]</span> Every soldier was issued three pairs of clean, dry socks and ordered to rub their feet with **whale oil** to create a waterproof barrier against damp. Soldiers used the "buddy system", pairing up to check and rub each other's feet daily. If a soldier developed trench foot, his commanding officer could be disciplined, drastically reducing cases by 1917.`,
        content: `<span class="para-ref">[2.1]</span> The British Army realized that prevention was far more effective than hospital treatment. Army command introduced strict daily routines: officers inspected men’s feet twice a day, duckboards were laid along trench floors to keep feet out of water, and drainage channels were continuously dug.<br><br><span class="para-ref">[2.2]</span> Every soldier was issued three pairs of clean, dry socks and ordered to rub their feet with **whale oil** to create a waterproof barrier against damp. Soldiers used the "buddy system", pairing up to check and rub each other's feet daily. If a soldier developed trench foot, his commanding officer could be disciplined, drastically reducing cases by 1917.`
      },
      {
        act: 3,
        title: "Trench Fever, Body Lice & Delousing (1914–1918)",
        theme_heading: "Trench Fever, Body Lice & Delousing (1914–1918)",
        theme: "Trench Fever, Body Lice & Delousing (1914–1918)",
        text: `<span class="para-ref">[3.1]</span> Another widespread illness was **Trench Fever**, which produced severe flu-like symptoms, high fevers, headaches, and agonizing shooting pains in the shins. It affected an estimated 15% of all British frontline troops, putting soldiers out of action for up to two months.<br><br><span class="para-ref">[3.2]</span> In 1918, medical researchers proved that trench fever was spread by body lice, tiny parasites that lived in the seams of soldiers' woollen uniforms. Soldiers tried burning lice with lighted candles, but only systematic prevention worked: the army set up mobile bath houses and steam delousing machines behind the lines to sterilize uniforms with high-temperature steam.`,
        content: `<span class="para-ref">[3.1]</span> Another widespread illness was **Trench Fever**, which produced severe flu-like symptoms, high fevers, headaches, and agonizing shooting pains in the shins. It affected an estimated 15% of all British frontline troops, putting soldiers out of action for up to two months.<br><br><span class="para-ref">[3.2]</span> In 1918, medical researchers proved that trench fever was spread by body lice, tiny parasites that lived in the seams of soldiers' woollen uniforms. Soldiers tried burning lice with lighted candles, but only systematic prevention worked: the army set up mobile bath houses and steam delousing machines behind the lines to sterilize uniforms with high-temperature steam.`
      },
      {
        act: 4,
        title: "Dysentery, Sanitation & Water Chlorination (1914–1918)",
        theme_heading: "Dysentery, Sanitation & Water Chlorination (1914–1918)",
        theme: "Dysentery, Sanitation & Water Chlorination (1914–1918)",
        text: `<span class="para-ref">[4.1]</span> In muddy, flooded trenches, maintaining basic human sanitation was a constant struggle. Overcrowding, unwashed hands, and flies feeding on human waste and decomposing corpses spread **Dysentery**—a severe bacterial stomach infection causing violent diarrhoea, fever, and dangerous dehydration.<br><br><span class="para-ref">[4.2]</span> To control dysentery, the Royal Army Medical Corps (RAMC) enforced strict sanitary discipline. Deep latrine pits were dug behind trenches and treated daily with chloride of lime. Water supplies were strictly purified using chlorine tablets, and drinking unboiled shell-hole water was strictly forbidden, preventing the devastating waterborne epidemics that had destroyed armies in previous wars.`,
        content: `<span class="para-ref">[4.1]</span> In muddy, flooded trenches, maintaining basic human sanitation was a constant struggle. Overcrowding, unwashed hands, and flies feeding on human waste and decomposing corpses spread **Dysentery**—a severe bacterial stomach infection causing violent diarrhoea, fever, and dangerous dehydration.<br><br><span class="para-ref">[4.2]</span> To control dysentery, the Royal Army Medical Corps (RAMC) enforced strict sanitary discipline. Deep latrine pits were dug behind trenches and treated daily with chloride of lime. Water supplies were strictly purified using chlorine tablets, and drinking unboiled shell-hole water was strictly forbidden, preventing the devastating waterborne epidemics that had destroyed armies in previous wars.`
      },
      {
        act: 5,
        title: "Shell Shock & Psychological Trauma (1914–1918)",
        theme_heading: "Shell Shock & Psychological Trauma (1914–1918)",
        theme: "Shell Shock & Psychological Trauma (1914–1918)",
        text: `<span class="para-ref">[5.1]</span> Beyond physical illnesses, the relentless noise and terror of days-long high-explosive artillery bombardments caused unprecedented mental breakdowns, termed **Shell Shock**. Sufferers experienced severe uncontrollable shaking, nightmares, blindness, muteness, and paralysis.<br><br><span class="para-ref">[5.2]</span> Over eighty thousand British soldiers were diagnosed with shell shock. Early in the war, military commanders misunderstood the condition, accusing traumatized soldiers of cowardice or malingering, and some were executed. Gradually, the army recognized shell shock as a medical illness, treating soldiers with rest and psychiatric care in specialized hospitals like Craiglockhart in Scotland.`,
        content: `<span class="para-ref">[5.1]</span> Beyond physical illnesses, the relentless noise and terror of days-long high-explosive artillery bombardments caused unprecedented mental breakdowns, termed **Shell Shock**. Sufferers experienced severe uncontrollable shaking, nightmares, blindness, muteness, and paralysis.<br><br><span class="para-ref">[5.2]</span> Over eighty thousand British soldiers were diagnosed with shell shock. Early in the war, military commanders misunderstood the condition, accusing traumatized soldiers of cowardice or malingering, and some were executed. Gradually, the army recognized shell shock as a medical illness, treating soldiers with rest and psychiatric care in specialized hospitals like Craiglockhart in Scotland.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what caused Trench Foot in the trenches of Flanders?",
        answer: "Standing for days in freezing mud and contaminated water while wearing tight, water-soaked leather boots and puttees."
      },
      {
        question: "Using paragraph [2.2], what two prevention measures were used by soldiers to stop Trench Foot?",
        answer: "Rubbing feet daily with whale oil to create a waterproof barrier, and pairing up with a buddy to check each other's feet."
      },
      {
        question: "According to paragraph [3.2], what insect parasite spread Trench Fever among British soldiers?",
        answer: "Body lice, which lived in the seams of soldiers' woollen uniforms."
      },
      {
        question: "Using paragraph [5.1], what were the main symptoms of Shell Shock caused by artillery bombardments?",
        answer: "Severe shaking, nightmares, blindness, muteness, and physical paralysis."
      }
    ]
  },
  lesson_5_3: {
    blocks: [
      {
        act: 1,
        title: "Artillery Firepower & Jagged Shrapnel Trauma (1914–1918)",
        theme_heading: "Artillery Firepower & Jagged Shrapnel Trauma (1914–1918)",
        theme: "Artillery Firepower & Jagged Shrapnel Trauma (1914–1918)",
        text: `<span class="para-ref">[1.1]</span> Unlike previous wars where rifle bullets caused most injuries, trauma on the Western Front was dominated by heavy industrial artillery. Exploding artillery shells caused roughly 58% of all battlefield wounds, while bullets from rifles and machine guns caused about 39%.<br><br><span class="para-ref">[1.2]</span> Artillery shells produced horrific wounds: high-explosive shells exploded into jagged, uneven metal fragments called **shrapnel** that spun through the air at high speed, shattering bones and tearing open deep cavities in flesh. Blast waves alone could rupture internal organs, throw soldiers into the air, and cause traumatic amputations on the battlefield.`,
        content: `<span class="para-ref">[1.1]</span> Unlike previous wars where rifle bullets caused most injuries, trauma on the Western Front was dominated by heavy industrial artillery. Exploding artillery shells caused roughly 58% of all battlefield wounds, while bullets from rifles and machine guns caused about 39%.<br><br><span class="para-ref">[1.2]</span> Artillery shells produced horrific wounds: high-explosive shells exploded into jagged, uneven metal fragments called **shrapnel** that spun through the air at high speed, shattering bones and tearing open deep cavities in flesh. Blast waves alone could rupture internal organs, throw soldiers into the air, and cause traumatic amputations on the battlefield.`
      },
      {
        act: 2,
        title: "Soil Bacteria & The Gas Gangrene Crisis (1914–1918)",
        theme_heading: "Soil Bacteria & The Gas Gangrene Crisis (1914–1918)",
        theme: "Soil Bacteria & The Gas Gangrene Crisis (1914–1918)",
        text: `<span class="para-ref">[2.1]</span> The nature of the farmland of northern France and Flanders created a deadly biological hazard. For centuries, the soil had been heavily fertilized with animal manure, meaning the mud was teeming with dangerous anaerobic bacteria (bacteria that thrive without oxygen), including tetanus and **gas gangrene** microbes.<br><br><span class="para-ref">[2.2]</span> When shrapnel or bullets struck a soldier, they carried muddy pieces of dirty uniform and soil deep into torn muscles. In deep, oxygen-deprived wound pockets, gas gangrene bacteria multiplied rapidly, producing foul-smelling gas bubbles under the skin and destroying living tissue. Gas gangrene could kill a wounded soldier within hours unless dead tissue was swiftly removed.`,
        content: `<span class="para-ref">[2.1]</span> The nature of the farmland of northern France and Flanders created a deadly biological hazard. For centuries, the soil had been heavily fertilized with animal manure, meaning the mud was teeming with dangerous anaerobic bacteria (bacteria that thrive without oxygen), including tetanus and **gas gangrene** microbes.<br><br><span class="para-ref">[2.2]</span> When shrapnel or bullets struck a soldier, they carried muddy pieces of dirty uniform and soil deep into torn muscles. In deep, oxygen-deprived wound pockets, gas gangrene bacteria multiplied rapidly, producing foul-smelling gas bubbles under the skin and destroying living tissue. Gas gangrene could kill a wounded soldier within hours unless dead tissue was swiftly removed.`
      },
      {
        act: 3,
        title: "Head Trauma & The Brodie Steel Helmet (Late 1915–1918)",
        theme_heading: "Head Trauma & The Brodie Steel Helmet (Late 1915–1918)",
        theme: "Head Trauma & The Brodie Steel Helmet (Late 1915–1918)",
        text: `<span class="para-ref">[3.1]</span> In 1914, British soldiers went to war wearing soft cloth caps, offering zero protection against descending shrapnel and falling debris. As a result, head injuries accounted for a massive proportion of fatal battlefield wounds. In trench warfare, soldiers constantly had to look over the parapet, exposing their heads to sniper fire and exploding shells.<br><br><span class="para-ref">[3.2]</span> In late 1915, the British Army introduced the **Brodie steel helmet**, pressed from a single sheet of hardened steel with a wide brim to protect the wearer’s head and neck from falling shrapnel balls. The Brodie helmet was an immediate lifesaver, reducing fatal head injuries by an estimated 80% across the British sector.`,
        content: `<span class="para-ref">[3.1]</span> In 1914, British soldiers went to war wearing soft cloth caps, offering zero protection against descending shrapnel and falling debris. As a result, head injuries accounted for a massive proportion of fatal battlefield wounds. In trench warfare, soldiers constantly had to look over the parapet, exposing their heads to sniper fire and exploding shells.<br><br><span class="para-ref">[3.2]</span> In late 1915, the British Army introduced the **Brodie steel helmet**, pressed from a single sheet of hardened steel with a wide brim to protect the wearer’s head and neck from falling shrapnel balls. The Brodie helmet was an immediate lifesaver, reducing fatal head injuries by an estimated 80% across the British sector.`
      },
      {
        act: 4,
        title: "Chemical Warfare: Chlorine & Phosgene (1915–1916)",
        theme_heading: "Chemical Warfare: Chlorine & Phosgene (1915–1916)",
        theme: "Chemical Warfare: Chlorine & Phosgene (1915–1916)",
        text: `<span class="para-ref">[4.1]</span> On 22 April 1915, during the Second Battle of Ypres, German forces introduced a terrifying new weapon: chemical poison gas. German troops released cylinders of greenish-yellow **chlorine gas**, which drifted across British lines. Chlorine stripped the lining of victims' lungs, causing fluid to fill the airways so soldiers suffocated and drowned in their own fluids.<br><br><span class="para-ref">[4.2]</span> British soldiers initially improvised by holding cotton pads soaked in urine over their faces (the ammonia neutralized the acid gas). In late 1915, Germany introduced **phosgene gas**, which was colourless and six times more lethal than chlorine, often killing soldiers up to forty-eight hours after an attack.`,
        content: `<span class="para-ref">[4.1]</span> On 22 April 1915, during the Second Battle of Ypres, German forces introduced a terrifying new weapon: chemical poison gas. German troops released cylinders of greenish-yellow **chlorine gas**, which drifted across British lines. Chlorine stripped the lining of victims' lungs, causing fluid to fill the airways so soldiers suffocated and drowned in their own fluids.<br><br><span class="para-ref">[4.2]</span> British soldiers initially improvised by holding cotton pads soaked in urine over their faces (the ammonia neutralized the acid gas). In late 1915, Germany introduced **phosgene gas**, which was colourless and six times more lethal than chlorine, often killing soldiers up to forty-eight hours after an attack.`
      },
      {
        act: 5,
        title: "Mustard Gas & The Small Box Respirator (1917–1918)",
        theme_heading: "Mustard Gas & The Small Box Respirator (1917–1918)",
        theme: "Mustard Gas & The Small Box Respirator (1917–1918)",
        text: `<span class="para-ref">[5.1]</span> In July 1917, the Germans introduced **mustard gas**, an oily liquid delivered in artillery shells that blistered the skin, burned eyes causing temporary blindness, and contaminated muddy shell holes for days. Unlike chlorine, mustard gas soaked through woollen clothing, causing agonizing internal and external chemical burns.<br><br><span class="para-ref">[5.2]</span> In response, the British developed the **Small Box Respirator (SBR)** in 1916, featuring a rubber face mask connected by a hose to a metal box containing charcoal filters. The SBR was so effective that poison gas caused less than 3% of all British war deaths. However, gas attacks caused widespread panic and blinded thousands of soldiers, requiring specialized medical washing stations and temporary blindness wards.`,
        content: `<span class="para-ref">[5.1]</span> In July 1917, the Germans introduced **mustard gas**, an oily liquid delivered in artillery shells that blistered the skin, burned eyes causing temporary blindness, and contaminated muddy shell holes for days. Unlike chlorine, mustard gas soaked through woollen clothing, causing agonizing internal and external chemical burns.<br><br><span class="para-ref">[5.2]</span> In response, the British developed the **Small Box Respirator (SBR)** in 1916, featuring a rubber face mask connected by a hose to a metal box containing charcoal filters. The SBR was so effective that poison gas caused less than 3% of all British war deaths. However, gas attacks caused widespread panic and blinded thousands of soldiers, requiring specialized medical washing stations and temporary blindness wards.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.1], what percentage of wounds on the Western Front were caused by artillery shells and shrapnel?",
        answer: "Approximately 58% of all battlefield wounds."
      },
      {
        question: "Using paragraph [2.2], why did soil bacteria cause such dangerous gas gangrene in wounded soldiers?",
        answer: "Manured farm soil and dirty uniform pieces were pushed deep into wounds, where bacteria multiplied without oxygen and destroyed living muscle tissue."
      },
      {
        question: "According to paragraph [3.2], what protective item introduced in late 1915 reduced fatal head wounds by 80%?",
        answer: "The Brodie steel helmet."
      },
      {
        question: "Using paragraph [5.2], what piece of equipment introduced in 1916 protected British soldiers from poison gas?",
        answer: "The Small Box Respirator (SBR), using a rubber face mask and charcoal filter box."
      }
    ]
  },
  lesson_5_4: {
    blocks: [
      {
        act: 1,
        title: "Frontline Retrieval & The Regimental Aid Post (1914–1918)",
        theme_heading: "Frontline Retrieval & The Regimental Aid Post (1914–1918)",
        theme: "Frontline Retrieval & The Regimental Aid Post (1914–1918)",
        text: `<span class="para-ref">[1.1]</span> Casualty survival on the Western Front depended on the **Chain of Evacuation**—a series of medical stages transporting wounded men from muddy trenches back to specialist hospitals. The first stage began with **stretcher bearers**, sixteen per battalion, who braved machine-gun fire to carry wounded men across shell craters to safety.<br><br><span class="para-ref">[1.2]</span> Just behind the frontline (usually within two hundred yards) was the **Regimental Aid Post (RAP)**, set up in a dugout, ruined cellar, or trench wall. Staffed by a single medical officer and orderlies, the RAP provided urgent first aid: bandaging wounds, applying tourniquets to stop bleeding, and administering morphine. It could not perform surgery; its job was to patch up walking wounded to return to duty and send serious cases back to the next stage.`,
        content: `<span class="para-ref">[1.1]</span> Casualty survival on the Western Front depended on the **Chain of Evacuation**—a series of medical stages transporting wounded men from muddy trenches back to specialist hospitals. The first stage began with **stretcher bearers**, sixteen per battalion, who braved machine-gun fire to carry wounded men across shell craters to safety.<br><br><span class="para-ref">[1.2]</span> Just behind the frontline (usually within two hundred yards) was the **Regimental Aid Post (RAP)**, set up in a dugout, ruined cellar, or trench wall. Staffed by a single medical officer and orderlies, the RAP provided urgent first aid: bandaging wounds, applying tourniquets to stop bleeding, and administering morphine. It could not perform surgery; its job was to patch up walking wounded to return to duty and send serious cases back to the next stage.`
      },
      {
        act: 2,
        title: "Field Ambulances & Advanced Dressing Stations (1914–1918)",
        theme_heading: "Field Ambulances & Advanced Dressing Stations (1914–1918)",
        theme: "Field Ambulances & Advanced Dressing Stations (1914–1918)",
        text: `<span class="para-ref">[2.1]</span> A **Field Ambulance** was not a vehicle, but a large mobile medical unit of the RAMC comprising doctors, orderlies, and stretcher bearers. They set up **Advanced Dressing Stations (ADS)** about four hundred yards behind the RAP, and **Main Dressing Stations (MDS)** about a mile back in tents or farm buildings.<br><br><span class="para-ref">[2.2]</span> At dressing stations, casualties were re-bandaged and checked for shock. Medical staff administered the vital **anti-tetanus serum**, which virtually wiped out fatal tetanus infections in British soldiers by 1915. Wounded men were loaded onto horse-drawn or motor ambulances to travel to the next medical stage.`,
        content: `<span class="para-ref">[2.1]</span> A **Field Ambulance** was not a vehicle, but a large mobile medical unit of the RAMC comprising doctors, orderlies, and stretcher bearers. They set up **Advanced Dressing Stations (ADS)** about four hundred yards behind the RAP, and **Main Dressing Stations (MDS)** about a mile back in tents or farm buildings.<br><br><span class="para-ref">[2.2]</span> At dressing stations, casualties were re-bandaged and checked for shock. Medical staff administered the vital **anti-tetanus serum**, which virtually wiped out fatal tetanus infections in British soldiers by 1915. Wounded men were loaded onto horse-drawn or motor ambulances to travel to the next medical stage.`
      },
      {
        act: 3,
        title: "Casualty Clearing Stations & Triage (1914–1918)",
        theme_heading: "Casualty Clearing Stations & Triage (1914–1918)",
        theme: "Casualty Clearing Stations & Triage (1914–1918)",
        text: `<span class="para-ref">[3.1]</span> The most critical medical hub was the **Casualty Clearing Station (CCS)**, located seven to twelve miles behind the front, near railways and canals. Staffed by nurses, specialized surgeons, and anaesthetists, this was the first place where life-saving surgery was performed to stop gas gangrene.<br><br><span class="para-ref">[3.2]</span> To handle thousands of wounded during major battles, the CCS used a strict system of **triage**, dividing casualties into three categories: 1) the walking wounded, who could be quickly patched up; 2) serious casualties needing immediate life-saving surgery; and 3) the hopelessly wounded, who were made comfortable with morphine until they died.`,
        content: `<span class="para-ref">[3.1]</span> The most critical medical hub was the **Casualty Clearing Station (CCS)**, located seven to twelve miles behind the front, near railways and canals. Staffed by nurses, specialized surgeons, and anaesthetists, this was the first place where life-saving surgery was performed to stop gas gangrene.<br><br><span class="para-ref">[3.2]</span> To handle thousands of wounded during major battles, the CCS used a strict system of **triage**, dividing casualties into three categories: 1) the walking wounded, who could be quickly patched up; 2) serious casualties needing immediate life-saving surgery; and 3) the hopelessly wounded, who were made comfortable with morphine until they died.`
      },
      {
        act: 4,
        title: "Base Hospitals on the French Coast (1914–1918)",
        theme_heading: "Base Hospitals on the French Coast (1914–1918)",
        theme: "Base Hospitals on the French Coast (1914–1918)",
        text: `<span class="para-ref">[4.1]</span> Once patients were operated on and stabilized at the CCS, they were loaded onto specialized ambulance trains or canal barges to travel to vast **Base Hospitals** situated on the French coast (such as Boulogne, Le Havre, and Rouen).<br><br><span class="para-ref">[4.2]</span> Base Hospitals had thousands of beds and specialized units for brain surgery, chest wounds, amputations, and plastic surgery. Patients who recovered were sent back to their units, while permanently disabled soldiers were placed on hospital ships to return home to Britain ("Blighty").`,
        content: `<span class="para-ref">[4.1]</span> Once patients were operated on and stabilized at the CCS, they were loaded onto specialized ambulance trains or canal barges to travel to vast **Base Hospitals** situated on the French coast (such as Boulogne, Le Havre, and Rouen).<br><br><span class="para-ref">[4.2]</span> Base Hospitals had thousands of beds and specialized units for brain surgery, chest wounds, amputations, and plastic surgery. Patients who recovered were sent back to their units, while permanently disabled soldiers were placed on hospital ships to return home to Britain ("Blighty").`
      },
      {
        act: 5,
        title: "Transport Logistics: Motor Ambulances & Canal Barges (1914–1918)",
        theme_heading: "Transport Logistics: Motor Ambulances & Canal Barges (1914–1918)",
        theme: "Transport Logistics: Motor Ambulances & Canal Barges (1914–1918)",
        text: `<span class="para-ref">[5.1]</span> Transport technology was critical to survival. In August 1914, the BEF had zero motor ambulances, relying on horse-drawn wagons that shook and jolted wounded men over muddy roads, frequently reopening bleeding wounds and causing death from shock.<br><br><span class="para-ref">[5.2]</span> In October 1914, the British Red Cross raised funds to send 250 modern motor ambulances to France, speeding up transport enormously. Furthermore, specialized canal barges were used to transport severely wounded chest and head cases smoothly along calm waterways without jarring their wounds, dramatically improving recovery rates.`,
        content: `<span class="para-ref">[5.1]</span> Transport technology was critical to survival. In August 1914, the BEF had zero motor ambulances, relying on horse-drawn wagons that shook and jolted wounded men over muddy roads, frequently reopening bleeding wounds and causing death from shock.<br><br><span class="para-ref">[5.2]</span> In October 1914, the British Red Cross raised funds to send 250 modern motor ambulances to France, speeding up transport enormously. Furthermore, specialized canal barges were used to transport severely wounded chest and head cases smoothly along calm waterways without jarring their wounds, dramatically improving recovery rates.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.2], what medical care was provided at the Regimental Aid Post (RAP)?",
        answer: "Urgent first aid: bandaging wounds, stopping bleeding with tourniquets, and administering pain-relieving morphine."
      },
      {
        question: "Using paragraph [2.2], what life-saving injection was given to wounded soldiers at Dressing Stations from 1915?",
        answer: "Anti-tetanus serum, which virtually wiped out fatal tetanus infections in British soldiers."
      },
      {
        question: "According to paragraph [3.2], how did the triage system at Casualty Clearing Stations categorize wounded soldiers?",
        answer: "1) Walking wounded, 2) Serious casualties needing immediate surgery, and 3) Hopelessly wounded who were made comfortable."
      },
      {
        question: "Using paragraph [5.2], why were canal barges used instead of roads to transport chest and head casualties to Base Hospitals?",
        answer: "Canal barges travelled smoothly along calm waterways, avoiding the jarring and jolting of muddy roads that reopened wounds."
      }
    ]
  },
  lesson_5_5: {
    blocks: [
      {
        act: 1,
        title: "Wound Debridement & Surgical Excision (1914–1918)",
        theme_heading: "Wound Debridement & Surgical Excision (1914–1918)",
        theme: "Wound Debridement & Surgical Excision (1914–1918)",
        text: `<span class="para-ref">[1.1]</span> In 1914, British surgeons quickly discovered that normal peacetime antiseptic techniques failed completely against Western Front wounds. Antiseptics like carbolic acid could not reach deep wound pockets, and stitching up wounds trapped anaerobic bacteria inside, accelerating fatal gas gangrene.<br><br><span class="para-ref">[1.2]</span> Military surgeons adopted **wound debridement** (surgical excision): cutting away all dead, damaged, and infected tissue around a bullet or shrapnel track, along with bits of dirty uniform. Crucially, the wound was left open for forty-eight hours to allow air to circulate (since gas gangrene bacteria die in oxygen) before being stitched up once the infection had cleared.`,
        content: `<span class="para-ref">[1.1]</span> In 1914, British surgeons quickly discovered that normal peacetime antiseptic techniques failed completely against Western Front wounds. Antiseptics like carbolic acid could not reach deep wound pockets, and stitching up wounds trapped anaerobic bacteria inside, accelerating fatal gas gangrene.<br><br><span class="para-ref">[1.2]</span> Military surgeons adopted **wound debridement** (surgical excision): cutting away all dead, damaged, and infected tissue around a bullet or shrapnel track, along with bits of dirty uniform. Crucially, the wound was left open for forty-eight hours to allow air to circulate (since gas gangrene bacteria die in oxygen) before being stitched up once the infection had cleared.`
      },
      {
        act: 2,
        title: "The Carrel-Dakin Antiseptic Irrigation Method (1915–1918)",
        theme_heading: "The Carrel-Dakin Antiseptic Irrigation Method (1915–1918)",
        theme: "The Carrel-Dakin Antiseptic Irrigation Method (1915–1918)",
        text: `<span class="para-ref">[2.1]</span> In deep, jagged wounds that could not be completely excised without causing fatal bleeding, surgeons needed a continuous way to disinfect torn tissues. In 1915, French surgeon Alexis Carrel and English chemist Henry Dakin developed the **Carrel-Dakin method**.<br><br><span class="para-ref">[2.2]</span> A sterilised sodium hypochlorite (mild bleach) solution was continuously flushed through the wound via small, perforated rubber tubes inserted deep into the torn flesh. This continuous irrigation killed bacteria without burning healthy tissue, saving thousands of limbs from amputation.`,
        content: `<span class="para-ref">[2.1]</span> In deep, jagged wounds that could not be completely excised without causing fatal bleeding, surgeons needed a continuous way to disinfect torn tissues. In 1915, French surgeon Alexis Carrel and English chemist Henry Dakin developed the **Carrel-Dakin method**.<br><br><span class="para-ref">[2.2]</span> A sterilised sodium hypochlorite (mild bleach) solution was continuously flushed through the wound via small, perforated rubber tubes inserted deep into the torn flesh. This continuous irrigation killed bacteria without burning healthy tissue, saving thousands of limbs from amputation.`
      },
      {
        act: 3,
        title: "The Thomas Splint Revolution (Dec 1915–1916)",
        theme_heading: "The Thomas Splint Revolution (Dec 1915–1916)",
        theme: "The Thomas Splint Revolution (Dec 1915–1916)",
        text: `<span class="para-ref">[3.1]</span> In 1914, compound fractures of the femur (thigh bone) had an appalling death rate of 80%. When the thigh bone snapped, muscle spasms pulled the sharp jagged bone ends together, tearing internal arteries, causing catastrophic internal bleeding, and plunging the soldier into fatal shock during transport.<br><br><span class="para-ref">[3.2]</span> In December 1915, Welsh surgeon Robert Jones introduced the **Thomas splint** (invented by his uncle Hugh Owen Thomas) to the Western Front. This simple metal frame fitted around the leg, applying continuous mechanical tension (traction) that pulled the broken bone straight. By stopping bone ends rubbing together, the Thomas splint drastically reduced shock and internal bleeding, causing the survival rate for femur fractures to jump from 20% to over 80% by 1916.`,
        content: `<span class="para-ref">[3.1]</span> In 1914, compound fractures of the femur (thigh bone) had an appalling death rate of 80%. When the thigh bone snapped, muscle spasms pulled the sharp jagged bone ends together, tearing internal arteries, causing catastrophic internal bleeding, and plunging the soldier into fatal shock during transport.<br><br><span class="para-ref">[3.2]</span> In December 1915, Welsh surgeon Robert Jones introduced the **Thomas splint** (invented by his uncle Hugh Owen Thomas) to the Western Front. This simple metal frame fitted around the leg, applying continuous mechanical tension (traction) that pulled the broken bone straight. By stopping bone ends rubbing together, the Thomas splint drastically reduced shock and internal bleeding, causing the survival rate for femur fractures to jump from 20% to over 80% by 1916.`
      },
      {
        act: 4,
        title: "Mobile X-Ray Units & Radiology (1914–1918)",
        theme_heading: "Mobile X-Ray Units & Radiology (1914–1918)",
        theme: "Mobile X-Ray Units & Radiology (1914–1918)",
        text: `<span class="para-ref">[4.1]</span> Finding buried bullets and shrapnel fragments before performing debridement was vital. If a surgeon had to probe blindly into muscle with forceps, they risked tearing major arteries or pushing infection deeper. High-powered X-rays became an essential battlefield diagnostic tool.<br><br><span class="para-ref">[4.2]</span> In addition to large static X-ray machines at Base Hospitals, mobile X-ray units were mounted in vans and driven directly to Casualty Clearing Stations. Marie Curie raised funds to equip twenty mobile radiology cars ("petites Curies") for the French and British sectors, allowing surgeons to locate pieces of metal in wounded men within minutes of arriving from the front line.`,
        content: `<span class="para-ref">[4.1]</span> Finding buried bullets and shrapnel fragments before performing debridement was vital. If a surgeon had to probe blindly into muscle with forceps, they risked tearing major arteries or pushing infection deeper. High-powered X-rays became an essential battlefield diagnostic tool.<br><br><span class="para-ref">[4.2]</span> In addition to large static X-ray machines at Base Hospitals, mobile X-ray units were mounted in vans and driven directly to Casualty Clearing Stations. Marie Curie raised funds to equip twenty mobile radiology cars ("petites Curies") for the French and British sectors, allowing surgeons to locate pieces of metal in wounded men within minutes of arriving from the front line.`
      },
      {
        act: 5,
        title: "Tactical Limits of Battlefield X-Rays (1914–1918)",
        theme_heading: "Tactical Limits of Battlefield X-Rays (1914–1918)",
        theme: "Tactical Limits of Battlefield X-Rays (1914–1918)",
        text: `<span class="para-ref">[5.1]</span> While revolutionary, battlefield X-rays faced severe physical limitations. X-ray machines were fragile, glass photographic plates easily cracked on bumpy roads, and machines overheated quickly, requiring cooldown periods after several scans.<br><br><span class="para-ref">[5.2]</span> Furthermore, X-rays could only detect dense metal shrapnel and bone: bits of muddy uniform, wooden splinters, and soil were completely invisible on X-ray plates. Surgeons still had to rely on careful manual exploration during debridement to remove organic material before gas gangrene set in.`,
        content: `<span class="para-ref">[5.1]</span> While revolutionary, battlefield X-rays faced severe physical limitations. X-ray machines were fragile, glass photographic plates easily cracked on bumpy roads, and machines overheated quickly, requiring cooldown periods after several scans.<br><br><span class="para-ref">[5.2]</span> Furthermore, X-rays could only detect dense metal shrapnel and bone: bits of muddy uniform, wooden splinters, and soil were completely invisible on X-ray plates. Surgeons still had to rely on careful manual exploration during debridement to remove organic material before gas gangrene set in.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.2], what was wound debridement and why was the wound left open?",
        answer: "Cutting away dead tissue and dirty clothing around a wound, leaving it open to let air circulate because gas gangrene bacteria die in oxygen."
      },
      {
        question: "Using paragraph [2.2], how did the Carrel-Dakin method disinfect deep wounds?",
        answer: "A mild antiseptic bleach solution was continuously flushed deep into the wound through perforated rubber tubes."
      },
      {
        question: "According to paragraph [3.2], how did the Thomas splint increase survival rates for broken thigh bones from 20% to 80%?",
        answer: "It pulled the broken leg bone straight with continuous tension, stopping jagged bone ends rubbing together and causing fatal internal bleeding."
      },
      {
        question: "Using paragraph [5.2], what major limitation did battlefield X-rays have when diagnosing wounded soldiers?",
        answer: "They only showed dense metal and bone; bits of dirty uniform, wood, and soil were completely invisible on X-ray plates."
      }
    ]
  },
  lesson_5_6: {
    blocks: [
      {
        act: 1,
        title: "Haemorrhagic Shock & Sodium Citrate (1914–1915)",
        theme_heading: "Haemorrhagic Shock & Sodium Citrate (1914–1915)",
        theme: "Haemorrhagic Shock & Sodium Citrate (1914–1915)",
        text: `<span class="para-ref">[1.1]</span> Massive blood loss was one of the leading causes of death on the Western Front, plunging wounded soldiers into fatal shock. In 1914, blood transfusions were rare and dangerous: they had to be done directly from person to person (donor to patient) using rubber tubes connecting their arms.<br><br><span class="para-ref">[1.2]</span> Direct transfusion was impossible during active battles: doctors could not find donors in the middle of a bombardment, and blood clotted into solid lumps as soon as it left the body. In late 1914, Belgian doctor Albert Hustin and Argentine physician Luis Agote discovered that adding **sodium citrate** stopped blood clotting without poisoning the patient, allowing blood to be collected in glass flasks.`,
        content: `<span class="para-ref">[1.1]</span> Massive blood loss was one of the leading causes of death on the Western Front, plunging wounded soldiers into fatal shock. In 1914, blood transfusions were rare and dangerous: they had to be done directly from person to person (donor to patient) using rubber tubes connecting their arms.<br><br><span class="para-ref">[1.2]</span> Direct transfusion was impossible during active battles: doctors could not find donors in the middle of a bombardment, and blood clotted into solid lumps as soon as it left the body. In late 1914, Belgian doctor Albert Hustin and Argentine physician Luis Agote discovered that adding **sodium citrate** stopped blood clotting without poisoning the patient, allowing blood to be collected in glass flasks.`
      },
      {
        act: 2,
        title: "Glucose Refrigeration & Extended Blood Storage (1916–1917)",
        theme_heading: "Glucose Refrigeration & Extended Blood Storage (1916–1917)",
        theme: "Glucose Refrigeration & Extended Blood Storage (1916–1917)",
        text: `<span class="para-ref">[2.1]</span> Although sodium citrate stopped blood clotting, the blood still broke down after a few days. In 1916, Francis Rous and James Turner at the Rockefeller Institute in New York made another breakthrough: adding a **glucose** (sugar) solution allowed refrigerated citrated blood to be safely stored for up to four weeks.<br><br><span class="para-ref">[2.2]</span> This was a medical revolution. For the first time in human history, blood could be collected days or weeks in advance of a battle, stored in ice boxes, and transported directly to frontline casualty stations ready for emergency transfusions.`,
        content: `<span class="para-ref">[2.1]</span> Although sodium citrate stopped blood clotting, the blood still broke down after a few days. In 1916, Francis Rous and James Turner at the Rockefeller Institute in New York made another breakthrough: adding a **glucose** (sugar) solution allowed refrigerated citrated blood to be safely stored for up to four weeks.<br><br><span class="para-ref">[2.2]</span> This was a medical revolution. For the first time in human history, blood could be collected days or weeks in advance of a battle, stored in ice boxes, and transported directly to frontline casualty stations ready for emergency transfusions.`
      },
      {
        act: 3,
        title: "Captain Oswald Robertson & The Cambrai Blood Depot (Nov 1917)",
        theme_heading: "Captain Oswald Robertson & The Cambrai Blood Depot (Nov 1917)",
        theme: "Captain Oswald Robertson & The Cambrai Blood Depot (Nov 1917)",
        text: `<span class="para-ref">[3.1]</span> In autumn 1917, Canadian-American medical officer Captain **Oswald Robertson**, serving with the British Army, put these scientific breakthroughs into practice. Ahead of the Battle of Cambrai in November 1917, Robertson established the world’s first frontline **blood bank** (blood depot).<br><br><span class="para-ref">[3.2]</span> Robertson collected blood from healthy soldiers, added sodium citrate and glucose, and packed twenty-two bottles into ammunition boxes padded with sawdust and ice. During the battle, Robertson treated twenty severely wounded soldiers suffering from fatal shock; eleven survived completely. Robertson proved that stored blood banks could save lives under intense combat conditions.`,
        content: `<span class="para-ref">[3.1]</span> In autumn 1917, Canadian-American medical officer Captain **Oswald Robertson**, serving with the British Army, put these scientific breakthroughs into practice. Ahead of the Battle of Cambrai in November 1917, Robertson established the world’s first frontline **blood bank** (blood depot).<br><br><span class="para-ref">[3.2]</span> Robertson collected blood from healthy soldiers, added sodium citrate and glucose, and packed twenty-two bottles into ammunition boxes padded with sawdust and ice. During the battle, Robertson treated twenty severely wounded soldiers suffering from fatal shock; eleven survived completely. Robertson proved that stored blood banks could save lives under intense combat conditions.`
      },
      {
        act: 4,
        title: "Harvey Cushing & Specialized Brain Surgery (1917–1918)",
        theme_heading: "Harvey Cushing & Specialized Brain Surgery (1917–1918)",
        theme: "Harvey Cushing & Specialized Brain Surgery (1917–1918)",
        text: `<span class="para-ref">[4.1]</span> In the early years of the war, penetrating head and brain wounds were considered virtually hopeless, with death rates exceeding 50%. In 1917, American neurosurgeon **Harvey Cushing**, working at a British Casualty Clearing Station during the Battle of Passchendaele, revolutionized brain surgery.<br><br><span class="para-ref">[4.2]</span> Cushing used local anaesthetic rather than general anaesthetic, which stopped the brain swelling dangerously during surgery. He used magnets to extract shrapnel fragments from brain tissue, washed wounds with saline, and closed scalp wounds carefully. By operating quickly near the frontline, Cushing reduced brain surgery death rates from 54% to 29%.`,
        content: `<span class="para-ref">[4.1]</span> In the early years of the war, penetrating head and brain wounds were considered virtually hopeless, with death rates exceeding 50%. In 1917, American neurosurgeon **Harvey Cushing**, working at a British Casualty Clearing Station during the Battle of Passchendaele, revolutionized brain surgery.<br><br><span class="para-ref">[4.2]</span> Cushing used local anaesthetic rather than general anaesthetic, which stopped the brain swelling dangerously during surgery. He used magnets to extract shrapnel fragments from brain tissue, washed wounds with saline, and closed scalp wounds carefully. By operating quickly near the frontline, Cushing reduced brain surgery death rates from 54% to 29%.`
      },
      {
        act: 5,
        title: "Harold Gillies & Plastic Reconstruction (1917–1918)",
        theme_heading: "Harold Gillies & Plastic Reconstruction (1917–1918)",
        theme: "Harold Gillies & Plastic Reconstruction (1917–1918)",
        text: `<span class="para-ref">[5.1]</span> Trench warfare produced horrific facial injuries: when soldiers looked over parapets, shrapnel tore off noses, jaws, and cheeks. In 1917, New Zealand-born surgeon **Harold Gillies** established Queen’s Hospital in Sidcup, Kent, as Britain's specialized centre for facial reconstruction.<br><br><span class="para-ref">[5.2]</span> Gillies invented the **pedicle tube**: a flap of skin was cut from the chest or forehead, rolled into a hollow tube to maintain blood flow, and grafted onto the damaged face. Once the new tissue connected, the tube was detached. Over five thousand disfigured soldiers were treated at Queen's Hospital, marking the birth of modern plastic surgery.`,
        content: `<span class="para-ref">[5.1]</span> Trench warfare produced horrific facial injuries: when soldiers looked over parapets, shrapnel tore off noses, jaws, and cheeks. In 1917, New Zealand-born surgeon **Harold Gillies** established Queen’s Hospital in Sidcup, Kent, as Britain's specialized centre for facial reconstruction.<br><br><span class="para-ref">[5.2]</span> Gillies invented the **pedicle tube**: a flap of skin was cut from the chest or forehead, rolled into a hollow tube to maintain blood flow, and grafted onto the damaged face. Once the new tissue connected, the tube was detached. Over five thousand disfigured soldiers were treated at Queen's Hospital, marking the birth of modern plastic surgery.`
      }
    ],
    guided_reading: [
      {
        question: "According to paragraph [1.2], what chemical discovery by Albert Hustin in 1914 stopped blood from clotting in storage flasks?",
        answer: "Adding sodium citrate to the blood."
      },
      {
        question: "Using paragraph [2.1], what did adding glucose to citrated blood allow doctors to do from 1916?",
        answer: "Refrigerated blood could be safely stored for up to four weeks without breaking down."
      },
      {
        question: "According to paragraph [3.1], what historic medical facility did Captain Oswald Robertson set up at Cambrai in November 1917?",
        answer: "The world's first frontline blood bank (blood depot)."
      },
      {
        question: "Using paragraph [5.2], what plastic surgery technique did Harold Gillies invent at Queen's Hospital, Sidcup?",
        answer: "The pedicle tube, rolling a skin flap into a tube to maintain blood flow while grafting it onto a damaged face."
      }
    ]
  }
};

function applyUpdates(lessons) {
  let count = 0;
  Object.keys(kt5Updates).forEach(id => {
    const l = lessons.find(x => x.id === id);
    if (!l) return;
    const update = kt5Updates[id];
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

console.log('Key Topic 5 (Western Front, 5.1-5.6) successfully refactored!');

