const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataFilePath = path.join(ROOT_DIR, 'units', 'second_british_empire', 'data.js');
let rawData = fs.readFileSync(dataFilePath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

// Extract enquiryConfigs from render_second_british_empire_workbook.cjs
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_second_british_empire_workbook.cjs');
const wbContent = fs.readFileSync(wbPath, 'utf8');
const startIdx = wbContent.indexOf('const enquiryConfigs = [');
const endIdx = wbContent.indexOf('\nfunction renderFooterStrip');
const cfgStr = wbContent.slice(startIdx, endIdx);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(cfgStr.replace('const enquiryConfigs', 'var enquiryConfigs'), sandbox);
const enquiryConfigs = sandbox.enquiryConfigs;

const newLessonData = [
  {
    id: 'lesson_1',
    title: 'Engines of Empire: Mercantilism, Naval Hegemony & Portsmouth Dockyard',
    enquiry_question: 'How was the British Empire built and sustained through maritime industrial power?',
    narrative_blocks: [
      {
        theme_heading: 'Mercantilism & The Closed Imperial Economy',
        text: `<span class="para-ref">[1.1]</span> Following the loss of the American Thirteen Colonies in 1783, Britain rebuilt its global economic power upon the economic doctrine of **mercantilism**. Under strict Navigation Acts, colonial possessions were forbidden from trading with foreign rivals; instead, British ships transported lucrative raw sugar and cotton from overseas plantations directly to home factories. The Royal Navy escorted armed merchant fleets across Atlantic and Indian Ocean routes, ensuring that trade profits flowed straight into London to accumulate piles of gold coins and silver bullion in the national treasury.`
      },
      {
        theme_heading: 'The Battle of Trafalgar & Ocean Dominance',
        text: `<span class="para-ref">[1.2]</span> Absolute command of the oceans was achieved on 21 October 1805 off Cape Trafalgar. Admiral Lord Nelson commanded twenty-seven battleships into two daring columns, cutting straight through the Franco-Spanish line and smashing enemy flagships with devastating broadsides. Nelson's triumph eliminated French naval competition for a century, controlling global sea lanes and allowing Britain to enforce the **Pax Britannica** across world shipping corridors.`
      },
      {
        theme_heading: 'Portsmouth Royal Dockyard: Industrial Engine of Empire',
        text: `<span class="para-ref">[1.3]</span> The colossal naval power that policed this global network was constructed at Portsmouth Royal Dockyard, the world's largest industrial manufacturing complex. Portsmouth employed over ten thousand dockyard smiths, shipwrights, and machinists. Marc Brunel's steam wooden block mills automated the mass production of 130,000 rigging blocks annually, while giant steam trip-hammers worked around the clock forging iron anchors and naval hardware to keep His Majesty’s fleets constantly battle-ready.`
      },
      {
        theme_heading: 'HMS Warrior & The Ironclad Revolution',
        text: `<span class="para-ref">[1.4]</span> In December 1860, Portsmouth completed the outfitting of **HMS Warrior**, rendering all wooden naval fleets obsolete overnight. Fitted with massive four-inch iron armour plates over eighteen inches of teak, Warrior was completely invulnerable, bouncing cannon shells off her ironclad hull during firing tests. Powered by twin steam engines producing 5,200 horsepower alongside a full rig of sails, Warrior gave Britain unmatched maritime speed and firepower.`
      },
      {
        theme_heading: 'The Two-Power Standard & Victorian Naval Deterrence',
        text: `<span class="para-ref">[1.5]</span> In 1889, Parliament formalized British naval supremacy into statutory law through the landmark Naval Defence Act law. The Act established the strict **Two-Power Standard**, requiring the Royal Navy to maintain a capital battlefleet matching two foreign fleets combined (specifically France and Russia). Backed by £21.5 million in emergency defense funding, shipyards laid down dozens of new battleships, deterring European coalitions and protecting oceanic trade until the First World War.`
      }
    ]
  },
  {
    id: 'lesson_2',
    title: 'The De-industrialisation of India: The Company & Handloom Crisis',
    enquiry_question: 'Why did British corporate expansion de-industrialise the world’s leading textile economy?',
    narrative_blocks: [
      {
        theme_heading: 'Mughal India: The World’s Textile Workshop',
        text: `<span class="para-ref">[2.1]</span> In 1700, Mughal India was the unmatched economic powerhouse of Asia, manufacturing nearly a quarter of world output. In villages across Bengal, Gujarat, and the Coromandel coast, millions of artisan families crafted fine village handloom silk and exquisite woven muslins. European trading companies competed fiercely for these luxury calicoes, paying in silver ingots because Indian artisans required no European manufactured goods in return.`
      },
      {
        theme_heading: 'The Protectionist Calico Acts',
        text: `<span class="para-ref">[2.2]</span> The flood of cheap, beautiful Indian cotton fabrics alarmed domestic British clothiers. In 1719, protesting English weavers rioted through London, tearing calico dresses off women in the streets. Yielding to political pressure, Parliament passed the protectionist **Calico Acts** of 1700 and 1721, banning printed cotton cloth from being imported, worn, or used in Britain, deliberately protecting home wool sales and traditional silk industries from Asian competition.`
      },
      {
        theme_heading: 'The 1765 Diwani: Fiscal Extraction Inverts the Flow',
        text: `<span class="para-ref">[2.3]</span> The financial relationship was fundamentally transformed in 1765 when the East India Company secured the **Diwani** of Bengal. By collecting peasant crop taxes directly from twenty million Indians, Company officials generated an annual tax revenue of £3 million. Instead of shipping bullion from Britain, the Company began buying silk with local taxes, using Bengal’s own tax revenue to purchase goods for European export, effectively halting silver shipments from Britain altogether.`
      },
      {
        theme_heading: 'Lancashire Steam Mills & Unequal Tariffs',
        text: `<span class="para-ref">[2.4]</span> During the Industrial Revolution, inventors in Manchester perfected steam spinning and mechanical power looms. Lancashire factory mills began churning out billions of yards of machine-woven cotton cloth. To destroy Indian competition, Parliament imposed a crushing seventy percent border tax on Indian textiles entering Britain, while forcing British cloth into India with zero tariffs, flooding bazaars with cheap cotton that undercut domestic weavers.`
      },
      {
        theme_heading: 'The Devastation of Handloom Weavers & Bentinck’s Lament',
        text: `<span class="para-ref">[2.5]</span> The destruction of Indian craftsmanship was swift and catastrophic. Historic textile capitals like the Dhaka loom city deserted and shrank from 150,000 residents to under 30,000 as weaving communities collapsed. Hundreds of thousands of starving handloom families were forced into farm labour and rural poverty. In 1834, Governor-General Lord William Bentinck famously wrote: <em>"The misery hardly finds a parallel in the history of commerce. The bones of the cotton-weavers are bleaching the plains of India."</em>`
      }
    ]
  },
  {
    id: 'lesson_3',
    title: 'The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj',
    enquiry_question: 'Why did corporate military rule spark the 1857 Rebellion and establish the British Raj?',
    narrative_blocks: [
      {
        theme_heading: 'The Doctrine of Lapse & Territorial Annexations',
        text: `<span class="para-ref">[3.1]</span> Between 1848 and 1856, Governor-General Lord Dalhousie provoked outrage among Indian royal dynasties through his aggressive **Doctrine of Lapse**. Under this regulation, the Company denied adopted heirs their traditional right to inherit crowns, seizing heirless kingdoms including Satara, Nagpur, Jhansi. In 1856, Dalhousie went further by annexing wealthy Awadh (Oudh), the ancestral homeland of 75,000 Company sepoys, alienating both the landed nobility and the sepoy army.`
      },
      {
        theme_heading: 'The Greased Enfield Cartridges & Religious Alarm',
        text: `<span class="para-ref">[3.2]</span> In early 1857, the British Army introduced the Pattern 1853 Enfield rifle, which required soldiers to tear open greased paper tubes with their teeth before pouring gunpowder down the barrel. Word swept the regiments that the grease consisted of animal tallow, forcing biting cow and pig fat onto sacred lips. This defiled both Hindu soldiers (for whom the cow is sacred) and Muslim soldiers (for whom the pig is unclean), inflaming a widespread fear of forced conversion to Christianity.`
      },
      {
        theme_heading: 'The Meerut Mutiny & The March on Delhi',
        text: `<span class="para-ref">[3.3]</span> On Sunday 10 May 1857, tensions erupted into rebellion at Meerut. After eighty-five sepoys were shackled in irons for refusing the cartridges, their comrades rose in revolt, breaking open jail cells, liberating their brethren, and marching toward Delhi. Entering the Red Fort, they proclaimed the aged Emperor Bahadur Shah Zafar as sovereign ruler of India, forging a powerful symbol of Hindu and Muslim unity against British foreign rule.`
      },
      {
        theme_heading: 'Rani Lakshmibai & The Siege of Jhansi',
        text: `<span class="para-ref">[3.4]</span> The rebellion spread across northern and central India, finding its most courageous leader in **Rani Lakshmibai** of Jhansi. Refusing to surrender her disinherited state, she led her troops into battle, riding battle horseback with her young adopted son bound to her back and swinging curved talwar sword in hand. Lakshmibai fought with ferocious brilliance until she was killed in action at Gwalior in June 1858, with her British opponent Sir Hugh Rose calling her the best military leader of the rebels.`
      },
      {
        theme_heading: 'The Government of India Act 1858: The British Raj',
        text: `<span class="para-ref">[3.5]</span> Shocked by the ferocity of the uprising and the slaughter on both sides, the British Parliament passed the **Government of India Act 1858**, dissolving Company rule permanently after 258 years. India was brought under direct Crown rule, governed on the ground by a Viceroy direct Crown command. On 1 November 1858, the Queen Victoria proclamation pledged religious tolerance and respect for princely treaties, ushering in ninety years of the formal **British Raj**.`
      }
    ]
  },
  {
    id: 'lesson_4',
    title: 'The Scramble for Africa & Imperial Ideology: Maxim Guns & Plunder',
    enquiry_question: 'How did European industrial powers partition Africa, and how was conquest justified?',
    narrative_blocks: [
      {
        theme_heading: 'The Berlin West Africa Conference 1884–1885',
        text: `<span class="para-ref">[4.1]</span> In November 1884, representatives from fourteen European empires gathered in Berlin at the invitation of German Chancellor Otto von Bismarck. Seeking to avoid wars among European rivals for African territory, diplomats spent three months drawing lines across maps with rulers, carving ninety percent of the continent into colonial spheres of influence with zero Africans invited or consulted about their ancestral borders.`
      },
      {
        theme_heading: 'The Principle of Effective Occupation',
        text: `<span class="para-ref">[4.2]</span> The Berlin Conference established the fateful doctrine of **Effective Occupation**. To claim legal ownership over an African territory, European powers could not merely claim it on paper; they had to demonstrate physical control by building coastal forts, establishing administrative posts, marching troops into interior regions, and planting national flags along rivers, triggering an aggressive, competitive military invasion across the continent.`
      },
      {
        theme_heading: 'The Maxim Gun & Quinine: Military Asymmetry',
        text: `<span class="para-ref">[4.3]</span> European conquest was made irresistible by modern industrial technology. Hiram Maxim’s 1884 machine gun fired six hundred rounds per minute, giving small European regiments terrifying firepower over African warriors. Meanwhile, regular doses of bitter bark fever medicine (quinine extracted from cinchona trees) protected soldiers against malaria. The brutal disparity was demonstrated at the 1898 Battle of Omdurman in Sudan, leaving over ten thousand dead at Omdurman Sudanese warriors against fewer than fifty British soldiers.`
      },
      {
        theme_heading: 'Rudyard Kipling & The Myth of "The White Man\'s Burden"',
        text: `<span class="para-ref">[4.4]</span> Imperial conquest was ideologically justified through racist theories of civilizing superiority. In 1899, imperial poet Rudyard Kipling published an influential poem in The Times titled <em>The White Man’s Burden</em>. Kipling depicted imperial conquest as a thankless, claiming selfless duty to uplift non-European populations, whom he described with the degrading racist slur half-devil and half-child, masking brutal economic exploitation behind a facade of Christian charity.`
      },
      {
        theme_heading: 'Resource Extraction & King Leopold’s Congo Atrocities',
        text: `<span class="para-ref">[4.5]</span> Beneath high-minded civilizing rhetoric lay ruthless resource extraction. European charter companies pillaged the continent, stealing rubber and palm oil, ivory, copper, and gold. The extreme horror was exposed in King Leopold II’s Congo Free State, where private rubber mercenaries enforced quotas through torture and burning villages, taking thousands of severed hands in Congo to prove bullets had not been wasted, while enriching European tycoons on the London and Brussels stock exchanges.`
      }
    ]
  },
  {
    id: 'lesson_5',
    title: 'The Imperial Verdict: Workshop of the World or Age of Exploitation?',
    enquiry_question: 'How do historians evaluate the legacy and consequences of the Second British Empire?',
    narrative_blocks: [
      {
        theme_heading: 'The 1851 Great Exhibition: Workshop of the World',
        text: `<span class="para-ref">[5.1]</span> In May 1851, Queen Victoria opened the **Great Exhibition** in London’s Hyde Park, housed in Joseph Paxton’s magnificent glass and iron Crystal Palace. Over six million ticket holders marveled at 100,000 industrial exhibits, celebrating Britain’s title as the "Workshop of the World." Colonial exhibits showcased raw resources from across the globe alongside the looted Koh-i-Noor diamond from the Sikh Empire, visually celebrating Britain as the center of global wealth and engineering power.`
      },
      {
        theme_heading: 'Colonial Infrastructure: Railways, Canals & Telegraphs',
        text: `<span class="para-ref">[5.2]</span> Imperial defenders argued that British rule brought modern technology and connectivity to colonized nations. Across India, British engineers laid more than twenty-five thousand rail miles of tracks by 1900, linking agricultural hinterlands directly to export ports. Colonial public works included digging river canals across millions of acres of farmland and stringing thousands of miles of electric telegraph wires to create a unified subcontinent infrastructure.`
      },
      {
        theme_heading: 'The Great Famines & Strict Laissez-Faire Dogma',
        text: `<span class="para-ref">[5.3]</span> However, this infrastructure was designed primarily for military mobilization and grain export rather than local welfare. During the catastrophic 1876–1878 famine, Viceroy Lytton market dogma refused to halt grain exports or provide free food, arguing interference would violate Adam Smith's economic laws. Starving peasants were forced into punitive hard labour relief camps, and over ten million starved to death across British India while grain departed for European markets.`
      },
      {
        theme_heading: 'Dadabhai Naoroji & The "Drain of Wealth" Theory',
        text: `<span class="para-ref">[5.4]</span> Indian nationalist leader Dadabhai Naoroji challenged imperial economics in his landmark 1901 London book on poverty (<em>Poverty and Un-British Rule in India</em>). Naoroji proved mathematically that British colonial rule extracted millions siphoned in tax money annually to pay for British administrative pensions and military adventures abroad. Naoroji became the first Indian Westminster MP when elected for Central Finsbury in 1892, using Parliament to demand democratic self-government for India.`
      },
      {
        theme_heading: 'Historiographical Debate: Optimists vs Pessimists',
        text: `<span class="para-ref">[5.5]</span> Today, historians remain sharply divided over the legacy of the British Empire. "Optimist" historians like Niall Ferguson emphasize the spread of global free trade and laws, parliamentary democracy, and international capital investment. In contrast, "Pessimist" and post-colonial historians like Shashi Tharoor emphasize imperial looting, crushing local industries, racial discrimination, and partition violence, leaving clashing moral judgments that continue to shape modern world politics.`
      }
    ]
  }
];

// Apply updates to data.lessons
data.lessons.forEach((lesson, idx) => {
  const newL = newLessonData[idx];
  const cfg = enquiryConfigs[idx];

  if (newL) {
    lesson.title = newL.title;
    lesson.enquiry_question = newL.enquiry_question;
    lesson.narrative_blocks = newL.narrative_blocks;
  }

  if (cfg) {
    lesson.workbook_stages = cfg.stages.map(st => ({
      step: st.step,
      paraRef: st.paraRef,
      date: st.date,
      questionHeading: st.questionHeading,
      bullets: [...st.bullets],
      focusClue: st.focusClue
    }));
  }
});

const outContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(dataFilePath, outContent, 'utf8');
console.log('Successfully updated units/second_british_empire/data.js with complete 5-enquiry narratives and workbook_stages!');

