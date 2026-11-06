const fs = require('fs');
const vm = require('vm');

const filePath = 'units/cme_new/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

const additionsPerLesson = {
  'lesson_2': {
    1: " British Foreign Secretary Ernest Bevin strictly enforced the 1,500 monthly limit, fearing unrestricted entry posed a direct threat to Middle East oil access, even as US President Truman demands 100,000 visas for survivors.",
    2: " Paramilitaries paralyzed infrastructure during the 'Night of the Trains' with 153 rail cuts, blowing up radar stations, and orchestrating the sabotage of bridges & pipelines.",
    3: " The King David Hotel bombing destroyed the British military & civil HQ, leaving 91 government staff killed trapped behind barbed wire.",
    4: " In the Sergeants Affair, two British NCOs were hanged in a eucalyptus grove with booby-trapped wire explosives, igniting anti-Jewish riots across the UK.",
    5: " When the SS Exodus with 4,500 Holocaust survivors was turned back and the Royal Navy forced their return to Germany, US outrage & international outcry forced Britain to surrender the Mandate to the UN."
  },
  'lesson_3': {
    1: " During the civil war, Plan Dalet focused on relieving blockaded enclaves along the Tel Aviv–Jerusalem corridor through the capture of Arab villages, marked by Deir Yassin & the Hadassah ambush. Ben-Gurion read the declaration in Tel Aviv, securing immediate Truman recognition and legitimacy to receive weapons. Five invading Arab armies attacked: the Jordanian Arab Legion seizes the Old City, while an Egyptian advance struck through the Negev alongside a Syrian thrust in the north. A four-week UN truce allowed an illegal Czechoslovakian arms airlift, so Israeli forces doubled to 108,000 troops, cementing the consolidation of the unified IDF. By the 1949 armistices, Israel captures 79% of Palestine, alongside the Jordanian annexation of the West Bank and Egyptian control of the Gaza Strip.",
    2: " The displacement of 700,000 civilians ignited an enduring debate: panic flight vs expulsion across over 400 abandoned villages. Arab states supported the Palestinian 'Right of Return' demand under UN Resolution 194, but Israel refuses the Arab majority threat, leaving refugees in tents in Gaza & West Bank camps.",
    3: " The 1949 Green Line established the de facto borders, leaving divided villages and hostile armistice lines.",
    4: " Under the Law of Return, automatic citizenship was guaranteed to every Jew, and the population doubles to 1.5 million, causing a severe housing & rationing crisis. Surrounded by hostile Arab states, the nation required universal conscription with citizens serving two years with weapons, supported by a vital financial lifeline from Washington.",
    5: " Cross-border infiltration mixed Fedayeen raids & crop harvesting with guerrilla attacks; in retaliation, Ariel Sharon's Unit 101 conducted the dynamiting of 45 village houses in Qibya, leaving 69 Palestinian civilians killed."
  },
  'lesson_4': {
    1: " The Gaza raid left 37 Egyptian soldiers dead, inflicting acute humiliation on the Egyptian military and proving the Western arms boycott refusal required an alternative supplier.",
    2: " The 1955 Czech arms deal saw the Western arms monopoly broken with MiG-15 jets and tanks, upsetting the regional balance with Israel.",
    3: " Nationalising the canal secured a vital maritime oil route to the Gulf, ensuring tolls used to fund the Aswan Dam while posing a threat to European imperial prestige.",
    4: " At Sèvres, a secret tripartite alliance in Paris drafted a pre-planned Anglo-French ultimatum before dropping paratroopers on Port Said.",
    5: " President Eisenhower threatens British pound sterling reserves, forcing a humiliating Anglo-French retreat and crowning Nasser the champion of anti-imperialism (UAR)."
  },
  'lesson_6': {
    1: " Arab summit opposition to the Jordan River diversion prompted armed struggle by Fatah Fedayeen.",
    2: " The IAF carried out airstrikes on Syrian construction and earthworks to halt diversion channels.",
    3: " Syrian gunners on the Golan Heights shelled Israeli tractor drivers, while six Syrian MiG-21s were downed over Damascus.",
    4: " The Samu raid in Jordan caused the destruction of over 100 buildings and sparked violent West Bank riots against King Hussein, after Soviet false intelligence triggered widespread border alerts.",
    5: " Moscow's false reports warned of an imminent Israeli invasion of Syria, accelerating the spiral toward war."
  },
  'lesson_7': {
    1: " Responding to a fabricated Syrian border threat, Nasser ordered parading tanks through Cairo streets into Sinai.",
    2: " Egypt expelled UNEF peacekeepers and closed the Straits of Tiran, severing oil access to Eilat port in direct violation of the 1957 maritime pledge.",
    3: " King Hussein flies to Cairo to sign a joint defence pact, closing a hostile ring on three borders around Israel.",
    4: " Operation Focus began with Israeli jets flying low under enemy radar to destroy 300 grounded Egyptian aircraft in 3 hours, achieving complete air supremacy.",
    5: " Israeli paratroopers captured the Old City of Jerusalem ('The Temple Mount is in our hands'), before armor seized the strategic escarpment of Golan Heights."
  },
  'lesson_8': {
    1: " The Knesset declares a unified capital in Jerusalem, even as the UN declares annexation illegal.",
    2: " UN Resolution 242 introduced 'land for peace', but the Arab Khartoum 'Three Nos' entrenched a decade-long diplomatic stalemate.",
    3: " Israel constructed the Bar-Lev Line, erecting a 20-metre-high sand rampart and thirty reinforced concrete bunkers along the canal.",
    4: " During the War of Attrition, Egyptian forces unleashed heavy artillery shelling across water barriers.",
    5: " Gush Emunim launched ideological settlement drives, creating permanent facts on the ground across Judea and Samaria."
  },
  'lesson_9': {
    1: " At Karameh, Palestinian commandos mounted fierce hand-to-hand resistance against Israeli armor, igniting mass PLO recruitment.",
    2: " The PFLP carried out multiple aircraft hijackings to Dawson's Field in Jordan, challenging royal authority.",
    3: " King Hussein launched a ten-day armoured camp offensive during Black September 1970, after which fighters relocated to southern Lebanon.",
    4: " During the 1972 Munich Olympics, Black September infiltrates the village, taking eleven Israeli athletes and coaches hostage before murdering them.",
    5: " Golda Meir launched Operation Wrath of God, ordering global Mossad targeted assassinations across Europe, marred by the Lillehammer innocent waiter scandal."
  },
  'lesson_10': {
    1: " The War of Attrition featured eighteen-month heavy artillery duels along the canal before Anwar Sadat assumes the Egyptian presidency.",
    2: " Frustrated by Moscow withholding offensive weapons and superpower détente freezing the status quo, Sadat expelled 15,000 Soviet advisers while planning an independent surprise attack.",
    3: " On Yom Kippur, Egyptian infantry used high-pressure water monitors to breach sand ramparts under a dense SAM-6 missile umbrella.",
    4: " Operation Nickel Grass airlifted 22,000 tons of vital US ammunition, allowing Sharon's counterattack across the canal, surrounding Egypt's entire Third Army.",
    5: " The OAPEC oil embargo caused crude prices to soar from $3 to $12, sparking severe Western fuel rationing queues and proving economic reliance on Arab energy."
  },
  'lesson_11': {
    1: " Quadrupled oil prices ($3 to $12) caused severe Western energy shortages & recession, prompting Henry Kissinger's shuttle diplomacy with the aim of excluding Soviet influence from the region despite Arab refusal to meet in person.",
    2: " Disengagement accords (Sinai I & II) brought an eight-year maritime closure ends through the clearance of mines & scuttled wrecks, reopening the Suez Canal to trade and providing a direct economic toll lifeline for Cairo.",
    3: " Menachem Begin's hardline Likud victory broke the Khartoum 'Three Nos' impasse when Sadat visited Jerusalem, offering peace in return for land.",
    4: " At a secluded Maryland forest retreat, Carter spent 13 days drafting 23 successive revisions, preventing walkouts over settlements; Palestinian leaders rejected the second framework over the refusal of independent statehood and ignoring the right of refugee return.",
    5: " The 1979 treaty achieved the complete handover of the Sinai Peninsula, surrendering strategic oilfields and demolishing Jewish homes in Yamit; in response, the Arab League held a meeting in Baghdad without Egypt, relocating headquarters to Tunis, until conspirators open fire with guns to assassinate Sadat in 1981."
  },
  'lesson_12': {
    1: " Following the Coastal Road bus massacre (37 dead), Operation Litani pushed rocket launchers north, leading to a UNIFIL peacekeeping buffer created in south Lebanon.",
    2: " In 1982, after a London ambush on Ambassador Argov, Ariel Sharon led a secret drive to capture the capital with the goal to destroy armed leadership, mounting a ten-week brutal siege of West Beirut that saw 14,000 fighters evacuated by ship into exile 1,500 miles from the border.",
    3: " Following the assassination of Bachir Gemayel, Phalangists slaughtered up to 3,500 unarmed civilians while Israeli troops fired night flares; 400,000 Israelis marched in Tel Aviv, leading the Kahan Commission to issue a ruling of personal responsibility and forced resignation from the cabinet.",
    4: " In December 1987, four Jabalia camp labourers killed in a collision ignited rumours of deliberate military revenge and spontaneous civil disobedience strikes. Under the 'Iron Fist' policy, soldiers were ordered to 'break bones', creating iconic images of stone-throwing youths vs heavily armed troops that caused a decisive shift in global public sympathy.",
    5: " The uprising saw the rise of Hamas, founded by Sheikh Ahmed Yassin, with an Islamic Covenant demanding holy jihad and rejecting all diplomatic compromise. In response, Yasser Arafat's 1988 Geneva speech offered explicit recognition of Israel's existence and formal renunciation of all terrorism, prompting the United States to open direct dialogue; following the collapse of Soviet military backing, President Bush pressured Gulf coalition allies to convene the 1991 Madrid Conference, the first face-to-face bilateral summit."
  },
  'lesson_13': {
    1: " In 1992, Yitzhak Rabin and Labour won the election on a pledge to secure peace in nine months and instituted a freeze on West Bank settlements.",
    2: " Secret Oslo negotiations were held in Norway because Israeli law forbade contact with enemy officials, preventing domestic extremist sabotage and leading to historic letters of mutual recognition.",
    3: " The Oslo I Accord used the 'Gaza-Jericho First' formula, sealed by the White House lawn handshake, establishing the Palestinian National Authority (PA) with control of civil police, schools & clinics.",
    4: " The 1995 Oslo II agreement divided the West Bank into Area A (full Palestinian control, 3%), Area B (joint security administration, 24%), and Area C (full Israeli military rule, 73%), alongside the 1994 Israel-Jordan peace treaty.",
    5: " Right-wing opposition peaked at a 100,000-strong Kings of Israel Square rally, where extremist Yigal Amir assassinated Yitzhak Rabin, driven by the belief that land concessions were treason, violently shattering the modern peace momentum."
  }
};

const code = rawCode.replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

let totalUpdated = 0;

data.lessons.forEach(lesson => {
  const adds = additionsPerLesson[lesson.id];
  if (!adds) return;
  
  lesson.narrative_blocks.forEach((block, bIdx) => {
    const stageNum = bIdx + 1;
    const addText = adds[stageNum];
    if (addText && !block.text.includes(addText.trim().slice(0, 30))) {
      block.text = block.text.trim() + " " + addText.trim();
      totalUpdated++;
    }
  });
});

console.log(`Updated ${totalUpdated} narrative blocks in units/cme_new/data.js.`);
const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/cme_new/data.js successfully.');

