const fs = require('fs');
const path = require('path');

// Extract getTaskTypeInfo from viewer_replacement_snippet.js
const snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');

// evaluate snippet in a sandbox to get functions
const vm = require('vm');
const sandbox = {
  console: console,
  document: { getElementById: () => null }
};
vm.createContext(sandbox);

// Wrap snippet to expose functions
const code = `
${snippet}
this.getTaskTypeInfo = getTaskTypeInfo;
this.getTaskStudioLabel = getTaskStudioLabel;
this.extractStatementFocus = extractStatementFocus;
this.cleanCausalTopic = cleanCausalTopic;
`;

vm.runInContext(code, sandbox);

const testTasks = [
  {
    name: 'Weimar L4 Q3(d) 16m Interpretation Essay',
    unit: { keyStage: 'KS4' },
    lesson: { title: 'Changes in Society, 1924–1929' },
    task: {
      marks: 16,
      tariff: '16 marks (+4 SPaG)',
      question: 'How far do you agree with Interpretation 2 about the position of women in the Weimar Republic? Explain your answer, using both interpretations and your knowledge of the historical context.'
    }
  },
  {
    name: 'Great War L3 Q3(b) 4m Difference in Interpretations',
    unit: { keyStage: 'KS3', yearGroup: 'Year 9' },
    lesson: { title: 'The Anglo-German Naval Arms Race' },
    task: {
      marks: 4,
      tariff: '4 marks',
      question: 'Study Interpretations 1 and 2. How do they differ about the causes of the Anglo-German naval arms race? [4 marks]'
    }
  },
  {
    name: 'Great War L3 Q3(c) 4m Reason for Difference',
    unit: { keyStage: 'KS3', yearGroup: 'Year 9' },
    lesson: { title: 'The Anglo-German Naval Arms Race' },
    task: {
      marks: 4,
      tariff: '4 marks',
      question: 'Suggest one reason why Interpretations 1 and 2 differ about the causes of the naval arms race. [4 marks]'
    }
  },
  {
    name: 'Australia L4 Q3(b)&(c) 8m Contrasting Interpretations',
    unit: { keyStage: 'KS3', yearGroup: 'Year 8' },
    lesson: { title: 'The Frontier Wars' },
    task: {
      tariff: 'Question 3(b) & 3(c): Contrasting Interpretations [8 marks • 10 mins]',
      type: 'historical_interpretations',
      question: 'Explain how Interpretations 1 and 2 differ on the nature of the Australian Frontier Wars and suggest why they reach contrasting conclusions. [8 marks]'
    }
  }
];

testTasks.forEach(tc => {
  console.log(`\n========================================`);
  console.log(`TEST: ${tc.name}`);
  const label = sandbox.getTaskStudioLabel(tc.task, 0, false, tc.unit.keyStage === 'KS3');
  const info = sandbox.getTaskTypeInfo(tc.task, tc.unit, tc.lesson);
  console.log(`Label: "${label}"`);
  console.log(`Type: "${info.type}"`);
  console.log(`TariffDesc: "${info.tariffDesc}"`);
  console.log(`Starter: "${info.starter}"`);
  console.log(`Pills:`, info.trackerTerms);
  console.log(`Checklist:`, info.defaultChecklist?.map(c => `${c.letter}: ${c.name}`));
});

