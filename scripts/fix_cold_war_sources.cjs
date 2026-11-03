const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'cold_war', 'data.js');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

const newSourceB = {
  id: "cw_l5_src_b",
  letter: "B",
  type: "written",
  title: "Source B (Strategic Wartime Warning): Premier Zhou Enlai on UN Troops Crossing the 38th Parallel (3 October 1950)",
  author: "Premier Zhou Enlai (Foreign Minister of the People's Republic of China)",
  date: "3 October 1950",
  text: "\"The Chinese people love peace, but in order to defend peace they have never been and never will be afraid to oppose aggressive war. The Chinese people will not tolerate foreign aggression, nor will they supinely tolerate seeing their neighbours being savagely invaded by imperialists... If the American forces cross the 38th parallel and expand the war, we will not sit back with folded hands; we will take up the sacred duty of defending our homeland and resisting American aggression.\"",
  caption: "Official diplomatic warning delivered by Chinese Premier Zhou Enlai to Indian Ambassador K.M. Panikkar for transmission to Washington, warning that US forces crossing the 38th Parallel would trigger direct Chinese military intervention.",
  citation: "Foreign Relations of the United States, 1950, Vol. VII, Korea / Wilson Center Digital Archive.",
  provenance: "Summoned at midnight on 3 October 1950, Premier Zhou Enlai delivered this formal ultimatum to Indian Ambassador K.M. Panikkar to warn President Harry S. Truman that crossing the 38th Parallel threatened Chinese national security along the Yalu River border.",
  context: "Following General Douglas MacArthur’s triumphant landing at Inchon in September 1950, UN forces liberated Seoul and pursued fleeing North Korean forces northward across the 38th Parallel. Washington dismissed Zhou Enlai’s warning as a diplomatic bluff. In late October 1950, nearly 300,000 Chinese 'People's Volunteers' secretly crossed the frozen Yalu River, ambushing UN troops and pushing them back south of Seoul in temperatures of -30°C. **Hinge Question:** Why did the US government dismiss Zhou Enlai’s warning as a bluff, and what catastrophic military consequences followed?",
  question: "What does Source B reveal about why the People’s Republic of China intervened militarily in the Korean War in October 1950?",
  hinge_question: "Why did the US government dismiss Zhou Enlai’s warning as a bluff, and what catastrophic military consequences followed?",
  disciplinary_focus: "Strategic Intent, Border Security & Superpower Escalation",
  utility_enquiry: {
    question: "What does Premier Zhou Enlai's diplomatic warning tell us about the reasons for Chinese military entry into the Korean War?",
    content_inferences: "Demonstrates that China perceived UN military expansion north of the 38th Parallel as an existential threat to its newly established communist state and industrial borderland in Manchuria.",
    provenance_evaluation: "Direct diplomatic communication delivered by China’s foreign minister; an authentic expression of the Chinese Communist Party's security threshold.",
    context_limitations: "Delivered through an intermediary (India) to deter US advances; does not reveal Soviet Premier Joseph Stalin's behind-the-scenes role in coordinating the conflict.",
    bullet_points: [
      {
        label: "The 38th Parallel as a Red Line",
        text: "Zhou Enlai established the 38th Parallel as a decisive red line: while China accepted UN defence of South Korea, pushing into North Korea directly threatened the Chinese border."
      },
      {
        label: "Manchurian Border Security",
        text: "US aircraft and artillery operating near the Yalu River posed an immediate risk to China’s primary industrial heartland in Northeast China (Manchuria)."
      },
      {
        label: "Escalation to Superpower Clash",
        text: "When General MacArthur ignored this warning, nearly 300,000 Chinese troops crossed the Yalu River, transforming the civil conflict into a direct military confrontation with the United States."
      }
    ]
  },
  question_badge: "STRATEGIC ESCALATION",
  enquiry_question: "What does Source B reveal about why the People’s Republic of China intervened militarily in the Korean War in October 1950?",
  model_answer: "Source B reveals that Beijing viewed US troops crossing the 38th parallel as a direct imperialist threat to its own border. Zhou Enlai warned that China would intervene militarily rather than permit an American army to eliminate North Korea and station troops along the Yalu River.",
  provenance_clues: [
    "Author: Premier Zhou Enlai, Foreign Minister of the People's Republic of China.",
    "Audience: President Harry S. Truman and US national security planners (via the Indian Ambassador).",
    "Motive: To deter the US and United Nations from crossing the 38th Parallel and advancing toward the Chinese border."
  ],
  source_context: "Following General Douglas MacArthur’s triumphant landing at Inchon in September 1950, UN forces liberated Seoul and pursued fleeing North Korean forces northward across the 38th Parallel. Washington dismissed Zhou Enlai’s warning as a diplomatic bluff. In late October 1950, nearly 300,000 Chinese 'People's Volunteers' secretly crossed the frozen Yalu River, ambushing UN troops and pushing them back south of Seoul in temperatures of -30°C. **Hinge Question:** Why did the US government dismiss Zhou Enlai’s warning as a bluff, and what catastrophic military consequences followed?",
  teacher_notes: {
    source_context: "Following General Douglas MacArthur’s triumphant landing at Inchon in September 1950, UN forces liberated Seoul and pursued fleeing North Korean forces northward across the 38th Parallel. Washington dismissed Zhou Enlai’s warning as a diplomatic bluff. In late October 1950, nearly 300,000 Chinese 'People's Volunteers' secretly crossed the frozen Yalu River, ambushing UN troops and pushing them back south of Seoul in temperatures of -30°C. **Hinge Question:** Why did the US government dismiss Zhou Enlai’s warning as a bluff, and what catastrophic military consequences followed?"
  }
};

const blockLines = JSON.stringify(newSourceB, null, 2).split('\n');

const block2SourceLines = [
  '          "source": ' + blockLines[0],
  ...blockLines.slice(1, -1).map(l => '          ' + l),
  '          },'
];

const rootSourceLines = [
  ...blockLines.slice(0, -1).map(l => '        ' + l),
  '        },'
];

// Lines indices:
// 5824 to 5872 (root)
// 5528 to 5572 (block 2)
lines.splice(5824, 5872 - 5824, ...rootSourceLines);
lines.splice(5528, 5572 - 5528, ...block2SourceLines);

const updated = lines.join('\n');
fs.writeFileSync(filePath, updated, 'utf8');
console.log('Successfully updated units/cold_war/data.js');

const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'cold_war', 'data.js');
fs.writeFileSync(publicFilePath, updated, 'utf8');
console.log('Successfully updated public/units/cold_war/data.js');
