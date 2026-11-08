const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

function applyMetadataAlignment(data) {
  // 1. Align Lesson 2 (The De-industrialisation of India)
  const l2 = data.lessons[1];
  if (l2) {
    l2.prologue = "In 1700, Mughal India was the textile workshop of the world, generating nearly one-quarter of global manufacturing output. Within a century, the East India Company seized the 1765 Bengal Diwani, while Lancashire steam mills flooded the subcontinent with cheap machine-woven cloth. As unequal British tariffs dismantled domestic handlooms, ancient weaving capitals collapsed. How did British corporate expansion dismantle the world's greatest artisanal economy?";
    
    l2.learning_objectives = {
      overarching: "How did East India Company corporate expansion and British industrialisation de-industrialise the Indian economy?",
      scaffolded: [
        "Explain how Mughal India dominated global textile production and why Parliament enacted the protective Calico Acts.",
        "Analyse how the 1765 Bengal Diwani inverted global trade flows from silver bullion imports to colonial revenue extraction.",
        "Evaluate the catastrophic impact of Lancashire steam mills and unequal tariffs on Indian handloom weavers and Bentinck's lament."
      ]
    };

    l2.sources = [
      {
        id: "sbe_l2_src_a",
        label: "Source A",
        title: "Source A (Historical Painting): Benjamin West, Shah Alam Conveying the Grant of the Diwani to Lord Clive (1795)",
        author: "Benjamin West (1795)",
        date: "1795",
        type: "painting",
        image: "/images/shah_alam_clive.jpg",
        caption: "Benjamin West's oil painting depicting Mughal Emperor Shah Alam II conveying the Diwani of Bengal, Bihar, and Orissa to Robert Clive in August 1765.",
        text: "The painting depicts Emperor Shah Alam II seated on an imperial dais inside an ornate tent at Allahabad, handing a royal scroll (the Diwani) to Robert Clive. British officers surround Clive in formal uniforms, while Indian courtiers bow in submission.",
        provenance: "Commissioned by Robert Clive's son and painted by Anglo-American historical artist Benjamin West in 1795.",
        analysis: "Illustrates the symbolic transfer of fiscal sovereignty over Bengal from the Mughal crown to the East India Company, masking armed coercion beneath diplomatic ceremony.",
        question: "How does Benjamin West portray the relationship between Robert Clive and Emperor Shah Alam II in this official portrait?"
      },
      {
        id: "sbe_l2_src_b",
        label: "Source B",
        title: "Source B (Industrial Record): Samuel Crompton's Spinning Mule and the Mechanisation of Cotton (1779)",
        author: "Samuel Crompton (1779)",
        date: "1779",
        type: "artefact",
        image: "/images/spinning_mule.jpg",
        caption: "Samuel Crompton's spinning mule, which enabled British textile factories to mechanically replicate the yarn softness and tensile strength of Indian hand-spinners.",
        text: "The spinning mule combined the drawing-out roller action of Arkwright's water frame with the mobile spindle carriage of Hargreaves' spinning jenny, allowing cotton operatives to spin unprecedented quantities of strong, ultra-fine yarn.",
        provenance: "Invented in Bolton, Lancashire, in 1779; rapidly adopted by steam-powered cotton mills across Manchester.",
        analysis: "Demonstrates how British mechanical technology caught up with and ultimately surpassed the speed and volume of traditional Indian domestic hand-spinning.",
        question: "How did technological innovations like the spinning mule transform British manufacturing capacity against traditional Indian handloom production?"
      },
      {
        id: "sbe_l2_src_c",
        label: "Source C",
        title: "Source C (Parliamentary Statute): The British Calico Act (1721)",
        author: "Parliament of Great Britain (1721)",
        date: "1721",
        type: "written",
        text: "\"An Act to preserve and encourage the woollen and silk manufactures of this kingdom... Be it enacted, that from and after the twenty-fifth day of December 1722, it shall not be lawful for any person whatsoever to use or wear in Great Britain, in any garment or apparel whatsoever, any printed, painted, stained, or dyed calico... upon penalty of forfeiting to the informer the sum of five pounds.\"",
        provenance: "Enacted by the British Parliament in 1721 following violent riots by Spitalfields silk and woollen weavers against Indian imports.",
        analysis: "Proves that Britain initially relied upon aggressive protectionist tariffs and legal bans rather than free market competition to shelter its domestic textile industry from superior Indian cloth.",
        question: "Why did the British Parliament pass strict laws forbidding the wearing of Indian calico in 1721?"
      },
      {
        id: "sbe_l2_src_d",
        label: "Source D",
        title: "Source D (Parliamentary Evidence): Evidence on the Collapse of the Bengal Handloom Weavers (1840)",
        author: "Charles Trevelyan, British Colonial Civil Servant (1840)",
        date: "1840",
        type: "written",
        text: "\"The peculiar species of manufacture called Dhaka muslins has ceased altogether. The commercial residency has been abolished, and the once flourishing town of Dhaka is now reduced from a population of 150,000 to barely 30,000. The jungle is encroaching upon the city... British machine-made cotton goods have completely supplanted the native manufacture across the country.\"",
        provenance: "Testimony delivered before the House of Commons Select Committee on the Affairs of the East India Company, London, 1840.",
        analysis: "Eyewitness statistical evidence demonstrating the rapid demographic and industrial collapse of India's ancient weaving metropolis under colonial free-trade tariff policy.",
        question: "What evidence does Charles Trevelyan provide to demonstrate the devastation of the Bengali textile trade by 1840?"
      },
      {
        id: "sbe_l2_src_e",
        label: "Source E",
        title: "Source E (Official Dispatch): Governor-General Lord William Bentinck's Minute (1834)",
        author: "Lord William Bentinck, Governor-General of India (1834)",
        date: "1834",
        type: "written",
        image: "/images/bengal_weaver.jpg",
        caption: "A late 19th-century study of an Indian handloom weaver, capturing the surviving domestic craft after decades of colonial economic displacement.",
        text: "\"The misery hardly finds a parallel in the history of commerce. The bones of the cotton-weavers are bleaching the plains of India. The cotton-weaving of India, which for centuries clothed the world, has been utterly broken by the steam looms of Great Britain.\"",
        provenance: "Official administrative minute submitted to the Board of Directors of the East India Company, Calcutta, 1834.",
        analysis: "A striking admission from the supreme British authority in India acknowledging that British industrial policy directly produced the mass impoverishment and starvation of Indian artisans.",
        question: "How does Governor-General Bentinck describe the human consequences of British industrial competition on Indian cotton weavers?"
      }
    ];

    l2.enquiry_question = "Why did British corporate expansion de-industrialise the world’s leading textile economy?";
  }

  // 2. Align Lesson 3 (The 1857 Indian Rebellion)
  const l3 = data.lessons[2];
  if (l3) {
    l3.prologue = "In May 1857, the Indian subcontinent erupted into armed uprising against the East India Company. Sparked by greased Enfield rifle cartridges, the aggressive Doctrine of Lapse, and decades of cultural interference, Indian soldiers (sepoys) and regional rulers rose in defiance. Led by heroic figures like Rani Lakshmibai of Jhansi, the uprising shook British power to its core. Why did corporate military rule spark the 1857 rebellion, and how did it establish the British Raj?";

    l3.learning_objectives = {
      overarching: "Why did corporate military rule spark the 1857 Indian Rebellion, and how did it establish the British Raj?",
      scaffolded: [
        "Explain the long-term political grievances (Doctrine of Lapse, annexation of Awadh) and the immediate cartridge spark of the 1857 uprising.",
        "Analyse the course of the uprising, the heroic defense of Jhansi by Rani Lakshmibai, and the violence of the conflict.",
        "Evaluate how the rebellion forced Parliament to pass the 1858 Government of India Act, dissolving the Company to establish direct Crown rule."
      ]
    };

    l3.sources = [
      {
        id: "sbe_l3_src_a",
        label: "Source A",
        title: "Source A (Official Deposition): Sepoy Grievance over the Greased Enfield Cartridges (Barrackpore, March 1857)",
        author: "Bengal Native Infantry Sepoy Testimony (1857)",
        date: "March 1857",
        type: "written",
        image: "/images/sepoy_mutiny_1857.png",
        caption: "Sepoy infantrymen of the Bengal Native Army; simmering grievances over religious contamination, overseas deployment, and the annexation of Awadh sparked revolt.",
        text: "\"A report has spread throughout all regiments that the paper cartridges issued with the new Enfield rifles are greased with the fat of cows and pigs. To bite the cartridge is to lose our caste and destroy our religion. We believe this is a deliberate design of the British government to make Christians of us all by forcibly violating our holy faiths.\"",
        provenance: "Recorded during the court of inquiry at Barrackpore cantonment, Bengal, March 1857, following the refusal of sepoys to handle the new ammunition.",
        analysis: "Highlights how religious and cultural anxiety served as the immediate detonator for a rebellion rooted in deep distrust of British colonial intentions.",
        question: "Why did the grease used on Enfield rifle cartridges provoke such intense alarm among Hindu and Muslim sepoys?"
      },
      {
        id: "sbe_l3_src_b",
        label: "Source B",
        title: "Source B (Historical Portrait): Contemporary Portrait of Rani Lakshmibai of Jhansi (c. 1857)",
        author: "Indian Court Artist (c. 1857)",
        date: "c. 1857",
        type: "painting",
        image: "/images/rani_of_jhansi.jpg",
        caption: "Popular portrait of Rani Lakshmibai of Jhansi, armed with sword and shield on horseback; General Hugh Rose praised her as 'the bravest and best military leader of the rebels'.",
        text: "The portrait depicts Rani Lakshmibai in traditional Maratha attire, brandishing a curved talwar sword with her adopted son Damodar Rao secured firmly to her back as she rides into combat.",
        provenance: "Preserved in the Central Museum, Gwalior; contemporary portrait celebrating the legendary leader of the Central Indian rebellion.",
        analysis: "Captures the heroic memory of Lakshmibai as an iconic leader of armed anti-colonial resistance who refused to surrender her state to British annexation.",
        question: "How does this portrait portray Rani Lakshmibai's leadership and defiance during the siege of Jhansi?"
      },
      {
        id: "sbe_l3_src_c",
        label: "Source C",
        title: "Source C (Rebel Manifesto): The Azamgarh Proclamation (August 1857)",
        author: "Firoz Shah, Mughal Prince and Rebel Leader (August 1857)",
        date: "August 1857",
        type: "written",
        text: "\"It is well known to all that in this age the people of Hindostan, both Hindoos and Mohammedans, are being ruined under the tyranny and the oppression of the infidel and treacherous English... The British Government has dispossessed the ancient landlords, ruined our artisans by importing cheap foreign cloth, and excluded native gentlemen from all honourable posts in the civil and military service. Rise together to re-establish our ancient honour!\"",
        provenance: "Published in the Delhi Urdu Akhbar in August 1857 on behalf of the insurgent leadership seeking to unite all social classes against British rule.",
        analysis: "Reveals that the 1857 rebellion was not merely a military mutiny, but a coordinated political movement drawing together displaced princes, ruined artisans, and religious leaders.",
        question: "What distinct grievances does the Azamgarh Proclamation list to persuade different sections of Indian society to join the rebellion?"
      },
      {
        id: "sbe_l3_src_d",
        label: "Source D",
        title: "Source D (Military Record): British Military Confrontations during the 1857 Uprising (1857)",
        author: "British Army Field Dispatch (1857)",
        date: "1857",
        type: "engraving",
        image: "/images/indian_rebellion_1857.jpg",
        caption: "British soldiers confronting Indian insurgent forces during the fierce fighting in northern India during the summer of 1857.",
        text: "A contemporary engraving depicting fierce close-quarters combat between British infantry units, loyal Sikh regiments, and rebel sepoy battalions amidst the ruined temples and bazaars of northern India.",
        provenance: "Illustrated London News, contemporary war correspondent dispatch, autumn 1857.",
        analysis: "Illustrates the ferocious, total-war nature of the 1857 conflict, which pitted trained British and Commonwealth forces against equally trained regular sepoy regiments.",
        question: "What does this contemporary engraving suggest about the intensity of the military clashes during the 1857 rebellion?"
      },
      {
        id: "sbe_l3_src_e",
        label: "Source E",
        title: "Source E (Royal Proclamation): Queen Victoria’s Royal Proclamation to the Princes, Chiefs, and People of India (1 November 1858)",
        author: "Queen Victoria & Prime Minister Lord Derby (1 November 1858)",
        date: "1 November 1858",
        type: "written",
        image: "/images/queen_victoria.jpg",
        caption: "Queen Victoria, proclaimed Empress of India (Kaisar-i-Hind) in 1876 following the 1858 liquidation of the East India Company and the direct assumption of Crown rule.",
        text: "\"We hereby announce to the native princes of India, that all treaties and engagements made with them by the Honourable East India Company are by us accepted, and will be scrupulously maintained... We disclaim alike the right and the desire to impose our convictions on any of our subjects. We strictly charge all those who may be in authority under us, that they abstain from all interference with the religious beliefs or worship of our subjects.\"",
        provenance: "Read publicly by Viceroy Lord Canning in Allahabad on 1 November 1858, inaugurating direct Crown rule over India.",
        analysis: "Demonstrates how the British state sought to pacify Indian hostility by promising religious toleration, respecting princely boundaries, and terminating the aggressive Doctrine of Lapse.",
        question: "How did Queen Victoria’s 1858 proclamation attempt to reassure Indian princes and religious communities following the suppression of the rebellion?"
      }
    ];

    l3.enquiry_question = "Why did corporate military rule spark the 1857 Rebellion and establish the British Raj?";
  }

  // 3. Align guided_reading entries
  if (Array.isArray(data.guided_reading)) {
    // Lesson 2 Guided Reading: The Bengal Diwani & Handloom Weavers
    data.guided_reading[1] = {
      lesson_index: 1,
      book_title: "The Bengal Diwani & The Bleaching Plains of India (1765–1834)",
      author: "Robert Clive & Governor-General Lord William Bentinck",
      cover_image: "/images/shah_alam_clive.jpg",
      cover_caption: "Shah Alam II conveying the Diwani of Bengal to Robert Clive (1765).",
      author_context: "Primary archival records documenting the fiscal extraction of Bengal and the economic destruction of India's handloom weaving industry under British colonial rule.",
      is_adapted: false,
      extract: "<em>Robert Clive to the Court of Directors (1765):</em><br>\"The acquisition of the Diwani of Bengal, Bihar, and Orissa places in your hands the richest province of the empire. The revenues alone will amount to two hundred and fifty lakhs of rupees. After defraying all military and civil expenses, there will remain an immense clear surplus of clear treasure. We shall no longer need to send out silver from England to purchase our goods, for the revenues of Bengal will abundantly purchase all our investments.\"<br><br><em>Governor-General Lord William Bentinck (1834):</em><br>\"The misery hardly finds a parallel in the history of commerce. The bones of the cotton-weavers are bleaching the plains of India. The cotton-weaving of India, which for centuries clothed the world, has been utterly broken by the steam looms of Great Britain. Dacca, once the Manchester of India, has shrunk to a shadow of its former grandeur, its population starved into the jungle by our one-way tariffs.\"",
      hinge_question: "<strong>Think:</strong> How did the 1765 Diwani eliminate Britain's need to export silver to India, and what metaphor did Bentinck use to describe the ruined weavers?<br><br><strong>Pair:</strong> Compare Clive's triumphant financial calculation in 1765 with Bentinck's tragic reflection in 1834. Discuss: was the de-industrialisation of India an accidental side effect of steam power, or the deliberate consequence of colonial fiscal policy?<br><br><strong>Share:</strong> Why did the destruction of handloom weaving leave the Indian peasantry so vulnerable to future agricultural famines?",
      audio_file: "/assets/second_empire_reading_l2.mp3",
      questions: [
        "What financial benefit did Robert Clive claim the 1765 Diwani brought to the East India Company?",
        "What phrase did Lord William Bentinck use to describe the fate of India's cotton-weavers in 1834?",
        "Which historic Bengali textile city shrank dramatically as its weaving industry collapsed?"
      ]
    };

    // Lesson 3 Guided Reading: The 1857 Uprising: Azamgarh Proclamation vs Queen's Proclamation
    data.guided_reading[2] = {
      lesson_index: 2,
      book_title: "The Azamgarh Proclamation (1857) & The Queen's Proclamation (1858)",
      author: "Rebel Leaders of the 1857 Uprising & Queen Victoria",
      cover_image: "/images/rani_of_jhansi.jpg",
      cover_caption: "Rani Lakshmibai of Jhansi, heroic leader of the 1857 Indian Rebellion.",
      author_context: "Contrasting primary manifestos: the revolutionary proclamation of the 1857 insurgent leadership calling for the overthrow of British tyranny, versus Queen Victoria’s royal declaration establishing the British Raj.",
      is_adapted: false,
      extract: "<em>The Azamgarh Proclamation (August 1857):</em><br>\"It is well known to all that in this age the people of Hindostan, both Hindoos and Mohammedans, are being ruined under the tyranny and the oppression of the treacherous English. They have dispossessed the ancient zamindars, heavily taxed the peasantry, ruined our native weavers with cheap English cloth, and subverted our sacred religions with greased cartridges. We urge all chiefs, sepoys, and artisans to unite under our imperial standard to purge our land of foreign rule!\"<br><br><em>Queen Victoria's Royal Proclamation (1 November 1858):</em><br>\"We hereby announce that all treaties made with native princes by the East India Company are accepted and confirmed. We disclaim alike the right and the desire to impose our religious convictions on any of our subjects. The government of our territories in India is hereby assumed directly by the Crown, and all our subjects shall enjoy equal and impartial protection of the law.\"",
      hinge_question: "<strong>Think:</strong> What four grievances did the Azamgarh Proclamation identify, and what two promises did Queen Victoria make to pacify India?<br><br><strong>Pair:</strong> Compare the fiery anti-colonial rhetoric of the 1857 rebels with the diplomatic assurances of Queen Victoria's proclamation. Discuss: did the creation of the British Raj genuinely address the grievances that provoked the rebellion?<br><br><strong>Share:</strong> Why was Rani Lakshmibai of Jhansi remembered as a heroic freedom fighter in India while initially demonized in Victorian British newspapers?",
      audio_file: "/assets/second_empire_reading_l3.mp3",
      questions: [
        "What religious grievance contributed directly to the outbreak of the 1857 rebellion?",
        "What major change in the government of India did Queen Victoria's 1858 proclamation enact?",
        "Who was the widowed queen of Jhansi celebrated for leading the defense of her fortress?"
      ]
    };
  }

  return true;
}

// 1. Update data/second_british_empire.json and public/data/second_british_empire.json
['data/second_british_empire.json', 'public/data/second_british_empire.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (applyMetadataAlignment(json)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath}`);
    }
  }
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (json.second_british_empire && applyMetadataAlignment(json.second_british_empire)) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (second_british_empire)`);
    }
  }
});

// 3. Update units/second_british_empire/data.js and public/units/second_british_empire/data.js
['units/second_british_empire/data.js', 'public/units/second_british_empire/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/second_british_empire.json'), 'utf8'));
    const fileContent = 'export default ' + JSON.stringify(json, null, 2) + ';\n';
    fs.writeFileSync(p, fileContent, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});

console.log('Second British Empire pedagogical metadata alignment complete!');

