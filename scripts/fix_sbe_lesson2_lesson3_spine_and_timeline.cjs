const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

function applySpineAndTimelineFix(data) {
  // Lesson 2: The De-industrialisation of India: The Company & Handloom Crisis
  const l2 = data.lessons[1];
  if (l2) {
    l2.causal_domino_spine = {
      event: "The De-industrialisation of the Indian Textile Industry (1700–1850)",
      stages: [
        {
          step: 1,
          date: "1650–1700",
          title: "Mughal India: The World’s Textile Workshop",
          actor: "Mughal Artisans & Bengali Pit-Loom Weavers",
          tag: "🧵 ARTISANAL SUPREMACY",
          trigger: "Millions of skilled Indian weavers produced nearly a quarter of global textiles, trading delicate Dhaka muslins and calicoes for European silver bullion.",
          connective: "Established Indian finished cottons as the world's most desired commodity, forcing European nations into massive trade deficits.",
          question: "How did Mughal India become the undisputed manufacturing workshop of the early modern world?",
          para_ref: "[2.1]"
        },
        {
          step: 2,
          date: "1700–1721",
          title: "British Protectionism & The Calico Acts",
          actor: "The British Parliament & Spitalfields Weavers",
          tag: "🛡️ TARIFF WALLS",
          trigger: "English silk and wool guilds rioted against cheap, washable Indian cotton imports, prompting Parliament to ban the sale and wearing of Indian calicoes.",
          connective: "Sheltered British domestic manufacturers behind state protection, granting English inventors the time to mechanise cotton spinning.",
          question: "Why did the British Parliament pass protectionist Calico Acts to outlaw the wearing of Indian cotton?",
          para_ref: "[2.2]"
        },
        {
          step: 3,
          date: "August 1765",
          title: "The Diwani of Bengal: Fiscal Tribute Inverts Trade",
          actor: "Robert Clive & Mughal Emperor Shah Alam II",
          tag: "💰 FISCAL EXTRACTION",
          trigger: "Following the Battle of Buxar, the East India Company extracted the Diwani (tax collection rights) over twenty million subjects across Bengal.",
          connective: "Inverted global trade flows: the Company used extracted Bengali taxes to buy Indian textiles for London markets, initiating the Drain of Wealth.",
          question: "How did the 1765 Diwani eliminate Britain's need to export precious silver bullion to purchase Indian goods?",
          para_ref: "[2.3]"
        },
        {
          step: 4,
          date: "1800–1830",
          title: "Lancashire Steam Mechanisation & One-Way Free Trade",
          actor: "Manchester Cotton Mill Owners & Colonial Administrators",
          tag: "🏭 STEAM FLOOD",
          trigger: "Lancashire steam mills mass-produced cheap cotton cloth, which colonial authorities forced into India under nominal 2% duties while taxing Indian cloth up to 80% in Britain.",
          connective: "Flooded Indian village bazaars with machine-made cloth, pricing traditional handloom artisans out of their own domestic markets.",
          question: "How did Lancashire steam power combined with unequal tariffs dismantle Indian domestic markets?",
          para_ref: "[2.4]"
        },
        {
          step: 5,
          date: "1834–1850",
          title: "The Handloom Collapse & Bentinck’s Bleaching Plains",
          actor: "Governor-General Lord William Bentinck & Destitute Weavers",
          tag: "💀 DE-INDUSTRIALISATION",
          trigger: "Ancient textile metropolises like Dhaka and Murshidabad collapsed into ghost towns as millions of weavers were driven into rural poverty and famine.",
          connective: "Forcibly transformed India from the world's premier finished cloth exporter into an impoverished supplier of raw cotton to feed British factories.",
          question: "What did Governor-General Bentinck mean when he declared that \"the bones of the cotton-weavers are bleaching the plains of India\"?",
          para_ref: "[2.5]"
        }
      ]
    };

    l2.timeline_anchor = [
      {
        date: "1700–1721",
        title: "The British Calico Acts",
        desc: "Parliament bans the import and wearing of dyed Indian cotton to protect domestic English woollen and silk manufacturers."
      },
      {
        date: "August 1765",
        title: "The 1765 Bengal Diwani",
        desc: "Robert Clive secures sovereign tax-collection rights over Bengal, using land taxes to purchase Indian goods without exporting British bullion."
      },
      {
        date: "1779–1815",
        title: "The Lancashire Steam Revolution",
        desc: "Crompton's mule and steam power allow Manchester mills to mass-produce cheap cotton yarn, undercutting Indian hand-spinners."
      },
      {
        date: "1814–1835",
        title: "The One-Way Tariff Regime",
        desc: "British machine cloth exports to India surge fifty-fold under 2% duties, while Indian imports to Britain face crushing 80% tariffs."
      },
      {
        date: "1834",
        title: "Bentinck's Lament & Artisan Collapse",
        desc: "Governor-General Bentinck reports the catastrophic destruction of India's handloom weavers as millions are forced into subsistence agriculture."
      }
    ];
  }

  // Lesson 3: The 1857 Indian Rebellion: Sepoy Grievance, Rani Lakshmibai & The Raj
  const l3 = data.lessons[2];
  if (l3) {
    l3.causal_domino_spine = {
      event: "The 1857 Indian Rebellion & The Fall of Company Rule",
      stages: [
        {
          step: 1,
          date: "1848–1856",
          title: "The Doctrine of Lapse & Territorial Annexations",
          actor: "Governor-General Lord Dalhousie & The East India Company",
          tag: "📜 IMPERIAL ANNEXATION",
          trigger: "Lord Dalhousie aggressively annexed Indian princely states like Satara, Jhansi, and Awadh, seizing territories lacking biological male heirs.",
          connective: "Inflamed widespread resentment among high-caste Hindu and Muslim sepoys who viewed corporate expansion as a direct attack on their sovereignty and status.",
          question: "Why did Lord Dalhousie's Doctrine of Lapse and the annexation of Awadh provoke such outrage among Indian soldiers?",
          para_ref: "[3.1]"
        },
        {
          step: 2,
          date: "April–May 1857",
          title: "The Greased Enfield Cartridges & Religious Alarm",
          actor: "Sepoy Mangal Pandey & The 3rd Light Cavalry at Meerut",
          tag: "💥 RELIGIOUS ALARM",
          trigger: "The introduction of rifle cartridges greased with cow tallow and pig lard threatened sepoys with caste pollution and forced conversion.",
          connective: "Eighty-five troopers refused to handle the ammunition at Meerut and were sentenced to ten years' hard labour in chains before their comrades.",
          question: "How did the greased Enfield rifle cartridges ignite religious panic among Hindu and Muslim sepoys?",
          para_ref: "[3.2]"
        },
        {
          step: 3,
          date: "May–July 1857",
          title: "The Meerut Outbreak & The March on Delhi",
          actor: "Insurgent Sepoys & Emperor Bahadur Shah Zafar",
          tag: "⚔️ ARMED INSURRECTION",
          trigger: "Sepoys mutinied at Meerut, liberated their comrades, marched to Delhi, and proclaimed Emperor Bahadur Shah Zafar sovereign of India.",
          connective: "Transformed a military mutiny into a widespread civil war across the northern plains, culminating in the siege of Cawnpore.",
          question: "Why did the march to Delhi and proclamation of Bahadur Shah Zafar unite northern India in revolt?",
          para_ref: "[3.3]"
        },
        {
          step: 4,
          date: "1857–1858",
          title: "Rani Lakshmibai & The Armed Defence of Jhansi",
          actor: "Rani Lakshmibai & Tantia Tope",
          tag: "🛡️ PRINCELY RESISTANCE",
          trigger: "Refusing to surrender her annexed state, Rani Lakshmibai fortified Jhansi, directed artillery defense, and escaped on horseback to fight at Gwalior.",
          connective: "Provided the uprising with an inspiring military leader praised even by British generals for unmatched bravery.",
          question: "How did Rani Lakshmibai of Jhansi become the foremost symbol of anti-colonial resistance during the rebellion?",
          para_ref: "[3.4]"
        },
        {
          step: 5,
          date: "August 1858",
          title: "The Government of India Act: Birth of the British Raj",
          actor: "The British Parliament & Queen Victoria",
          tag: "👑 THE BRITISH RAJ",
          trigger: "Shocked by the near-collapse of colonial authority, Parliament dissolved the East India Company and transferred rule directly to the Crown.",
          connective: "Inaugurated the British Raj, replacing corporate mercenary rule with direct imperial governance and racial segregation.",
          question: "Why did the 1857 rebellion compel Parliament to abolish the East India Company and establish direct Crown rule?",
          para_ref: "[3.5]"
        }
      ]
    };

    l3.timeline_anchor = [
      {
        date: "1848–1856",
        title: "Doctrine of Lapse & Awadh Annexation",
        desc: "Lord Dalhousie annexes Satara, Nagpur, Jhansi, and Awadh, alienating Indian rulers and sepoy soldiers."
      },
      {
        date: "March–May 1857",
        title: "The Enfield Cartridge Crisis & Meerut Mutiny",
        desc: "Sepoys refuse greased cartridges; 85 troopers shackled at Meerut, triggering armed revolt and the march to Delhi."
      },
      {
        date: "June–July 1857",
        title: "The Siege of Cawnpore & Bibighar",
        desc: "Nana Sahib leads the siege of Cawnpore; massacres at the river wharves and Bibighar provoke ruthless British reprisals."
      },
      {
        date: "June 1858",
        title: "The Fall of Jhansi & Death of Lakshmibai",
        desc: "Rani Lakshmibai leads the heroic defense of Jhansi before falling in battle at Kotah-ki-Serai near Gwalior."
      },
      {
        date: "August 1858",
        title: "The Government of India Act & The Raj",
        desc: "Parliament dissolves the East India Company; Queen Victoria assumes direct sovereignty over the Indian subcontinent."
      }
    ];
  }

  return true;
}

// 1. Update data/second_british_empire.json and public/data/second_british_empire.json
['data/second_british_empire.json', 'public/data/second_british_empire.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (applySpineAndTimelineFix(json)) {
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
    if (json.second_british_empire && applySpineAndTimelineFix(json.second_british_empire)) {
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

console.log('Second British Empire Lesson 2 and Lesson 3 spine and timeline alignment complete!');

