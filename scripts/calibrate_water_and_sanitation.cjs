const fs = require('fs');
const path = require('path');

const filePaths = [
  path.resolve(__dirname, '../units/water_and_sanitation/data.js'),
  path.resolve(__dirname, '../public/units/water_and_sanitation/data.js')
];

const calibratedModels = [
  // L1: Romans
  "A primary reason the Romans built sophisticated water systems was the need to supply clean drinking water to crowded new towns like Londinium. Engineers constructed stone aqueducts to channel fresh water from distant springs directly into public fountains, bathhouses, and flushing latrines. This prevented deadly water-borne diseases like dysentery in dense urban areas.<br><br>Furthermore, monumental bathhouses were built to project imperial power and spread Roman culture (Romanitas). Grand public baths with heated hypocausts encouraged Celtic Britons to adopt Roman hygiene and civilized daily habits, showing off the superior wealth and engineering of the Roman Empire.",

  // L2: Medieval towns vs monasteries
  "A primary reason towns had worse public health was severe overcrowding and the lack of clean piped water. Towns like London had unpaved streets where butchers dumped animal waste, and porous cesspits frequently leaked sewage into drinking wells, causing deadly outbreaks of cholera and dysentery.<br><br>In contrast, wealthy monasteries were planned with advanced water systems. Priories like Canterbury had clean spring water piped through underground lead conduits into settling tanks and washbasins (lavatoria). Monks followed strict rules requiring cleanliness, while towns had no central planning, meaning urban waste was dumped into local rivers.",

  // L3: Great Plague 1665
  "A primary reason was the total lack of scientific understanding about the true cause of disease. In 1665, doctors still believed the Great Plague was caused by foul-smelling air (miasma) or God's anger, knowing nothing of bacteria or fleas. Consequently, useless treatments like smoking tobacco or carrying sweet herbs were used instead of killing rats.<br><br>Furthermore, municipal measures were poorly enforced. Although infected houses were locked and marked with red crosses, desperate families escaped or bribed watchmen. Authorities also killed thousands of cats and dogs, mistakenly removing the natural predators that controlled the plague-carrying black rat population.",

  // L4: Industrial Towns
  "A primary reason was the rapid, uncontrolled growth of industrial factory towns. Between 1800 and 1850, thousands of workers moved to cities like Manchester and Leeds. Greedy landlords built cramped, unventilated back-to-back houses with no piped water or drainage. Up to a hundred people often shared a single overflowing privy.<br><br>Furthermore, governments followed a strict laissez-faire policy, refusing to spend taxpayers' money on public sanitation. With no clean piped water, sewage seeped into local rivers and pump wells. Consequently, when cholera struck Britain in 1831, it spread rapidly through contaminated water, killing thousands of factory workers.",

  // L5: Snow & Great Stink
  "A primary reason was Dr John Snow’s discovery during the 1854 Soho cholera outbreak. By mapping deaths around the Broad Street pump, Snow proved cholera was a water-borne disease swallowed in contaminated water, not inhaled from miasma. Removing the pump handle ended the local epidemic and provided clear evidence that clean drinking water was vital.<br><br>Furthermore, the 1858 Great Stink forced Parliament to abandon laissez-faire. Joseph Bazalgette built 82 miles of underground brick sewers to carry London's sewage safely away from drinking supplies. Finally, the compulsory 1875 Public Health Act forced all councils to provide clean water and sewers, permanently conquering cholera.",

  // L6: 19th Century Progress
  "A primary factor driving rapid progress was scientific discovery. In 1854, Dr John Snow proved cholera was water-borne by mapping Soho deaths around the Broad Street pump. Later, Louis Pasteur’s 1861 Germ Theory proved microbes caused disease, convincing authorities that pure drinking water was essential for saving lives.<br><br>Furthermore, government attitudes shifted away from laissez-faire toward compulsory state action. After Bazalgette constructed London’s massive sewer network, Disraeli’s government passed the landmark 1875 Public Health Act. This forced local councils to provide clean piped water, collect rubbish, and build covered sewers, transforming medical knowledge into national sanitation."
];

filePaths.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const data = require(fp).default;
  let count = 0;
  data.lessons.forEach((l, idx) => {
    if (calibratedModels[idx] && l.tasks && l.tasks.length > 0) {
      l.tasks[0].model_answer = calibratedModels[idx];
      l.tasks[0].model = calibratedModels[idx];
      count++;
    }
  });
  fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  console.log(`Calibrated ${count} tasks in ${fp}`);
});
