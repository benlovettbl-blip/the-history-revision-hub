const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'usa', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    oldText: "while CORE pioneered non-violent direct action protests.",
    newText: "while CORE pioneered non-violent direct action protests. How did legal challenges and grassroots direct action begin to erode the entrenched system of Southern segregation?"
  },
  {
    oldText: "forcing President Eisenhower to deploy federal troops to protect Black students.",
    newText: "forcing President Eisenhower to deploy federal troops to protect Black students. Why did the desegregation of Little Rock Central High School force the federal government to intervene directly in the South?"
  },
  {
    oldText: "proving the power of mass direct action.",
    newText: "proving the power of mass direct action. Why was the Montgomery Bus Boycott successful, and how did it establish non-violent mass protest as a central civil rights strategy?"
  },
  {
    oldText: "creating a constitutional crisis over states' rights.",
    newText: "creating a constitutional crisis over states' rights. How and why did Southern segregationists resist integration, and why did this create a constitutional crisis between state and federal authorities?"
  },
  {
    oldText: "suppress a segregationist riot that left two dead.",
    newText: "suppress a segregationist riot that left two dead. How did student sit-ins, Freedom Rides, and campus integrations escalate pressure on the federal government to act?"
  },
  {
    oldText: "which outlawed literacy tests.",
    newText: "which outlawed literacy tests. How did national television coverage of police brutality in Birmingham and Selma shock the American public and compel Congress to pass civil rights legislation?"
  },
  {
    oldText: "reflecting a shift toward racial pride and economic independence.",
    newText: "reflecting a shift toward racial pride and economic independence. Why did the Black Power movement emerge in the mid-1960s, and how did its methods and philosophy differ from non-violent direct action?"
  },
  {
    oldText: "prohibiting racial discrimination in housing.",
    newText: "prohibiting racial discrimination in housing. Why did violent urban riots erupt in northern and western cities between 1965 and 1968, and what did they reveal about racial inequality beyond the South?"
  },
  {
    oldText: "and Diem's ultimate assassination in November 1963.",
    newText: "and Diem's ultimate assassination in November 1963. Why did the United States back the corrupt regime of Ngo Dinh Diem, and how did his overthrow deepen American involvement in Vietnam?"
  },
  {
    oldText: "without a formal declaration of war.",
    newText: "without a formal declaration of war. How did the Gulf of Tonkin incident enable President Johnson to commit US ground combat troops to the war in Vietnam?"
  },
  {
    oldText: "severely damaged US soldier morale.",
    newText: "severely damaged US soldier morale. Why did advanced American military tactics, such as Operation Rolling Thunder and search-and-destroy missions, fail to break the Vietcong?"
  },
  {
    oldText: "triggering massive protests at home.",
    newText: "triggering massive protests at home. What was the strategy behind Nixon's policy of 'Vietnamization', and why did the secret expansion into Cambodia and Laos provoke intense domestic fury?"
  },
  {
    oldText: "shot and killed four student protesters, polarizing the nation.",
    newText: "shot and killed four student protesters, polarizing the nation. Why did domestic opposition to the Vietnam War intensify so dramatically following the Tet Offensive, the My Lai revelations, and the Kent State shootings?"
  },
  {
    oldText: "secure a landslide re-election in 1972.",
    newText: "secure a landslide re-election in 1972. Why did millions of Americans in the 'Silent Majority' continue to support the Vietnam War despite widespread anti-war demonstrations?"
  },
  {
    oldText: "completing the reunification of Vietnam under communist rule.",
    newText: "completing the reunification of Vietnam under communist rule. How did the United States negotiate its withdrawal under the Paris Peace Accords, and why did South Vietnam collapse so rapidly in 1975?"
  },
  {
    oldText: "prolonged war, forcing US withdrawal.",
    newText: "prolonged war, forcing US withdrawal. What was the decisive reason why the United States failed to achieve its military and political objectives in Vietnam?"
  }
];

let totalReplacements = 0;
replacements.forEach((r, idx) => {
  // Only replace if not already ending in a question mark
  if (content.includes(r.oldText + '?')) {
    console.log(`Target ${idx + 1} already has a question.`);
    return;
  }
  const count = (content.split(r.oldText).length - 1);
  if (count === 0) {
    console.error(`Target ${idx + 1} not found: "${r.oldText.substring(0, 30)}..."`);
  } else {
    content = content.replaceAll(r.oldText, r.newText);
    totalReplacements += count;
    console.log(`Target ${idx + 1}: replaced ${count} occurrence(s)`);
  }
});

fs.writeFileSync(dataFilePath, content, 'utf8');
console.log(`✅ Successfully updated USA blurbs with ${totalReplacements} new replacements!`);
