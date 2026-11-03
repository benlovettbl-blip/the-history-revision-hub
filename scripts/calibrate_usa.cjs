const fs = require('fs');
const path = require('path');

const pUnit = path.join(__dirname, '..', 'units', 'usa', 'data.js');
const pPublic = path.join(__dirname, '..', 'public', 'units', 'usa', 'data.js');

async function run() {
  const mod = (await import('file:///' + pUnit.replace(/\\/g, '/'))).default;

  // L1 Q1: 4m inference
  mod.lessons[0].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> Racial segregation was strictly enforced in public transport facilities. <strong>Detail:</strong> The sign clearly indicates separate waiting rooms and ticket counters for 'Coloured' passengers.<br><br><strong>Inference 2:</strong> Segregation humiliated Black citizens daily. <strong>Detail:</strong> Black passengers were forced into physically separated, inferior facilities regardless of destination.";

  // L3 Q1: 8m utility
  mod.lessons[2].exam_practice.questions[0].model = 
    "Source B is useful for an enquiry into the Montgomery Bus Boycott because it highlights the vital role of grassroots community organization. From my knowledge, when 40,000 Black commuters refused to use city buses following Rosa Parks' arrest, the Montgomery Improvement Association (led by Martin Luther King Jr.) organized a fleet of private carpools, volunteer church station wagons, and Black taxi drivers charging reduced fares to sustain the 381-day protest. As an eyewitness report by a local organizer, it provides authentic evidence of the community's discipline.<br><br>Source C is useful because it records the extreme economic pressure on the bus company and downtown white merchants, who lost thousands of dollars daily. However, as an interview with a white official, it tries to minimize the boycott's moral legitimacy. Overall, both sources are highly useful for showing how non-violent solidarity and economic pressure achieved the desegregation of Montgomery buses.";

  // L5 Q1: 4m inference
  mod.lessons[4].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> Southern police forces used extreme physical brutality against peaceful protesters. <strong>Detail:</strong> Police under Bull Connor turned high-pressure fire hoses and attack dogs on young demonstrators.<br><br><strong>Inference 2:</strong> Protesters deliberately maintained non-violent discipline despite state violence. <strong>Detail:</strong> Civil rights marchers knelt in prayer while being assaulted, provoking national outrage.";

  // L7 Q1: 8m utility
  mod.lessons[6].exam_practice.questions[0].model = 
    "Source B is useful for an enquiry into the urban race riots (1964–67) because it illustrates the severe economic deprivation, slum housing, and police harassment experienced by Black Americans in northern cities like Detroit and Watts. From my knowledge, the 1968 Kerner Commission concluded that riots were triggered by systemic poverty and police brutality, famously warning of 'two societies, separate and unequal'. As a contemporary resident's account, it gives genuine insight into ghetto frustration.<br><br>Source C is useful because it shows President Johnson expressing dismay that civil rights laws had not ended urban violence. Contextually, while the Civil Rights Act (1964) and Voting Rights Act (1965) ended legal segregation in the South, they did not solve northern poverty or job discrimination. Overall, both sources are very useful for explaining why riots erupted despite legislative progress.";

  // L9 Q1: 4m inference
  mod.lessons[8].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> American soldiers faced an invisible, highly dangerous enemy in the jungle. <strong>Detail:</strong> Soldiers describe walking into hidden booby traps and punji stakes without ever seeing Vietcong combatants.<br><br><strong>Inference 2:</strong> The environment caused severe physical and mental exhaustion. <strong>Detail:</strong> Troops endured continuous tropical rain, heat, and fear of sudden ambush.";

  // L11 Q1: 8m utility
  mod.lessons[10].exam_practice.questions[0].model = 
    "Source B is useful for an enquiry into the failure of US tactics in Vietnam because it demonstrates the devastating impact of heavy firepower on civilians. From my knowledge, tactics like Operation Rolling Thunder, chemical defoliants (Agent Orange), and napalm destroyed crops and villages, alienating the South Vietnamese peasants whose 'hearts and minds' were needed to defeat the Vietcong. As a report by an American war correspondent, it gives a candid account of military destruction.<br><br>Source C is useful because a Vietcong fighter describes using the Ho Chi Minh Trail and complex underground tunnel systems (like Cu Chi) to withstand American bombing. It shows how guerrilla adaptability countered superior US technology. Overall, both sources are highly useful for explaining why US firepower failed to defeat guerrilla resistance.";

  // L13 Q1: 4m inference
  mod.lessons[12].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> Domestic anti-war protests had escalated into deadly violence on American soil. <strong>Detail:</strong> Four unarmed student demonstrators were shot dead by Ohio National Guardsmen at Kent State University in May 1970.<br><br><strong>Inference 2:</strong> Nixon's expansion of the war provoked furious nationwide student strikes. <strong>Detail:</strong> Hundreds of college campuses shut down immediately following the invasion of Cambodia.";

  // L15 Q1: 8m utility
  mod.lessons[14].exam_practice.questions[0].model = 
    "Source B is useful for an enquiry into the anti-war movement because it reveals the moral shock caused by revelations of military atrocities, notably the 1968 My Lai Massacre. From my knowledge, when news broke that American troops under Lieutenant Calley had murdered over 300 unarmed Vietnamese villagers, public revulsion surged, turning millions of moderate citizens against the war. As a statement by a returning veteran, it provides firsthand evidence of anti-war sentiment within the military.<br><br>Source C is useful because President Nixon defends his 'Silent Majority', claiming anti-war protesters were an unpatriotic minority. Contextually, while protests dominated media headlines, millions of working-class Americans still supported Nixon. Overall, both sources are very useful for showing how the Vietnam War bitterly divided American society.";

  fs.writeFileSync(pUnit, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(pPublic, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
  console.log('✅ Successfully calibrated USA exam models to realistic standards!');
}

run().catch(console.error);

