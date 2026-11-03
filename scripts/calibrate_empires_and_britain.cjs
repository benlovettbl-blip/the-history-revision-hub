const fs = require('fs');
const path = require('path');

function calibrateUnit(unitId, updateFn) {
  const p1 = path.resolve(__dirname, `../units/${unitId}/data.js`);
  const p2 = path.resolve(__dirname, `../public/units/${unitId}/data.js`);

  [p1, p2].forEach(fp => {
    if (!fs.existsSync(fp)) return;
    const data = require(fp).default;
    updateFn(data);
    fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
    console.log(`Calibrated ${unitId} in ${fp}`);
  });
}

// 1. second_british_empire (5 lessons)
calibrateUnit('second_british_empire', (data) => {
  // L1: Maritime supremacy & industrial dockyards (12m)
  const l1Model = "A primary reason naval supremacy was vital for the British Empire was the protection of vital global trade routes. The Royal Navy enforced the 'Pax Britannica', guarding merchant ships carrying raw materials like cotton, tea, and sugar back to British factories. Royal dockyards like Portsmouth built and repaired steam-powered ironclads, ensuring Britain maintained a two-power standard.<br><br>Furthermore, industrial dockyards enabled rapid military force projection. Coaling stations at strategic choke points like Gibraltar, Malta, and Singapore allowed steam warships to patrol worldwide, deterring rival empires and securing Britain's global trade monopoly.";
  if (data.lessons[0].tasks?.[0]) data.lessons[0].tasks[0].model_answer = l1Model;
  if (data.lessons[0].exam_practice?.questions?.[0]) data.lessons[0].exam_practice.questions[0].model = l1Model;

  // L2: Indian textile de-industrialisation (12m)
  const l2Model = "A primary reason for the rapid de-industrialisation of Indian textiles was the flood of cheap, machine-made British cloth. Following the Industrial Revolution, mills in Lancashire produced vast quantities of cheap cotton cloth using steam-powered looms, undercutting traditional Indian handloom weavers.<br><br>Furthermore, British colonial tariffs systematically dismantled local manufacturing. The East India Company and British Parliament placed heavy duties on Indian woven silk and calico entering Britain, while forcing India to import British manufactured goods duty-free. Consequently, millions of skilled Indian weavers lost their livelihoods, turning India into an exporter of raw cotton.";
  if (data.lessons[1].tasks?.[0]) data.lessons[1].tasks[0].model_answer = l2Model;
  if (data.lessons[1].exam_practice?.questions?.[0]) data.lessons[1].exam_practice.questions[0].model = l2Model;

  // L3: Indian Rebellion 1857 (12m)
  const l3Model = "A primary cause of the 1857 Indian Rebellion was deep religious and cultural grievance among Indian sepoys. The immediate spark was the introduction of the new Enfield rifle cartridge, which was rumoured to be greased with cow and pig fat, violating both Hindu and Muslim religious laws. Sepoys feared the British East India Company was plotting to forcibly convert them to Christianity.<br><br>Furthermore, aggressive British annexation policies caused intense political resentment. Governor-General Dalhousie’s 'Doctrine of Lapse' allowed the Company to seize princely states like Awadh (Oudh) when rulers died without a natural heir, disinheriting traditional Indian royalty and provoking wide rebellion.";
  if (data.lessons[2].tasks?.[0]) data.lessons[2].tasks[0].model_answer = l3Model;
  if (data.lessons[2].exam_practice?.questions?.[0]) data.lessons[2].exam_practice.questions[0].model = l3Model;

  // L4: Scramble for Africa (12m)
  const l4Model = "A primary reason European powers were able to partition Africa was overwhelming industrial and military superiority. The invention of the rapid-firing Maxim machine gun (1884) gave small European armies lethal firepower over African warriors equipped with traditional spears. Steamships allowed navigation of interior rivers, while the medical discovery of quinine protected European soldiers from deadly malaria.<br><br>Furthermore, diplomatic agreements at the 1884–85 Berlin Conference formalised partition. European powers agreed to the principle of 'effective occupation', enabling them to carve up the continent without going to war with each other, conquering 90% of Africa by 1914.";
  if (data.lessons[3].tasks?.[0]) data.lessons[3].tasks[0].model_answer = l4Model;
  if (data.lessons[3].exam_practice?.questions?.[0]) data.lessons[3].exam_practice.questions[0].model = l4Model;

  // L5: Impact of the British Empire debate (12m)
  const l5Model = "A primary reason the British Empire remains fiercely debated is the stark contrast between infrastructural modernization and brutal colonial exploitation. Proponents highlight the construction of railways, legal systems, and modern education, arguing it laid the foundations for global commerce.<br><br>Conversely, critics emphasize the devastating economic destruction, racism, and violent repression inflicted on colonized peoples. Policies created man-made famines, such as the 1943 Bengal famine, and displaced indigenous cultures. Therefore, because the Empire brought technological advancement to some while causing immense human suffering and economic drain to millions, its legacy remains deeply contested today.";
  if (data.lessons[4].tasks?.[0]) data.lessons[4].tasks[0].model_answer = l5Model;
  if (data.lessons[4].exam_practice?.questions?.[0]) data.lessons[4].exam_practice.questions[0].model = l5Model;
});

