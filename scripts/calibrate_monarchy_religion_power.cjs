const fs = require('fs');
const path = require('path');

const filePaths = [
  path.resolve(__dirname, '../units/monarchy_religion_power/data.js'),
  path.resolve(__dirname, '../public/units/monarchy_religion_power/data.js')
];

const calibratedModels = [
  // L1 Task 1: Henry VIII Break with Rome
  {
    taskIdx: 0,
    model: "A primary reason was Henry VIII’s dynastic desperation for a legitimate male heir. Catherine of Aragon had failed to produce a surviving son, and Henry feared the Tudor dynasty would collapse into civil war without a male successor. When Pope Clement VII refused to annul his marriage, Henry broke with the Catholic Church in 1534 so he could marry Anne Boleyn.<br><br>Furthermore, Henry desired royal supremacy and Church wealth. By passing the Act of Supremacy, Henry made himself supreme head of the Church of England, gaining total sovereignty. Dissolving the monasteries allowed him to seize vast monastic lands, doubling royal income and securing the loyalty of English nobles."
  },
  // L2 Task 1: Elizabethan Settlement
  {
    taskIdx: 0,
    model: "The 1559 Religious Settlement was very important because it brought much-needed stability after years of violent religious turmoil under Edward VI and Mary I. Elizabeth created a moderate 'Middle Way' (Via Media) that combined Protestant doctrine with traditional Catholic ceremonies to avoid civil war.<br><br>The Act of Supremacy made Elizabeth 'Supreme Governor' rather than 'Head', soothing Catholic consciences. Meanwhile, the Act of Uniformity introduced an English Book of Common Prayer but allowed candles and vestments. By fining recusants moderately rather than executing them, Elizabeth successfully united the majority of the population and established long-term religious peace."
  },
  // L3 Task 1: Spanish Armada
  {
    taskIdx: 0,
    model: "Initially, King Philip II of Spain launched 130 ships in May 1588 to invade England and overthrow Protestant Queen Elizabeth. The Spanish sailed up the English Channel in a rigid defensive crescent, aiming to join the Duke of Parma's army in the Netherlands.<br><br>However, English tactics disrupted the invasion. Lord Howard and Sir Francis Drake used faster, more manoeuvrable ships with long-range culverin cannons. At Calais, the English launched eight blazing fireships at midnight, causing the terrified Spanish fleet to cut their anchors and scatter in disarray. At the Battle of Gravelines, English gunners battered the disorganised Spanish ships.<br><br>Finally, severe Atlantic storms ('the Protestant Wind') wrecked dozens of Spanish galleons along the rocky coasts of Scotland and Ireland, ending Philip's invasion attempt."
  },
  // L4 Task 1: Charles I Execution
  {
    taskIdx: 0,
    model: "A primary reason was Charles I’s refusal to accept constitutional limits. Charles believed in the Divine Right of Kings, ruling without Parliament for eleven years during the 'Personal Rule'. After losing the Civil War, Charles refused all peace treaties and secretly allied with the Scots to restart the war in 1648, convincing Oliver Cromwell and the New Model Army that the King was a 'man of blood' who could never be trusted.<br><br>Furthermore, the radicalisation of the New Model Army made execution inevitable. Purged of moderate MPs by Pride’s Purge, the remaining 'Rump Parliament' put Charles on trial for high treason. Charles refused to plead, insisting no court had authority over the monarch. Believing peace was impossible while the King lived, Parliament beheaded him on 30 January 1649."
  },
  // L5 Task 1: Consequence (already 85w, let's keep or tighten to 50w)
  {
    taskIdx: 0,
    model: "One consequence of the 1688 Glorious Revolution was the permanent establishment of a constitutional monarchy in England. Specifically, Parliament offered the crown to William and Mary only on condition that they accepted the 1689 Bill of Rights. This prevented future monarchs from suspending laws, raising taxes without consent, or maintaining a standing army in peacetime."
  },
  // L5 Task 2: Glorious Revolution Evaluative
  {
    taskIdx: 1,
    model: "On the one hand, the 1688 Glorious Revolution was a major constitutional triumph because it ended absolute royal monarchy without a bloody civil war. Parliament invited Protestant William of Orange and Mary to replace Catholic James II. By signing the 1689 Bill of Rights, the Crown agreed that monarchs could not suspend laws or raise taxes without parliamentary consent, establishing a constitutional monarchy.<br><br>On the other hand, the revolution was violent and divisive outside England. In Ireland, James II’s Catholic supporters were brutally crushed at the Battle of the Boyne (1690), leading to oppressive Penal Laws against Irish Catholics. Therefore, while it secured peaceful constitutional liberty for English Protestants, it brought deep sectarian division and hardship to Ireland."
  }
];

filePaths.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const data = require(fp).default;
  let count = 0;

  calibratedModels.forEach((c, idx) => {
    const l = data.lessons[idx < 4 ? idx : 4];
    if (l && l.tasks && l.tasks[c.taskIdx]) {
      l.tasks[c.taskIdx].model_answer = c.model;
      l.tasks[c.taskIdx].model = c.model;
      count++;
    }
  });

  fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  console.log(`Calibrated ${count} tasks in ${fp}`);
});
