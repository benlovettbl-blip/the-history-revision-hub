const fs = require('fs');
const path = require('path');

const filePaths = [
  path.resolve(__dirname, '../units/cold_war/data.js'),
  path.resolve(__dirname, '../public/units/cold_war/data.js')
];

const coldWarCalibrations = {
  // L1 Task 2
  0: {
    taskIdx: 1,
    model: "One consequence of the American atomic bomb was the breakdown of post-war trust and the start of a nuclear arms race. Specifically, when President Truman revealed the atomic bomb at Potsdam and deployed it against Hiroshima, Stalin viewed it as capitalist intimidation. Consequently, Stalin accelerated the Soviet crash nuclear programme, successfully testing their first atomic weapon in August 1949."
  },
  // L2 Task 1
  1: {
    taskIdx: 0,
    model: "Initially, at the Yalta Conference in February 1945, the Grand Alliance maintained cooperation. Churchill, Roosevelt, and Stalin agreed to divide Germany and Berlin into four zones, establish the United Nations, and signed the Declaration on Liberated Europe promising free elections.<br><br>However, relations deteriorated over Poland. Stalin broke his promise by arresting non-communist leaders and installing the pro-Soviet Lublin government. Tensions worsened when Roosevelt died in April 1945 and was replaced by Harry S. Truman, who adopted a confrontational stance toward Soviet expansion in Eastern Europe.<br><br>Finally, relations collapsed at the Potsdam Conference in July–August 1945. Truman informed Stalin of the successful Trinity atomic test, refusing Soviet demands for $10 billion in German reparations. With atomic monopoly, the US resisted Soviet demands, ending the conference without agreement and cementing the ideological division of Europe."
  },
  // L3 Task 1
  2: {
    taskIdx: 0,
    model: "Source A is useful because it provides official evidence of the Western Allies' resolve to resist Soviet pressure in Berlin. Foreign Secretary Ernest Bevin states Britain's determination to supply 2.5 million West Berliners by air rather than surrender the city. This matches my knowledge of Operation Vittles, which flew over 2.3 million tons of supplies into Berlin. However, as a parliamentary speech aimed at rallying domestic morale, Bevin downplays the terrifying risk of war with the USSR.<br><br>Source B is useful because it reveals the Soviet motive for the blockade: anger over Western economic unification and the introduction of the Deutsche Mark. From my knowledge, Stalin closed all road, rail, and canal routes on 24 June 1948 to force the Western powers out of Berlin. Overall, both sources are highly useful for showing the causes of the blockade and the Allied determination to fly supplies into West Berlin."
  },
  // L4 Task 1
  3: {
    taskIdx: 0,
    model: "On the one hand, American aggression was a primary catalyst for the crisis. Following Fidel Castro's 1959 revolution, the CIA orchestrated the disastrous April 1961 Bay of Pigs invasion to overthrow the Cuban government. When this failed, Operation Mongoose launched continuous sabotage and assassination attempts against Castro. Furthermore, the US deployed nuclear Jupiter missiles to Turkey, directly threatening the Soviet border. Nikita Khrushchev placed missiles in Cuba partly to defend a socialist ally from another US invasion.<br><br>On the other hand, the reckless secret actions of Nikita Khrushchev were equally responsible for triggering the crisis. By secretly shipping nuclear warheads and ballistic missiles 90 miles from Florida, Khrushchev attempted to dramatically shift the nuclear balance of power in one stroke. Deploying offensive weapons in secret violated established superpower norms, forcing President Kennedy to impose a naval blockade ('quarantine') on 22 October 1962.<br><br>In conclusion, while American hostility drove Cuba into the Soviet camp, Khrushchev's decision to secretly deploy offensive nuclear missiles was the decisive spark that brought the world to the brink of nuclear war."
  },
  // L5 Task 1
  4: {
    taskIdx: 0,
    model: "The conflict began in June 1950 when North Korean communist forces, equipped with Soviet tanks, invaded South Korea. Viewing this as direct Soviet aggression, President Truman deployed US forces under the United Nations flag, led by General Douglas MacArthur, who launched a brilliant amphibious landing at Incheon to push North Korean forces back.<br><br>Following this, the war escalated dramatically when UN troops crossed the 38th parallel toward the Yalu River. Alarmed by American troops on its border, Communist China intervened in November 1950 with 300,000 troops, driving UN forces back in bitter winter fighting. MacArthur publicly demanded the bombing of Chinese cities, leading Truman to dismiss him to prevent World War Three.<br><br>Finally, the fighting settled into a brutal trench stalemate along the 38th parallel, ending with an armistice in July 1953. Consequently, the war institutionalised Cold War militarisation, prompting the expansion of NATO and the US policy of global military containment."
  },
  // L6 Task 1
  5: {
    taskIdx: 0,
    model: "On the one hand, Mikhail Gorbachev's reforms were the primary catalyst for the collapse of Soviet control. After becoming General Secretary in 1985, Gorbachev introduced Glasnost ('openness') and Perestroika ('restructuring'). Crucially, in December 1988, he repudiated the Brezhnev Doctrine, telling the UN that Eastern European nations could decide their own futures ('Sinatra Doctrine'). By making it clear that the Red Army would no longer use tanks to crush protests, Gorbachev emboldened populations in Poland, Hungary, and East Germany to demand democracy.<br><br>On the other hand, deep economic bankruptcy and popular grassroots resistance made communist collapse inevitable. The Soviet command economy was crippled by chronic shortages, food rationing, and high military spending on the Afghan War. Concurrently, grassroots civil resistance eroded communist authority. In Poland, the trade union Solidarity forced free elections in June 1989. When Hungary opened its border with Austria, thousands of East Germans escaped, triggering mass protests that accidentally opened the Berlin Wall on 9 November 1989.<br><br>In conclusion, while economic failure provided the underlying pressure, Gorbachev's refusal to use military force was the decisive reason why Soviet power collapsed so rapidly and peacefully in 1989."
  },
  // L7 Task 1
  6: {
    taskIdx: 0,
    model: "On the one hand, proxy wars in the developing world caused catastrophic violence. Because nuclear deterrence (Mutually Assured Destruction) made direct war in Europe unthinkable, Washington and Moscow fought through regional proxies. In the Korean War (1950–1953), over three million people died. In Vietnam (1954–1975), nearly four million people were killed by napalm and bombing. Similarly, the Soviet invasion of Afghanistan (1979–1989) killed over one million civilians. In total, Cold War proxy wars and CIA/KGB covert coups claimed over twenty million lives.<br><br>On the other hand, the superpowers developed crucial diplomatic mechanisms to maintain peaceful coexistence. After the 1962 Cuban Missile Crisis, Kennedy and Khrushchev established the Washington-Moscow hotline and signed the 1963 Test Ban Treaty. In the 1970s, Détente produced the 1972 SALT I treaty, limiting nuclear weapons. Later, summit diplomacy between Reagan and Gorbachev achieved the historic 1987 INF Treaty, peacefully eliminating an entire class of nuclear missiles.<br><br>In conclusion, while nuclear deterrence successfully prevented World War Three in Europe, this stability came at the immense cost of proxy conflicts. For Asia, Africa, and Latin America, the Cold War was defined by devastating violence rather than peaceful coexistence."
  }
};

filePaths.forEach(fp => {
  if (!fs.existsSync(fp)) {
    console.log('File not found:', fp);
    return;
  }
  const data = require(fp).default;
  let count = 0;
  Object.keys(coldWarCalibrations).forEach(lIdxStr => {
    const lIdx = parseInt(lIdxStr, 10);
    const calib = coldWarCalibrations[lIdx];
    const task = data.lessons[lIdx].tasks[calib.taskIdx];
    if (task) {
      task.model_answer = calib.model;
      task.model = calib.model;
      count++;
    }
  });
  const newContent = `export default ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(fp, newContent, 'utf8');
  console.log(`Updated ${count} tasks in ${fp}`);
});
