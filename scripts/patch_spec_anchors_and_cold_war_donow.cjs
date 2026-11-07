const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const CME_ANCHORS = {
  lesson_1: "The birth of the state of Israel and the 1948–49 War: historical background; the British Mandate, McMahon-Hussein Correspondence, Sykes-Picot Agreement (1916), Balfour Declaration (1917), and 1939 White Paper.",
  lesson_2: "The birth of the state of Israel and the 1948–49 War: the British withdrawal from Palestine; Jewish insurgency (Irgun, Lehi, King David Hotel), UN Partition Resolution 181, civil conflict, and the declaration of the State of Israel (14 May 1948).",
  lesson_3: "The birth of the state of Israel and the 1948–49 War: the Arab-Israeli War of 1948–49; Arab disunity, Israeli military mobilisation, the 1949 Armistice Agreements, the Palestinian refugee crisis (Nakba), UNRWA, and the Law of Return.",
  lesson_4: "The birth of the state of Israel and the 1948–49 War: the Suez Crisis (1956); the rise of Gamal Abdel Nasser, nationalisation of the Suez Canal, secret Anglo-French-Israeli collusion, military operation, superpower intervention, and consequences.",
  lesson_6: "The escalating conflict, 1956–73: rising tensions and causes of the 1967 War; border skirmishes, the Fedayeen, Headwater Diversion Plan water disputes, Syrian-Israeli clashes, closure of the Straits of Tiran, and expulsion of UNEF from Sinai.",
  lesson_7: "The escalating conflict, 1956–73: the course of the Six-Day War (June 1967); preemptive airstrikes destroying Egyptian airfields, swift Israeli victories across Sinai, the West Bank, East Jerusalem, and the Golan Heights.",
  lesson_8: "The escalating conflict, 1956–73: consequences of the 1967 War; creation of the occupied territories, Israeli settlements, Khartoum Resolution ('Three Noes'), UN Security Council Resolution 242 ('land for peace'), and the refugee crisis.",
  lesson_9: "The escalating conflict, 1956–73: Palestinian nationalism and resistance; the emergence of the PLO and Yasser Arafat, Battle of Karameh (1968), guerrilla tactics, aircraft hijackings, Black September in Jordan (1970), and the 1972 Munich Olympic massacre.",
  lesson_10: "The escalating conflict, 1956–73: the Yom Kippur War (October 1973); War of Attrition, Egyptian surprise crossing of the Suez Canal, Syrian offensive on the Golan, Israeli counter-offensive, US/Soviet resupply, and OAPEC oil embargo.",
  lesson_11: "Attempts at peace, 1974–95: search for peace after 1973; Henry Kissinger's shuttle diplomacy, Anwar Sadat's historic visit to Jerusalem (1977), Camp David Accords (1978), and Washington Egypt-Israel Peace Treaty (1979).",
  lesson_12: "Attempts at peace, 1974–95: continuing conflict and the Palestinian question; Operation Peace for Galilee and Israeli invasion of Lebanon (1982), Sabra and Shatila massacres, Kahan Commission, and First Intifada (1987–93).",
  lesson_13: "Attempts at peace, 1974–95: peace process in the 1990s; PLO renunciation of terrorism (1988), secret negotiations in Norway, Oslo I Accords (1993), handshake between Rabin and Arafat, assassination of Yitzhak Rabin (1995), and Oslo II agreement."
};

const COLD_WAR_ANCHORS = {
  lesson_1: "The origins of the Cold War, 1941–58: early tensions between East and West; ideological differences between communism and capitalism, differing views on governance and economy, Grand Alliance in the Second World War, and Tehran Conference (1943).",
  lesson_2: "The origins of the Cold War, 1941–58: wartime conferences and breakdown of the Grand Alliance; agreements and disagreements at Yalta and Potsdam (1945), atomic bomb testing, and Soviet control in Eastern Europe.",
  lesson_3: "The origins of the Cold War, 1941–58: development of the Cold War; Long Telegram and Novikov Telegram, Churchill's Iron Curtain speech (1946), Truman Doctrine (1947), Marshall Plan (1947), Cominform/Comecon, and Berlin Blockade/Airlift (1948–49).",
  lesson_4: "Cold War crises, 1958–70: Cuban Missile Crisis (1962); Cuban Revolution (1959), Castro's alliance with USSR, Bay of Pigs (1961), Soviet nuclear missile bases in Cuba, 'Thirteen Days' (October 1962), naval blockade, and resolution.",
  lesson_5: "Development of the Cold War and Cold War crises: superpower proxy conflicts; containment policy in Asia, Korean War (1950–53), Vietnam War (1955–75), military alliances (NATO, Warsaw Pact, SEATO), and global Cold War expansion.",
  lesson_6: "The end of the Cold War, 1970–91: collapse of Soviet control in Eastern Europe; Mikhail Gorbachev's Glasnost and Perestroika, INF Treaty (1987), fall of the Berlin Wall (November 1989), collapse of Warsaw Pact, and USSR dissolution (1991).",
  lesson_7: "Synoptic assessment across Superpower relations and the Cold War, 1941–91: evaluating the nature of superpower conflict; nuclear deterrence, brinkmanship, proxy wars, ideological warfare, and the shifting balance between confrontation and détente."
};

