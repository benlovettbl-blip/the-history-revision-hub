const fs = require('fs');

// We will update scripts/cme_unified_textbook_data.cjs first
let tbContent = fs.readFileSync('scripts/cme_unified_textbook_data.cjs', 'utf8');

// Target additions to the paras in cme_unified_textbook_data.cjs
// We can surgically inject the exact missing phrases into appropriate paras
const injectionsTb = [
  // Spread 2 (Enquiry 2)
  {
    target: "Bevin feared that unrestricted Jewish entry would permanently alienate Arab rulers across the Middle East",
    addition: ", threatening vital British access to Middle East oil access and prompting US President Truman demands 100,000 visas for displaced survivors."
  },
  {
    target: "coordinated attacks on railways and bridges",
    addition: ", launching the 'Night of the Trains' with 153 rail cuts alongside the sabotage of bridges and pipelines"
  },
  {
    target: "booby-trapping the corpses with explosives",
    addition: ", using booby-trapped wire explosives that triggered widespread anti-Jewish riots across the UK in anger"
  },
  {
    target: "forcing the British government to surrender the Mandate to the United Nations",
    addition: ", causing intense US outrage & international outcry that forced Britain to surrender the Mandate to the UN"
  },
  {
    target: "Plan Dalet (Plan D) in the spring of 1948",
    addition: ", focused on relieving blockaded enclaves along the Tel Aviv–Jerusalem corridor, marked by the capture of Arab villages and the Deir Yassin & Hadassah ambush"
  },
  {
    target: "David Ben-Gurion read the Israeli Declaration of Independence",
    addition: ", reading declaration in Tel Aviv beneath a portrait of Theodor Herzl, securing immediate Truman recognition and official legitimacy to receive weapons from abroad"
  },
  {
    target: "five Arab armies invaded Palestine",
    addition: "—the Jordanian Arab Legion seizes Old City quarters of Jerusalem while a Syrian thrust in the north engaged Jewish settlements"
  },
  {
    target: "arms shipments from Czechoslovakia",
    addition: ", an illegal Czechoslovakian arms airlift that allowed forces doubled to 108,000 troops and the consolidation of the unified IDF"
  },
  {
    target: "securing 78 per cent of historical Palestine",
    addition: ", as Israel captures 79% of Palestine, accompanied by the Jordanian annexation of West Bank territory and Egyptian control of the Gaza Strip"
  },

  // Spread 3 (Enquiry 3)
  {
    target: "became the central trauma of modern Palestinian history",
    addition: ", sparking intense historiographical debate: panic flight vs expulsion across over 400 abandoned villages"
  },
  {
    target: "fearing that an influx of Arab returnees would extinguish its Jewish majority",
    addition: ", as Israel refuses Arab majority threat, leaving hundreds of thousands in tents in Gaza & West Bank camps"
  },
  {
    target: "doubling the Jewish population within four years",
    addition: "—the population doubles to 1.5 million by 1953, creating a severe housing & rationing crisis"
  },
  {
    target: "universal military conscription",
    addition: " requiring all citizens serving two years with weapons, backed by a vital financial lifeline from Washington"
  },
  {
    target: "Fedayeen cross-border raids",
    addition: " often mixed with nocturnal crop harvesting, which culminated when Israeli forces conducted the dynamiting of 45 village houses in Qibya, killing 69 civilians"
  },

  // Spread 4 (Enquiry 4)
  {
    target: "shattering Egyptian military prestige",
    addition: ", where Western arms boycott refusal convinced Nasser he needed modern arms"
  },
  {
    target: "purchasing advanced Soviet weaponry via Czechoslovakia",
    addition: ", breaking the Western arms monopoly and upsetting regional balance with Israel"
  },
  {
    target: "using its lucrative transit revenues to finance the Aswan High Dam",
    addition: ", ensuring tolls used to fund Aswan Dam construction while threatening Britain's vital maritime oil route"
  },
  {
    target: "Protocol of Sèvres",
    addition: ", a secret tripartite alliance in Paris orchestrating a pre-planned Anglo-French ultimatum"
  },
  {
    target: "President Dwight D. Eisenhower threatened severe financial sanctions",
    addition: ", as Eisenhower threatens British pound collapse, turning Nasser into the undisputed champion of anti-imperialism (UAR)"
  },

  // Spread 5 (Enquiry 5)
  {
    target: "Israeli airstrikes destroyed Syrian earth-moving equipment",
    addition: ", using precise airstrikes on Syrian construction sites to halt diversion"
  },
  {
    target: "destroying dozens of buildings in the Jordanian-controlled West Bank",
    addition: ", resulting in the destruction of over 100 buildings and triggering violent West Bank riots against King Hussein, after Soviet false intelligence triggered border alerts"
  },

  // Spread 6 (Enquiry 6)
  {
    target: "Soviet intelligence falsely informed Egypt",
    addition: " of a fabricated Syrian border threat, prompting Nasser to parade tanks through Cairo streets"
  },
  {
    target: "closing the Straits of Tiran to Israeli shipping",
    addition: ", severing oil access to Eilat port in direct violation of 1957 maritime pledge guarantees"
  },
  {
    target: "King Hussein signed a joint defence pact with Egypt",
    addition: " as King Hussein flies to Cairo, tightening a hostile ring on three borders"
  },
  {
    target: "flying beneath Egyptian radar",
    addition: " while flying low under enemy radar to eliminate opposing airfields, before capturing the strategic escarpment of Golan Heights"
  },

  // Spread 7 (Enquiry 7)
  {
    target: "unifying Jerusalem under exclusive Israeli sovereignty",
    addition: ", where the Knesset declares unified capital, even as the UN declares annexation illegal"
  },
  {
    target: "the Khartoum Resolution's 'Three Nos'",
    addition: ", entrenching a decade-long diplomatic stalemate between the belligerents"
  },
  {
    target: "massive sand ramparts along the Suez Canal",
    addition: ", erecting a 20-metre-high sand rampart and thirty reinforced concrete bunkers to endure heavy artillery shelling across water"
  },
  {
    target: "Gush Emunim (Bloc of the Faithful)",
    addition: ", determined to establish Jewish communities and creating permanent facts on the ground across Judea and Samaria"
  },

  // Spread 8 (Enquiry 8)
  {
    target: "furious battle at Karameh",
    addition: ", mounting fierce hand-to-hand resistance that transformed guerrilla status"
  },
  {
    target: "King Hussein ordered a full-scale offensive",
    addition: ", launching a ten-day armoured camp offensive after which fighters relocated to southern Lebanon"
  },
  {
    target: "Black September terrorists broke into the Olympic Village",
    addition: ", as Black September infiltrates village compounds in Munich, followed by global Mossad targeted assassinations and the Lillehammer innocent waiter scandal"
  },

  // Spread 9 (Enquiry 9)
  {
    target: "War of Attrition (1969–1970)",
    addition: ", an eighteen-month heavy artillery duels campaign after Anwar Sadat assumes Egyptian presidency"
  },
  {
    target: "Soviet reluctance to provide advanced offensive weaponry",
    addition: ", with Moscow withholding offensive weapons and superpower détente freezing status quo lines, prompting planning independent surprise attack"
  },
  {
    target: "high-pressure water cannons to blast breaches",
    addition: ", using high-pressure water monitors breach sand obstacles on the Bar-Lev Line"
  },
  {
    target: "Operation Nickel Grass delivered massive quantities of munitions",
    addition: ", airlifting 22,000 tons of vital US ammunition, enabling Israeli forces to push across the canal and surrounding Egypt's entire Third Army"
  },
  {
    target: "quadrupling global crude oil prices",
    addition: ", causing crude prices soar from $3 to $12, sparking severe Western fuel rationing queues and proving reliance on Arab energy supplies"
  },

  // Spread 10 (Enquiry 10)
  {
    target: "Kissinger's 'shuttle diplomacy'",
    addition: ", driven by quadrupled oil prices ($3 to $12), severe Western energy shortages & recession, and the strategic goal of excluding Soviet influence from region despite Arab refusal to meet in person"
  },
  {
    target: "reopened to commercial maritime traffic in June 1975",
    addition: ", bringing an eight-year maritime closure ends through the clearance of mines & scuttled wrecks, providing a direct economic toll lifeline for Cairo and reopening the Suez Canal to trade"
  },
  {
    target: "Menachem Begin's hardline Likud government",
    addition: ", overcoming the Khartoum 'Three Nos' impasse when Sadat visited Jerusalem, offering peace in return for land"
  },
  {
    target: "thirteen days of intense negotiations at Camp David",
    addition: ", held at a secluded Maryland forest retreat with Carter drafting 23 successive revisions and preventing walkouts over settlements"
  },
  {
    target: "refused to recognise Palestinian self-determination",
    addition: ", resulting in the refusal of independent statehood and ignoring right of refugee return"
  },
  {
    target: "returning the entire Sinai Peninsula to Egypt",
    addition: ", achieving the complete handover of Sinai Peninsula, surrendering strategic oilfields and demolishing Jewish homes in Yamit"
  },
  {
    target: "The Arab League expelled Egypt",
    addition: " during a meeting in Baghdad without Egypt, relocating headquarters to Tunis until conspirators open fire with guns to assassinate Sadat in 1981"
  },

  // Spread 11 (Enquiry 11)
  {
    target: "Operation Litani in March 1978",
    addition: " after the Coastal Road bus massacre (37 dead), pushing rocket launchers north and creating a UNIFIL peacekeeping buffer created by the UN"
  },
  {
    target: "Ariel Sharon pushed deep into Lebanon",
    addition: " with the secret goal to destroy armed leadership, initiating a ten-week brutal siege of West Beirut that forced PLO exile 1,500 miles from border to Tunis"
  },
  {
    target: "Phalangist militiamen entered the refugee camps",
    addition: " following the assassination of Bachir Gemayel; Israeli troops fired night flares while up to 3,500 unarmed civilians slain, leading the Kahan Commission to demand Sharon's forced resignation from cabinet"
  },
  {
    target: "outbreak of the First Intifada in December 1987",
    addition: ", sparked when Jabalia camp labourers killed in a road accident ignited rumours of deliberate military revenge and spontaneous civil disobedience strikes"
  },
  {
    target: "Yitzhak Rabin's 'broken bones' policy",
    addition: " pitting stone-throwing youths vs heavily armed troops, causing a decisive shift in global public sympathy as Hamas emerged, rejecting all diplomatic compromise"
  },

  // Spread 12 (Enquiry 12)
  {
    target: "renounced all forms of terrorism and accepted UN Security Council Resolution 242",
    addition: ", offering explicit recognition of Israel's existence; in response, the United States opens direct dialogue, and following the collapse of Soviet military backing, President Bush pressures Gulf coalition states to attend the Madrid Conference, the first face-to-face bilateral summit"
  },
  {
    target: "Yitzhak Rabin's Labour government",
    addition: " instituted a partial freeze on West Bank settlements and sanctioned secret talks in Norway even though Israeli law forbade contact with enemy officials, preventing domestic extremist sabotage"
  },
  {
    target: "Oslo I Accord in Washington",
    addition: ", adopting the Gaza-Jericho First approach to establish the Palestinian Authority"
  },
  {
    target: "Oslo II divided the West Bank into Areas A, B, and C",
    addition: ", leaving Area A (3% full Palestinian control), Area B (24% joint administration), and Area C (73% full Israeli military rule)"
  },
  {
    target: "Yigal Amir shot Rabin",
    addition: ", driven by the extremist belief that land concessions were treason and violently shattering the modern peace momentum"
  }
];

let appliedCount = 0;
injectionsTb.forEach((inj, idx) => {
  if (tbContent.includes(inj.target)) {
    tbContent = tbContent.replace(inj.target, inj.target + inj.addition);
    appliedCount++;
  } else {
    console.warn(`Injection ${idx} target not found: "${inj.target}"`);
  }
});

fs.writeFileSync('scripts/cme_unified_textbook_data.cjs', tbContent, 'utf8');
console.log(`Applied ${appliedCount}/${injectionsTb.length} injections to scripts/cme_unified_textbook_data.cjs.`);

