const fs = require('fs');
const path = require('path');

const filePaths = [
  path.resolve(__dirname, '../units/cme_new/data.js'),
  path.resolve(__dirname, '../public/units/cme_new/data.js')
];

const cmeCalibrations = {
  // Lesson 1 (indices 0)
  0: [
    {
      question_match: 'Balfour Declaration',
      model: "One consequence of the Balfour Declaration was increased tension between Arab and Jewish populations in Palestine. Specifically, British Foreign Secretary Arthur Balfour promised British support for a 'national home for the Jewish people'. This angered Palestinian Arabs, who viewed the declaration as an imperial betrayal of their own independence, leading to violent anti-Zionist riots in Jerusalem in 1920."
    },
    {
      question_match: 'White Paper of 1939',
      model: "One consequence of the 1939 White Paper was the alienation of Jewish settlers and the outbreak of armed Zionist resistance against British rule. Specifically, Britain restricted Jewish immigration to 75,000 over five years just as Jews were fleeing Nazi persecution in Europe. Consequently, Jewish paramilitary groups like the Haganah and Irgun launched violent campaigns to end the British Mandate."
    },
    {
      question_match: 'narrative account analysing how British wartime diplomacy',
      model: "During the First World War, Britain made conflicting diplomatic promises that sowed long-term distrust. In the 1915 McMahon-Hussein Correspondence, Britain promised Arab independence in exchange for an uprising against the Ottoman Empire. However, in 1916 Britain secretly signed the Sykes-Picot Agreement with France, dividing Ottoman territories into Anglo-French zones of influence. Tensions worsened when Britain issued the 1917 Balfour Declaration, supporting a Jewish national home in Palestine.<br><br>Following the Allied victory in 1918, these irreconcilable pledges triggered immediate friction. When the League of Nations granted Britain the Mandate for Palestine in 1922, Palestinian Arabs felt deeply betrayed by the denial of self-determination. Violent inter-communal clashes erupted, including the 1920 Jerusalem riots and 1921 Jaffa riots.<br><br>Finally, Britain attempted to manage rising violence through the 1922 Churchill White Paper, reassuring Arabs that Palestine would not become 'as Jewish as England is English'. However, this satisfied neither community and entrenched permanent sectarian hostility under British rule."
    }
  ],
  // Lesson 2
  1: [
    {
      question_match: 'bombing of the King David Hotel (July 1946). (4 marks)',
      model: "One consequence of the King David Hotel bombing was the collapse of British domestic and political support for continuing the Mandate. Specifically, the Zionist militant group Irgun killed 91 British, Arab, and Jewish officials, devastating British military headquarters. This shocked the British public and convinced the government that maintaining order in Palestine was financially and militarily unsustainable."
    },
    {
      question_match: 'SS Exodus affair',
      model: "One consequence of the SS Exodus affair was a major international public relations disaster for Britain. Specifically, British naval forces intercepted the ship carrying 4,500 Holocaust survivors and forcibly returned them to displaced persons camps in Germany. Consequently, worldwide condemnation, particularly from the American public and President Truman, destroyed Britain's moral authority in Palestine."
    },
    {
      question_match: 'Explain the importance of the bombing of the King David Hotel',
      model: "The bombing of the King David Hotel was of decisive importance because it proved that Britain could no longer protect its own administrative and military command in Palestine. On 22 July 1946, Menachem Begin's Irgun detonated explosives that destroyed the Secretariat wing, killing 91 British, Arab, and Jewish staff. This catastrophic security failure demonstrated that even heavily fortified headquarters were vulnerable to Zionist insurgency, forcing British personnel into barbed-wire enclaves mockingly dubbed 'Bevingrad'.<br><br>Furthermore, the attack was crucial because it broke the political resolve of the British government and public. Facing post-war bankruptcy, severe domestic rationing, and the economic burden of maintaining 100,000 troops in Palestine, British newspapers and citizens demanded that troops be brought home. This collapse of political will directly convinced Prime Minister Clement Attlee to surrender the Mandate to the United Nations in February 1947."
    }
  ],
  // Lesson 3
  2: [
    {
      question_match: '1948–49 War for Palestinian Arabs',
      model: "One consequence of the 1948–49 War for Palestinian Arabs was the creation of a permanent refugee crisis known as the Nakba. Specifically, over 700,000 Palestinians fled or were forcibly expelled from their ancestral villages into squalid refugee camps in Gaza, the West Bank, Lebanon, and Jordan. Denied the right of return by Israel, they became permanently stateless."
    },
    {
      question_match: 'Israeli Law of Return',
      model: "One consequence of the 1950 Law of Return was a dramatic increase in Israel's Jewish population and military manpower. Specifically, the legislation granted every Jewish person worldwide the right to settle in Israel and gain immediate citizenship. Consequently, over 680,000 immigrants, including European Holocaust survivors and Mizrahi Jews expelled from Arab nations, doubled Israel's population by 1951."
    },
    {
      question_match: 'importance of the Law of Return',
      model: "The Law of Return was of fundamental importance because it fulfilled the founding ideological purpose of Zionism: creating a guaranteed sovereign sanctuary for world Jewry. By giving every Jewish person worldwide the immediate legal right to settle in Israel with full citizenship, it provided refuge for hundreds of thousands of traumatised European Holocaust survivors and Jewish communities expelled from Arab states such as Iraq and Yemen.<br><br>Furthermore, the law was vital for Israel's economic and military survival. The influx of over 680,000 immigrants between 1948 and 1951 doubled the new nation's Jewish population. This rapid demographic expansion provided the essential manpower needed to build agricultural settlements, expand the industrial workforce, and significantly enlarge the Israel Defense Forces (IDF) against hostile surrounding Arab armies."
    }
  ],
  // Lesson 4
  3: [
    {
      question_match: 'Gaza (February 1955)',
      model: "One consequence of the February 1955 Gaza raid was Egypt's decision to seek modern Soviet military weapons. Specifically, Israeli forces killed 38 Egyptian soldiers in response to cross-border fedayeen attacks. Consequently, President Gamal Abdel Nasser realized the Egyptian army was severely outgunned and signed the landmark September 1955 Czech Arms Deal, ending Western monopoly on Middle Eastern weapons."
    },
    {
      question_match: '1956 Suez Crisis for Britain and France',
      model: "One consequence of the 1956 Suez Crisis was the permanent end of Britain and France as independent global imperial superpowers. Specifically, US President Eisenhower threatened severe financial sanctions, including collapsing the British pound, forcing an immediate military withdrawal from Egypt. This demonstrated that European powers could no longer conduct unilateral military operations without American approval."
    },
    {
      question_match: 'narrative account analysing the events of the 1956 Suez Crisis',
      model: "The crisis began on 26 July 1956 when Egyptian President Gamal Abdel Nasser nationalised the Anglo-French Suez Canal Company. Nasser seized the waterway to fund the Aswan High Dam after Britain and the US cancelled financial aid. British Prime Minister Anthony Eden viewed this as an intolerable threat to vital oil supplies, resolving to overthrow Nasser.<br><br>In response, Britain, France, and Israel secretly signed the Protocol of Sèvres in October 1956 to manufacture an excuse for war. Under this plan, Israel invaded the Sinai on 29 October. Britain and France then issued an ultimatum and landed paratroopers at Port Said on 5 November, claiming to protect the canal as impartial peacekeepers.<br><br>However, this military action provoked decisive superpower intervention. US President Eisenhower condemned the invasion and threatened to collapse the British pound by blocking vital loans. Facing financial ruin, Britain accepted a humiliating ceasefire on 6 November. Therefore, American economic pressure forced the rapid withdrawal of Anglo-French troops, cementing Nasser's triumph and ending Britain's imperial status."
    }
  ],
  // Lesson 5
  4: [
    {
      question_match: 'Cairo Conference (1964)',
      model: "One consequence of the 1964 Cairo Conference was the official creation of the Palestine Liberation Organization (PLO). Specifically, Arab League leaders established the PLO to unite Palestinian resistance and formed the Palestine Liberation Army. This gave Palestinians an independent political and military voice to challenge Israeli sovereignty and coordinate cross-border guerrilla raids."
    },
    {
      question_match: 'events of 7 April 1967',
      model: "One consequence of the events of 7 April 1967 was a sharp escalation toward full-scale war. Specifically, a border skirmish over tractor plowing in the Demilitarized Zone escalated into an aerial dogfight in which Israeli Mirage jets shot down six Syrian MiG-21s over Damascus. Consequently, Syria pressured Egyptian President Nasser to honour their mutual defence pact."
    },
    {
      question_match: 'key events leading to the outbreak of the Six-Day War',
      model: "The path to war began along the northern border between 1964 and April 1967. Syria’s Ba'athist government backed Fatah guerrilla raids and shelled Israeli kibbutzim from the Golan Heights. In response, Israel launched retaliatory counter-strikes, culminating on 7 April 1967 when Israeli Mirage jets shot down six Syrian MiG-21s in an aerial dogfight over Damascus.<br><br>This humiliation directly provoked Egyptian President Nasser into dangerous brinkmanship in May 1967. Spurred by false Soviet intelligence claiming Israel was massing troops to invade Syria, Nasser mobilised 100,000 soldiers in the Sinai, expelled the United Nations Emergency Force (UNEF), and closed the Straits of Tiran, severing Israel's oil supplies from Eilat.<br><br>This blockade convinced Israeli leaders that national destruction was imminent. The crisis escalated further on 30 May when King Hussein of Jordan signed a mutual defence pact with Egypt, encircling Israel. Therefore, fearing an imminent multi-front assault, Israel launched a preemptive strike on 5 June, destroying the Egyptian air force in Operation Focus and sparking the Six-Day War."
    }
  ],
  // Lesson 6
  5: [
    {
      question_match: 'actions of Nasser in the period leading to war',
      model: "One consequence of Nasser's actions in May 1967 was that Israel considered war inevitable and launched a preemptive strike. Specifically, Nasser expelled UN peacekeepers from Sinai, deployed 100,000 troops, and closed the Straits of Tiran to Israeli shipping. Viewing the blockade as an act of war, Israel launched Operation Focus on 5 June, destroying Egypt's air force."
    },
    {
      question_match: 'outbreak of the Six-Day War (1967)',
      model: "One consequence of the outbreak of the Six-Day War was the total destruction of Arab air power within three hours. Specifically, on 5 June 1967, Israeli fighter jets flew low beneath radar to bomb 19 Egyptian airfields, destroying over 300 aircraft on the ground. Consequently, Israel gained total air supremacy, guaranteeing rapid victory on all three land fronts."
    },
    {
      question_match: 'importance of the Golan Heights',
      model: "The Golan Heights was of paramount importance for Israeli security because its elevated geography completely dominated the valleys below. Between 1948 and 1967, Syrian artillery gunners had occupied the high escarpment of the Golan, repeatedly shelling Israeli farming kibbutzim in Upper Galilee and targeting tractors in the Demilitarized Zone. By capturing the heights in June 1967, the IDF eliminated this permanent bombardment threat and established an impenetrable defensive buffer.<br><br>Furthermore, controlling the Golan was vital for securing Israel’s national water supply and strategic defence. The heights contained the headwaters of the Jordan River and Lake Kinneret (Sea of Galilee), thwarting Syrian engineering plans to divert freshwater away from Israel. Additionally, occupying the plateau placed Israeli tanks just forty miles from Damascus, giving Israel immense strategic deterrence against future Syrian aggression."
    }
  ],
  // Lesson 7
  6: [
    {
      question_match: 'UN Resolution 242',
      model: "One consequence of UN Resolution 242 was the establishment of the enduring 'land for peace' diplomatic formula. Specifically, the November 1967 resolution linked Israeli withdrawal from territories occupied in the Six-Day War to Arab recognition of Israel's right to live in peace. However, deliberate ambiguities over whether Israel had to leave 'all' territories prevented immediate implementation."
    },
    {
      question_match: 'continued dispute over the Suez Canal',
      model: "One consequence of the dispute over the Suez Canal was the outbreak of the bloody War of Attrition (1969–1970). Specifically, Israel fortified the east bank with the massive Bar-Lev sand wall, while Egypt launched relentless artillery bombardments across the closed waterway. Consequently, both superpowers were drawn into the crisis, with Soviet pilots flying combat patrols over Egypt."
    },
    {
      question_match: 'aftermath of the 1967 war in the period from June to November 1967',
      model: "The aftermath began in June 1967 when Israel decisively captured East Jerusalem, the West Bank, Gaza, Sinai, and the Golan Heights. This displacement of over 300,000 Palestinian refugees across the Jordan River created an acute humanitarian crisis that destabilised neighbouring Arab states and inflamed regional hostility.<br><br>This catastrophic defeat directly provoked Arab leaders to convene at the Khartoum Summit in August 1967. Rather than negotiating, the Arab League issued its uncompromising 'Three Noes': no peace, no recognition, and no negotiations with Israel. In response, Israel hardened its stance by establishing permanent military outposts and early settlements across the conquered territories, entrenching the occupation.<br><br>This deadlock ultimately forced the United Nations to intervene in November 1967 by passing Resolution 242, establishing the 'Land for Peace' formula. However, deliberate ambiguity over whether Israel had to withdraw from 'all' territories allowed both sides to maintain opposing demands. Therefore, instead of achieving a lasting settlement, the post-war diplomacy of 1967 cemented a permanent territorial stalemate that fuelled decades of future conflict."
    }
  ],
  // Lesson 8
  7: [
    {
      question_match: 'PFLP airplane hijacks of 1970',
      model: "One consequence of the September 1970 PFLP Dawson's Field hijackings was King Hussein's military offensive known as Black September. Specifically, Palestinian militants blew up three hijacked passenger airliners on Jordanian soil, humiliating the monarchy. Consequently, the Jordanian army attacked Palestinian guerrilla bases, killing thousands and expelling the PLO to Lebanon."
    },
    {
      question_match: 'expulsion of the PLO from Jordan',
      model: "One consequence of the PLO's expulsion from Jordan was the relocation of Palestinian militant headquarters to southern Lebanon, known as 'Fatahland'. Specifically, Yasser Arafat re-established armed bases in Lebanese refugee camps to launch cross-border rocket attacks against northern Israel. This destabilized Lebanon's delicate sectarian balance, contributing directly to the outbreak of the Lebanese Civil War in 1975."
    },
    {
      question_match: 'importance of the Munich Olympics',
      model: "The Munich Olympics attack in September 1972 was of immense importance because it placed the Palestinian issue at the center of global news media. Eight Black September terrorists infiltrated the Olympic village, taking eleven Israeli athletes hostage and murdering them. An estimated 900 million television viewers worldwide watched the drama unfold. While the killings caused global revulsion, they shattered international apathy and forced world leaders to recognize that Palestinian national demands could no longer be ignored.<br><br>Furthermore, the massacre was important because it forced the PLO to reconsider its international diplomatic strategy. Recognizing that civilian terrorism alienated Western support, Yasser Arafat gradually distanced the mainstream PLO from international hijacking, culminating in his historic 1974 'gun and olive branch' address to the UN General Assembly. Simultaneously, the attack led Israel's Mossad to launch 'Operation Wrath of God', assassinating suspected Black September planners across Europe."
    }
  ],
  // Lesson 9
  8: [
    {
      question_match: 'consolidation of control of the occupied territories',
      model: "One consequence of Israel's consolidation of the occupied territories was the creation of permanent Jewish settlements and rising Palestinian resistance. Specifically, Israel established agricultural and religious outposts like Gush Emunim across the West Bank and Gaza. This divided Palestinian communities, restricted Arab access to fertile farmland and water, and entrenched deep hostility toward the military occupation."
    },
    {
      question_match: '1(b). Explain one consequence of the Yom Kippur War',
      model: "One consequence of the 1973 Yom Kippur War was the shattering of Israel's sense of military invincibility. Specifically, surprise Egyptian and Syrian assaults breached the Bar-Lev Line and captured the Golan plateau, inflicting over 2,600 Israeli casualties. Consequently, the Israeli public lost faith in their political leadership, leading to the Agranat Commission and Prime Minister Golda Meir's resignation."
    },
    {
      question_match: 'key events of the Yom Kippur War',
      model: "The war began on 6 October 1973 when Egypt and Syria launched a coordinated surprise assault during the Jewish holy day of Yom Kippur. In the south, Egyptian forces crossed the Suez Canal and breached the fortified Bar-Lev Line using water cannons, while Syrian armoured divisions overran Israeli defences on the Golan Heights, inflicting devastating initial casualties on the unprepared IDF.<br><br>This existential crisis directly triggered a massive American military intervention. US President Nixon ordered Operation Nickel Grass, an emergency airlift of tanks and aircraft that replenished Israeli forces. Re-equipped, General Ariel Sharon's division exploited a gap between Egyptian armies, bridged the canal, and surrounded Egypt's Third Army, reversing the military momentum in Israel's favour.<br><br>However, this turnaround provoked global diplomatic and economic retaliation. Arab OPEC nations imposed a punitive oil embargo on Western supporters of Israel, quadrupling world oil prices. Fearing a catastrophic nuclear standoff with the Soviet Union, US Secretary of State Kissinger intervened. Therefore, intense superpower pressure secured a UN ceasefire on 24 October 1973, ending combat and opening the path to subsequent peace diplomacy."
    }
  ],
  // Lesson 10
  9: [
    {
      question_match: '1973 OPEC oil embargo',
      model: "One consequence of the 1973 OPEC oil embargo was that the United States actively engaged in Middle Eastern diplomacy to secure regional stability. Specifically, Arab oil producers cut production and banned exports to the US, quadrupling oil prices and causing fuel shortages. Consequently, Secretary of State Henry Kissinger initiated 'shuttle diplomacy' to negotiate disengagement pacts and prevent future embargoes."
    },
    {
      question_match: 'Anwar Sadat’s visit to Jerusalem in November 1977',
      model: "One consequence of Anwar Sadat's November 1977 visit to Jerusalem was the historic breakthrough leading directly to the 1978 Camp David Accords. Specifically, Sadat became the first Arab leader to enter Israel and address the Knesset, declaring that Egypt was prepared to live in peace. Consequently, this bold gesture shattered psychological barriers and opened direct bilateral peace talks with Menachem Begin."
    },
    {
      question_match: 'diplomatic negotiations between Israel and Egypt from 1974 to November 1977',
      model: "Diplomatic engagement began in early 1974 following the devastation of the Yom Kippur War. Fearing further conflict and eager to ease the damaging Arab oil embargo, US Secretary of State Henry Kissinger initiated intensive 'shuttle diplomacy'. Flying between Middle Eastern capitals, Kissinger successfully mediated the Sinai I (1974) and Sinai II (1975) disengagement accords, which withdrew Israeli troops from the Suez Canal and permitted Egypt to reopen the waterway.<br><br>However, this diplomatic momentum stalled following the May 1977 election of Menachem Begin’s right-wing Likud government. Begin was an ideological hardliner committed to retaining biblical lands in the West Bank, which threatened to paralyze regional talks. Fearing another costly war, Egyptian President Anwar Sadat decided to break the psychological impasse with an unprecedented diplomatic gamble.<br><br>This culminated on 19 November 1977 when Sadat made a historic visit to Jerusalem, becoming the first Arab leader to address the Israeli Knesset. Offering full peace in exchange for Egyptian territory, Sadat's bold initiative dismantled thirty years of mutual hostility. Therefore, this dramatic gesture compelled Begin to negotiate, laying the crucial foundation for the 1978 Camp David Accords."
    },
    {
      question_match: 'importance of the Camp David Accords',
      model: "The Camp David Accords were of monumental importance because they produced the first official peace treaty between Israel and a sovereign Arab state. By signing the 1979 Egypt-Israel Peace Treaty, Israel agreed to return the entire Sinai Peninsula in exchange for full diplomatic recognition, demilitarized border zones, and free shipping access through the Suez Canal. This historic pact removed Egypt—the Arab world's largest and most powerful military—from the conflict, effectively eliminating the threat of a united multi-front Arab war against Israel.<br><br>Furthermore, the Accords were important because they caused deep political fracture within the Arab world and isolated Egypt. Arab League nations condemned Sadat as a traitor, expelled Egypt from the organization, and severed economic ties. Crucially, the Accords failed to secure meaningful self-determination or statehood for Palestinians, angering the PLO and radicalising Islamist factions, which culminated in Sadat’s assassination by militant soldiers in 1981."
    }
  ],
  // Lesson 11
  10: [
    {
      question_match: 'Operation Litani in March 1978',
      model: "One consequence of Operation Litani was the deployment of United Nations peacekeepers along the Lebanese-Israeli border. Specifically, the IDF invaded southern Lebanon to push PLO guerrillas north of the Litani River following the Coastal Road massacre. Consequently, the UN established the UNIFIL peacekeeping force and a southern buffer zone to prevent future cross-border incursions."
    },
    {
      question_match: 'Sabra and Shatila massacre',
      model: "One consequence of the September 1982 Sabra and Shatila massacre was intense political outrage within Israel and the condemnation of defence minister Ariel Sharon. Specifically, Christian Phalangist militiamen murdered between 800 and 2,000 Palestinian civilians while Israeli forces controlled the perimeter. Consequently, the Israeli Kahan Commission found Sharon personally responsible for failing to intervene, forcing his resignation."
    },
    {
      question_match: 'outbreak of the First Intifada in December 1987',
      model: "One consequence of the outbreak of the First Intifada was that the Palestinian struggle shifted from external exile to grassroots civil resistance inside the occupied territories. Specifically, widespread strikes, demonstrations, and youth stone-throwing challenged Israeli military rule across Gaza and the West Bank. Consequently, harsh Israeli curfews and 'broken bones' crackdowns generated global sympathy for Palestinian statehood."
    },
    {
      question_match: 'Israeli military involvement in Lebanon between 1978 and 1983',
      model: "Israeli military involvement began in March 1978 when Prime Minister Menachem Begin launched Operation Litani following the PLO's Coastal Road attack. Over 25,000 Israeli soldiers invaded southern Lebanon to push Palestinian fedayeen north of the Litani River. Although UNIFIL peacekeepers and a Christian militia buffer zone were deployed, persistent cross-border rocket fire convinced Defence Minister Ariel Sharon that only total destruction of the PLO would secure Israel.<br><br>Consequently, this tension triggered a full-scale invasion in June 1982 termed Operation Peace for Galilee. Advancing sixty miles past the cabinet-approved limit, Sharon besieged West Beirut. Weeks of relentless IDF aerial and artillery bombardment forced Yasser Arafat and thousands of PLO fighters to evacuate Lebanon for exile in Tunisia.<br><br>However, this military victory turned into a moral catastrophe in September 1982. Following the assassination of Lebanese President Gemayel, Israeli forces permitted Christian Phalangist militias into the Sabra and Shatila refugee camps, where hundreds of civilians were slaughtered. Therefore, intense domestic outrage and the Kahan Commission inquiry forced Sharon’s resignation, leaving Israel trapped in a costly Lebanese occupation."
    },
    {
      question_match: 'importance of the First Intifada',
      model: "The First Intifada was of profound importance because it completely transformed the international media image of the Israeli-Palestinian conflict. For decades, Western opinion had viewed Israel as a vulnerable democratic state defending itself against aggressive Arab neighbours. However, television broadcasts showing heavily armed Israeli soldiers firing live ammunition and tear gas at unarmed Palestinian children armed only with stones dramatically reversed this narrative. Defence Minister Yitzhak Rabin's controversial policy of 'breaking bones' generated severe worldwide criticism, undermining international sympathy for Israel's military occupation.<br><br>Furthermore, the uprising was critically important because it forced the United States and the United Nations to prioritise Palestinian national rights. The sustained grassroots civil disobedience demonstrated that military occupation was untenable. This global diplomatic pressure directly persuaded the US to open formal dialogue with Yasser Arafat in 1988, creating the diplomatic momentum that culminated in the 1991 Madrid Peace Conference and the 1993 Oslo Accords."
    }
  ],
  // Lesson 12
  11: [
    {
      question_match: 'secret Oslo back-channel negotiations in 1993',
      model: "One consequence of the secret Oslo negotiations was the breakthrough Letters of Mutual Recognition in September 1993. Specifically, Israeli Prime Minister Yitzhak Rabin officially recognized the PLO as the representative of the Palestinian people, while Yasser Arafat recognized Israel's right to exist and renounced terrorism. Consequently, this ended 45 years of non-recognition and enabled the Oslo I Accord."
    },
    {
      question_match: 'assassination of Yitzhak Rabin on 4 November 1995',
      model: "One consequence of the assassination of Yitzhak Rabin was the derailment of the Israeli-Palestinian peace process and the rise of right-wing Israeli political opposition. Specifically, Jewish extremist Yigal Amir murdered Rabin at a Tel Aviv peace rally to prevent territorial handovers. Consequently, trust collapsed, contributing to the May 1996 election of Likud leader Benjamin Netanyahu, who slowed further withdrawals."
    },
    {
      question_match: 'peace process between Israel and the Palestinians from 1992 to the assassination of Yitzhak Rabin',
      model: "The peace process began in 1992 following the election of Israeli Prime Minister Yitzhak Rabin, who favoured territorial compromise. Secret back-channel negotiations in Norway produced the historic Letters of Mutual Recognition in September 1993, in which Israel recognised the PLO and Yasser Arafat renounced terrorism. This breakthrough led directly to the Oslo I Accord, establishing a framework for phased Palestinian self-government.<br><br>Following this initial agreement, the peace process expanded practical administration. In May 1994, the Cairo Agreement created the Palestinian National Authority (PNA) in Gaza and Jericho. Diplomatic momentum continued with the September 1995 Oslo II Agreement, which divided the West Bank into Areas A, B, and C to extend Palestinian civil control.<br><br>However, violent extremist opposition threatened to derail these achievements. The 1994 Hebron massacre and retaliatory Hamas suicide bombings hardened public opinion. This hostility culminated on 4 November 1995 when Jewish extremist Yigal Amir assassinated Rabin at a Tel Aviv peace rally. Therefore, Rabin’s murder shattered the moderate political coalition, bringing the momentum of the Oslo peace process to a tragic halt."
    },
    {
      question_match: 'importance of the Oslo I Accord (1993)',
      model: "The Oslo I Accord was of decisive historical importance because it shattered decades of mutual diplomatic denial and established official mutual recognition between Israel and the PLO. Through the September 1993 Letters of Mutual Recognition, Prime Minister Yitzhak Rabin recognized the PLO as the legitimate representative of the Palestinian people, while Yasser Arafat recognized Israel’s right to exist in peace and explicitly renounced terrorism. This historic breakthrough transformed bitter enemies into diplomatic partners, symbolized by their historic handshake on the White House lawn.<br><br>Furthermore, the Accord was important because it created the institutional foundation for Palestinian self-government through the Palestinian National Authority (PNA). Under the 'Gaza-Jericho First' formula, Israeli troops withdrew from major Palestinian population centers, allowing Arafat to return from exile to head the administration. However, by deferring contentious issues—including Jerusalem, refugees, and Jewish settlements—the accord left unresolved flashpoints that extremists violently exploited to undermine future peace."
    }
  ]
};

filePaths.forEach(fp => {
  if (!fs.existsSync(fp)) {
    console.log(`File not found: ${fp}`);
    return;
  }
  let content = fs.readFileSync(fp, 'utf8');

  // We need to parse or string replace accurately. Since data.js exports default or module.exports, let's load the data object in node
  const data = require(fp).default;
  let updatedCount = 0;

  data.lessons.forEach((l, lIdx) => {
    const calibs = cmeCalibrations[lIdx];
    if (!calibs) return;

    (l.exam_practice?.questions || []).forEach(q => {
      const match = calibs.find(c => q.question.includes(c.question_match));
      if (match) {
        q.model = match.model;
        updatedCount++;
      }
    });
  });

  const newContent = `export default ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(fp, newContent, 'utf8');
  console.log(`Updated ${updatedCount} exam models in ${fp}`);
});