const COLD_WAR_DO_NOW_10 = {
  lesson_1: [
    {
      question: "Which military alliance fought together to defeat Nazi Germany, fascist Italy, and Imperial Japan in 1945?",
      answer: "The Grand Alliance (Britain, the United States, and the Soviet Union)"
    },
    {
      question: "What political and economic revolution in October 1917 overthrew the Russian Provisional Government and established the world's first communist state?",
      answer: "The Bolshevik Revolution (Russian Revolution), led by Vladimir Lenin"
    },
    {
      question: "What was the name of the secret British-American project that successfully developed the first atomic weapons in 1945?",
      answer: "The Manhattan Project"
    },
    {
      question: "Which 1939 non-aggression pact between Hitler and Stalin shocked the democratic world before Germany invaded Poland?",
      answer: "The Nazi-Soviet Pact (Molotov-Ribbentrop Pact)"
    },
    {
      question: "In what year did the United States enter the Second World War following the Japanese attack on Pearl Harbor?",
      answer: "1941 (7 December 1941)"
    },
    {
      question: "What was the German codename for Hitler's massive surprise invasion of the Soviet Union in June 1941?",
      answer: "Operation Barbarossa"
    },
    {
      question: "Which international peacekeeping organisation established after the First World War failed to prevent the outbreak of the Second World War?",
      answer: "The League of Nations"
    },
    {
      question: "What economic catastrophe beginning in 1929 devastated Western capitalist economies and aided the rise of totalitarian dictators?",
      answer: "The Wall Street Crash (The Great Depression)"
    },
    {
      question: "Who was the Soviet leader who established absolute totalitarian control over the USSR following Lenin's death in 1924?",
      answer: "Joseph Stalin"
    },
    {
      question: "Which major international body was founded in 1945 to replace the League of Nations and foster international cooperation?",
      answer: "The United Nations (UN)"
    }
  ],
  lesson_2: [
    {
      question: "What was the fundamental difference between the capitalist and communist views of private property?",
      answer: "Capitalism guarantees private ownership and profit; communism abolishes private property in favour of state ownership for collective benefit."
    },
    {
      question: "Why did Soviet leaders distrust Western nations following the 1917 Bolshevik Revolution?",
      answer: "Western powers (Britain, France, US) sent troops and money to support the White Army during the Russian Civil War to destroy the Bolshevik regime."
    },
    {
      question: "What weapon deployed by the US in August 1945 gave Washington a temporary monopoly of ultimate military force?",
      answer: "The atomic bomb (dropped on Hiroshima and Nagasaki)."
    },
    {
      question: "Which Soviet secret police agency enforced ideological loyalty and crushed political opposition inside the USSR?",
      answer: "The NKVD (later the KGB)."
    },
    {
      question: "Which wartime conference in November 1943 marked the first face-to-face meeting between the 'Big Three' (Churchill, Roosevelt, and Stalin)?",
      answer: "The Tehran Conference"
    },
    {
      question: "What major military operation did Stalin repeatedly demand the Western Allies launch in Western Europe to relieve pressure on the Red Army?",
      answer: "A second front in Western Europe (which culminated in D-Day / Operation Overlord in June 1944)"
    },
    {
      question: "What form of government is championed by Western democracy, in direct contrast to Soviet one-party communist rule?",
      answer: "Multi-party representative democracy with free and fair elections and individual civil liberties"
    },
    {
      question: "What economic mechanism determines prices and production in a capitalist economy, unlike the Soviet state-planned command economy?",
      answer: "Free-market supply and demand (market competition)"
    },
    {
      question: "What was the official name of the Marxist political faction that seized power in Russia in 1917 under Vladimir Lenin?",
      answer: "The Bolsheviks"
    },
    {
      question: "Why did the USSR suffer vastly greater civilian and military casualties in the Second World War compared to Britain and the United States?",
      answer: "Nazi Germany waged an ideological war of extermination on the Eastern Front, resulting in an estimated 27 million Soviet military and civilian deaths."
    }
  ],
  lesson_3: [
    {
      question: "Into how many temporary military occupation zones was Germany divided at Yalta and Potsdam?",
      answer: "Four zones (American, British, French, and Soviet)."
    },
    {
      question: "Which US President replaced Franklin D. Roosevelt in April 1945 and adopted a much tougher stance towards Stalin at Potsdam?",
      answer: "Harry S. Truman."
    },
    {
      question: "What international declaration did Stalin sign at Yalta, promising free elections across Eastern Europe?",
      answer: "The Declaration on Liberated Europe."
    },
    {
      question: "Why was the geographic location of Berlin a unique source of vulnerability for the Western Allies?",
      answer: "Berlin was situated over 100 miles deep inside the Soviet occupation zone of East Germany."
    },
    {
      question: "In which Crimean resort city did Churchill, Roosevelt, and Stalin meet in February 1945 to plan the post-war order?",
      answer: "Yalta"
    },
    {
      question: "In which German city just outside Berlin did Truman, Attlee, and Stalin meet in July–August 1945?",
      answer: "Potsdam"
    },
    {
      question: "Which British Prime Minister was replaced by Clement Attlee mid-way through the Potsdam Conference after losing the 1945 general election?",
      answer: "Winston Churchill"
    },
    {
      question: "What news did President Truman receive during the Potsdam Conference that significantly hardened his diplomatic stance against Stalin?",
      answer: "The successful Trinity test of the atomic bomb in the New Mexico desert"
    },
    {
      question: "Along which two rivers did the Allies agree to temporarily shift Poland's western border into former German territory?",
      answer: "The Oder-Neisse line"
    },
    {
      question: "What primary disagreement arose over reparations at Potsdam between the Soviet Union and the Western Allies?",
      answer: "Stalin wanted heavy economic reparations to permanently cripple Germany and rebuild the USSR, while the Western Allies wanted Germany economically viable to prevent renewed collapse."
    }
  ],
  lesson_4: [
    {
      question: "What metaphor did Winston Churchill use in 1946 to describe the physical and ideological division of Europe?",
      answer: "The 'Iron Curtain'."
    },
    {
      question: "What was the primary objective of the Marshall Plan announced by the US in 1947?",
      answer: "To rebuild war-torn European economies with $13 billion in aid, preventing impoverished nations from turning to communism."
    },
    {
      question: "How did the Western Allies supply 2.5 million West Berliners during Stalin's 1948–49 land blockade?",
      answer: "Through the Berlin Airlift (Operation Vittles), flying food, medicine, and coal into Tempelhof and Gatow airfields."
    },
    {
      question: "Which military alliance was founded in April 1949 by Western nations based on collective defense against Soviet aggression?",
      answer: "NATO (The North Atlantic Treaty Organisation)."
    },
    {
      question: "What American foreign policy doctrine announced in March 1947 pledged US economic and military support to free nations resisting communist subjugation?",
      answer: "The Truman Doctrine"
    },
    {
      question: "Which two Mediterranean countries received $400 million in emergency American aid under the Truman Doctrine to prevent communist takeovers?",
      answer: "Greece and Turkey"
    },
    {
      question: "Which Soviet organisation was established in 1947 to coordinate communist parties across Europe and enforce ideological conformity from Moscow?",
      answer: "Cominform (Communist Information Bureau)"
    },
    {
      question: "What was the name of the Soviet economic organisation established in 1949 as an alternative to the Marshall Plan for Eastern bloc nations?",
      answer: "Comecon (Council for Mutual Economic Assistance)"
    },
    {
      question: "What new currency introduced into the Western occupation zones of Germany in June 1948 triggered Stalin's decision to blockade West Berlin?",
      answer: "The Deutschmark (DM)"
    },
    {
      question: "Which two separate German states were officially established in 1949 following the Berlin Blockade?",
      answer: "The Federal Republic of Germany (West Germany / FRG) and the German Democratic Republic (East Germany / GDR)"
    }
  ],
  lesson_5: [
    {
      question: "Which Cuban revolutionary leader overthrew the Batista dictatorship in 1959 and allied Cuba with the USSR?",
      answer: "Fidel Castro."
    },
    {
      question: "What military measure did President Kennedy order in October 1962 to halt Soviet missile shipments to Cuba?",
      answer: "A naval 'quarantine' (blockade) of Cuba."
    },
    {
      question: "What secret concession did the US make regarding missiles in Turkey to resolve the Cuban Missile Crisis?",
      answer: "The secret removal of American Jupiter nuclear missiles stationed in Turkey."
    },
    {
      question: "What communications system was established between Washington and Moscow in 1963 to prevent accidental nuclear war?",
      answer: "The direct teletype 'Hotline' between the White House and the Kremlin."
    },
    {
      question: "What disastrous April 1961 CIA-backed invasion attempt by Cuban exiles failed to overthrow Fidel Castro's government?",
      answer: "The Bay of Pigs invasion"
    },
    {
      question: "Which Soviet leader agreed to place medium-range and intermediate-range nuclear missiles in Cuba in 1962?",
      answer: "Nikita Khrushchev"
    },
    {
      question: "What high-altitude American reconnaissance aircraft first photographed Soviet nuclear missile launch sites under construction in Cuba?",
      answer: "The U-2 spy plane"
    },
    {
      question: "For how many days did the high-stakes nuclear standoff of the Cuban Missile Crisis last in October 1962?",
      answer: "Thirteen Days (16–28 October 1962)"
    },
    {
      question: "What landmark 1963 international treaty banned nuclear weapons testing in the atmosphere, outer space, and underwater?",
      answer: "The Partial Test Ban Treaty (PTBT)"
    },
    {
      question: "What military doctrine acronym described the reality that a full-scale nuclear exchange between the US and USSR would completely annihilate both nations?",
      answer: "MAD (Mutually Assured Destruction)"
    }
  ],
  lesson_6: [
    {
      question: "Along which geographic boundary was the Korean peninsula partitioned in 1945 and preserved by the 1953 armistice?",
      answer: "The 38th Parallel."
    },
    {
      question: "What was the Domino Theory that guided American military intervention across Southeast Asia?",
      answer: "The belief that if one nation fell to communism, neighbouring countries would inevitably collapse like falling dominoes."
    },
    {
      question: "What intricate logistical jungle network enabled North Vietnam to transport weapons and troops through Laos and Cambodia into South Vietnam?",
      answer: "The Ho Chi Minh Trail."
    },
    {
      question: "Which 1968 surprise military offensive across 100 South Vietnamese cities shattered American domestic political confidence in the war?",
      answer: "The Tet Offensive."
    },
    {
      question: "In what year did communist forces under Kim Il-sung invade South Korea, initiating the Korean War?",
      answer: "1950 (25 June 1950)"
    },
    {
      question: "Under which international organisation's flag did American and allied forces intervene to defend South Korea?",
      answer: "The United Nations (UN)"
    },
    {
      question: "Which communist superpower entered the Korean War in November 1950, sending hundreds of thousands of 'volunteers' across the Yalu River?",
      answer: "Communist China (The People's Republic of China, led by Mao Zedong)"
    },
    {
      question: "What chemical defoliant was widely sprayed by the US military over Vietnamese jungles to strip away guerrilla cover and destroy food crops?",
      answer: "Agent Orange"
    },
    {
      question: "What term describes the period of easing geopolitical tensions between the US and USSR during the 1970s under Nixon and Brezhnev?",
      answer: "Détente"
    },
    {
      question: "What landmark 1972 superpower treaty signed in Moscow placed strict limits on the number of intercontinental ballistic missiles (ICBMs) each side could possess?",
      answer: "SALT I (Strategic Arms Limitation Talks)"
    }
  ],
  lesson_7: [
    {
      question: "Why did the East German government erect the Berlin Wall in August 1961?",
      answer: "To halt the catastrophic brain drain of skilled workers and professionals escaping into West Berlin."
    },
    {
      question: "What were Mikhail Gorbachev's two signature reform policies introduced in 1985?",
      answer: "Glasnost (openness/transparency) and Perestroika (economic and political restructuring)."
    },
    {
      question: "On what historic date was the Berlin Wall breached by jubilant citizens after border restrictions collapsed?",
      answer: "9 November 1989."
    },
    {
      question: "In what month and year did the Soviet Union officially dissolve, bringing the Cold War to an end?",
      answer: "December 1991 (26 December 1991)."
    },
    {
      question: "Which historic 1987 treaty signed by Reagan and Gorbachev banned all ground-launched intermediate-range nuclear missiles?",
      answer: "The INF Treaty (Intermediate-Range Nuclear Forces Treaty)"
    },
    {
      question: "What popular independent trade union led by Lech Wałęsa in Poland challenged communist one-party rule throughout the 1980s?",
      answer: "Solidarity (Solidarność)"
    },
    {
      question: "What informal doctrine, named after a famous Frank Sinatra song, allowed Eastern European nations to choose their own internal political systems without Soviet military intervention?",
      answer: "The 'Sinatra Doctrine' ('doing it their way')"
    },
    {
      question: "Which Central European country opened its border fence with capitalist Austria in May 1989, allowing thousands of East Germans to escape West?",
      answer: "Hungary"
    },
    {
      question: "In what year was Germany officially reunified as a single democratic nation following the fall of the Berlin Wall?",
      answer: "1990 (3 October 1990)"
    },
    {
      question: "Which American President gave a famous 1987 speech in front of the Brandenburg Gate, demanding: 'Mr. Gorbachev, tear down this wall!'?",
      answer: "Ronald Reagan"
    }
  ]
};

function patchCmeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  for (const [lessonId, anchor] of Object.entries(CME_ANCHORS)) {
    // Look for `"id": "lesson_X",`
    const regex = new RegExp(`("id":\\s*"${lessonId}",\\r?\\n)(\\s*)`, 'g');
    if (content.match(regex)) {
      const checkRegex = new RegExp(`"id":\\s*"${lessonId}"[\\s\\S]{0,100}"specification_anchor"`);
      if (!checkRegex.test(content)) {
        content = content.replace(regex, (match, p1, p2) => `${p1}${p2}"specification_anchor": "${anchor}",\n${p2}`);
        count++;
      } else {
        const replaceRegex = new RegExp(`("id":\\s*"${lessonId}"[\\s\\S]*?"specification_anchor":\\s*")[^"]*(")`);
        content = content.replace(replaceRegex, (match, p1, p2) => `${p1}${anchor}${p2}`);
        count++;
      }
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Patched CME ${filePath} (${count} specification anchors applied).`);
}

function patchColdWarFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let anchorCount = 0;

  for (const [lessonId, anchor] of Object.entries(COLD_WAR_ANCHORS)) {
    const regex = new RegExp(`("id":\\s*"${lessonId}",\\r?\\n)(\\s*)`, 'g');
    if (content.match(regex)) {
      const checkRegex = new RegExp(`"id":\\s*"${lessonId}"[\\s\\S]{0,100}"specification_anchor"`);
      if (!checkRegex.test(content)) {
        content = content.replace(regex, (match, p1, p2) => `${p1}${p2}"specification_anchor": "${anchor}",\n${p2}`);
        anchorCount++;
      } else {
        const replaceRegex = new RegExp(`("id":\\s*"${lessonId}"[\\s\\S]*?"specification_anchor":\\s*")[^"]*(")`);
        content = content.replace(replaceRegex, (match, p1, p2) => `${p1}${anchor}${p2}`);
        anchorCount++;
      }
    }
  }

  // Now patch do_now.items for cold_war
  for (const [lessonId, items] of Object.entries(COLD_WAR_DO_NOW_10)) {
    const itemsJson = JSON.stringify(items, null, 10)
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : '        ' + line))
      .join('\n');

    // Find the lesson block
    const lessonRegex = new RegExp(`("id":\\s*"${lessonId}"[\\s\\S]*?"do_now":\\s*\\{[\\s\\S]*?"items":\\s*)\\[[\\s\\S]*?\\](\\s*\\})`);
    if (lessonRegex.test(content)) {
      content = content.replace(lessonRegex, (match, p1, p2) => p1 + itemsJson + p2);
    } else {
      console.warn(`⚠️ Could not match do_now.items for ${lessonId}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Patched Cold War ${filePath} (${anchorCount} specification anchors & 7x10 Do Now items applied).`);
}

// 1. Patch CME files
patchCmeFile(path.join(ROOT_DIR, 'units', 'cme_new', 'data.js'));
patchCmeFile(path.join(ROOT_DIR, 'public', 'units', 'cme_new', 'data.js'));

// 2. Patch Cold War files
patchColdWarFile(path.join(ROOT_DIR, 'units', 'cold_war', 'data.js'));
patchColdWarFile(path.join(ROOT_DIR, 'public', 'units', 'cold_war', 'data.js'));

console.log('🎉 Spec anchors and Cold War Do Now patch completed.');