// 2. first_british_empire (5 lessons)
calibrateUnit('first_british_empire', (data) => {
  // L1: Colonisation of North America (12m)
  if (data.lessons[0].tasks?.[0]) {
    data.lessons[0].tasks[0].model_answer = "A primary reason English settlers colonised North America was economic ambition and trade profits. Joint-stock companies, like the Virginia Company, financed voyages to discover gold and valuable commodities. When John Rolfe successfully cultivated tobacco in Jamestown (1612), it became a lucrative cash crop exported back to London, making colonial expansion highly profitable.<br><br>Furthermore, religious freedom drove thousands to emigrate. Puritans and Pilgrims, persecuted under the Stuart monarchs, sailed on the Mayflower (1620) to establish New England colonies where they could worship freely according to their strict Protestant beliefs.";
  }

  // L2: Transatlantic Slave Trade consequence (4m)
  if (data.lessons[1].tasks?.[1]) {
    data.lessons[1].tasks[1].model_answer = "One consequence of the Transatlantic Slave Trade was immense wealth for British port cities like Bristol and Liverpool. Specifically, merchants reinvested vast profits from sugar, tobacco, and enslaved human labor into British banks, docks, and factories, helping to fund the early Industrial Revolution.";
  }

  // L4: Boston Tea Party to 1776 narrative (8m)
  if (data.lessons[3].tasks?.[0]) {
    data.lessons[3].tasks[0].model_answer = "Initially, colonial anger erupted in December 1773 when the Sons of Liberty dumped 342 chests of British tea into Boston harbour to protest the Tea Act ('No taxation without representation').<br><br>In response, Britain passed the harsh 'Intolerable Acts' of 1774, closing Boston port and imposing military rule. The Thirteen Colonies formed the First Continental Congress to coordinate resistance, leading to the first military clashes at Lexington and Concord in April 1775.<br><br>Finally, seeing compromise was impossible, the Second Continental Congress adopted Thomas Jefferson’s Declaration of Independence on 4 July 1776, severing all political ties with the British Crown.";
  }

  // L5: Why Britain lost America (12m)
  if (data.lessons[4].tasks?.[0]) {
    data.lessons[4].tasks[0].model_answer = "A primary reason Britain lost the American War of Independence was the immense logistical challenge of fighting a war across 3,000 miles of the Atlantic Ocean. Supplying food, weapons, and troop reinforcements took months by sailing ship, leaving British generals isolated in a vast, hostile country with no single capital to capture.<br><br>Furthermore, foreign military intervention by France and Spain was decisive. Following the American victory at Saratoga (1777), France joined the war, providing the naval fleet that trapped Lord Cornwallis’s army at Yorktown in 1781, forcing Britain to accept American independence.";
  }
});

// 3. post_war_britain (5 lessons)
calibrateUnit('post_war_britain', (data) => {
  // L1: NHS creation 1948 (12m)
  if (data.lessons[0].tasks?.[0]) {
    data.lessons[0].tasks[0].model_answer = "A primary reason for the creation of the NHS in 1948 was the shared experience of the Second World War. During the Blitz, the wartime government set up the Emergency Medical Service, proving that the state could successfully organize national healthcare. The 1942 Beveridge Report argued that a welfare state should conquer the 'Five Giants', including Disease, building overwhelming public support for free medical care.<br><br>Furthermore, the 1945 landslide victory of Clement Attlee's Labour Party provided the political mandate. Minister of Health Aneurin Bevan overcame fierce opposition from the British Medical Association, establishing a universal NHS free at the point of delivery on 5 July 1948.";
  }

  // L2: Windrush consequence (4m)
  if (data.lessons[1].tasks?.[1]) {
    data.lessons[1].tasks[1].model_answer = "One consequence of the arrival of the Empire Windrush in 1948 was the vital contribution of Caribbean workers to rebuilding post-war Britain. Specifically, hundreds of Commonwealth citizens took up essential employment as nurses in the new NHS and drivers on London transport, laying the foundation for a vibrant, diverse multicultural society.";
  }

  // L4: Suez Crisis narrative (8m)
  if (data.lessons[3].tasks?.[0]) {
    data.lessons[3].tasks[0].model_answer = "Initially, Egyptian President Nasser nationalised the Suez Canal in July 1956 to fund the Aswan Dam. Britain, France, and Israel met secretly at Sèvres, concocting a plan where Israel would invade Sinai, allowing Anglo-French troops to intervene to 'protect' the canal.<br><br>Following Israel's attack in October 1956, British and French forces landed at Port Said. However, US President Eisenhower furiously opposed the invasion, threatening to bankrupt Britain by collapsing the pound.<br><br>Finally, facing financial catastrophe and UN condemnation, Prime Minister Anthony Eden was forced to withdraw British troops in humiliation, demonstrating the end of Britain's status as a superpower.";
  }

  // L5: 1960s social revolution (12m)
  if (data.lessons[4].tasks?.[0]) {
    data.lessons[4].tasks[0].model_answer = "On the one hand, the 1960s was a decade of profound social and legal transformation. Harold Wilson's Labour government passed landmark liberalising legislation, including the legalisation of abortion (1967), the partial decriminalisation of male homosexuality (1967), and the abolition of capital punishment (1969). Concurrently, youth culture flourished through rock music, fashion, and greater personal freedom.<br><br>On the other hand, traditional conservatism remained deeply rooted for most ordinary citizens. Deep inequalities persisted, with women facing unequal pay until the 1970 Equal Pay Act, and racial discrimination remaining widespread despite early Race Relations Acts. Therefore, while legal reforms dismantled Victorian moral codes, genuine equality was an ongoing struggle.";
  }
});

