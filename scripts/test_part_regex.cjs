const q0 = '1(a). Describe one key feature...';
const q1 = '1(b). Describe one key feature...';
const q2 = '2. Explain why... [12 marks]';

const regex = /^([0-9]+(?:\([a-z]\))?)\./i;

console.log('q0:', q0.match(regex)?.[1]);
console.log('q1:', q1.match(regex)?.[1]);
console.log('q2:', q2.match(regex)?.[1]);

console.log('/\b2\s*marks?\b/.test("12 marks"):', /\b2\s*marks?\b/.test("12 marks"));
console.log('/\b2\s*marks?\b/.test("2 marks"):', /\b2\s*marks?\b/.test("2 marks"));
console.log('/\b2\s*marks?\b/.test("Q1(a): Feature [2 marks]"):', /\b2\s*marks?\b/.test("Q1(a): Feature [2 marks]"));

