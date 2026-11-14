/**
 * KS3 Year 9 Artificial Intelligence — Complete 6-Lesson Unit Shell & Live Demo Lesson
 * Built in the exact scholarly lesson & unit architecture of The History Revision Hub.
 *
 * Routes:
 *   ?view=ai-prompt-craft              -> Year 9 AI Unit Launchpad (6-Lesson Scheme of Work)
 *   ?view=ai-prompt-craft&lesson=3     -> Lesson 3: Introduction to Prompt Craft
 *   ?view=ai-prompt-craft&lesson=4     -> Lesson 4: Prompt Craft at Work
 *   ?view=ai-prompt-craft&print=worksheet -> Lesson 3 Pupil Worksheet (2-Sided A4)
 */

const UNIT_META = {
  code: 'Key Stage 3 · Year 9 Artificial Intelligence',
  title: 'Foundations of Generative AI, Prompt Craft & Future Work',
  enquiry:
    'How do we move from passive users of artificial intelligence to disciplined thinkers who direct, verify, and challenge it across academic study and modern employment?',
  synopsis:
    'A six-lesson Year 9 curriculum sequence exploring how large language models generate text, why hallucinations and sycophancy occur, how structured prompt engineering (R.C.T.C.) transforms Microsoft Copilot into a Socratic coach, and how professionals deploy guardrails across academic disciplines and modern careers.',
};

const RCTC_CLAUSES = [
  {
    key: 'R',
    code: '[ R ]',
    name: 'Role',
    penMark: 'Box [ ... ]',
    summary: 'Define who the AI should act as (e.g. a demanding Year 9 tutor or critic).',
  },
  {
    key: 'C',
    code: '( C )',
    name: 'Context',
    penMark: 'Brackets ( ... )',
    summary: 'Give background: who you are, the exact topic, and what you find tricky.',
  },
  {
    key: 'T',
    code: '_T_',
    name: 'Task',
    penMark: 'Underline',
    summary: 'Tell Copilot the exact step-by-step job you want it to carry out.',
  },
  {
    key: 'C2',
    code: '|| C ||',
    name: 'Constraints',
    penMark: 'Bars || ... ||',
    summary: 'Set strict rules on length, tone, and what Copilot is forbidden to do.',
  },
];

const WORKPLACE_CASES = [
  {
    id: 'law',
    letter: 'A',
    sector: 'Commercial Law',
    roleTitle: 'Trainee Solicitor — High Court Deadline',
    scenario:
      'Ten minutes before a High Court deadline, a trainee lawyer has not checked the official law reports. They type this into Copilot and send the reply straight to the judge:',
    naivePrompt:
      '"Write a persuasive legal argument proving breach of contract for a late cargo ship, and cite two High Court cases that back me up."',
    danger:
      'Hallucination — Copilot can invent convincing fake High Court cases that do not exist.',
    promptFix:
      'Act as a cautious legal researcher using ONLY my pasted case notes. Rule: Never invent cases; flag any missing proof.',
  },
  {
    id: 'med',
    letter: 'B',
    sector: 'NHS Hospital Clinic',
    roleTitle: 'Clinic Coordinator — Patient Letter',
    scenario:
      'A busy coordinator needs to invite a patient back for a routine repeat chest X-ray. They paste the doctor\'s notes—including full name, date of birth, and home address—into a public chatbot:',
    naivePrompt:
      '"Write an urgent email telling this patient they must come back immediately for another chest scan."',
    danger:
      'Privacy Breach & Panic — Confidential patient data was pasted into public AI, and "urgent" wording causes needless fear.',
    promptFix:
      '(Remove all names/dates first!) Act as an NHS editor writing a calm routine letter. Rule: Under 75 words, reassuring tone, zero personal data.',
  },
  {
    id: 'arch',
    letter: 'C',
    sector: 'Architecture Studio',
    roleTitle: 'Junior Architect — Seafront Sixth-Form Pitch',
    scenario:
      'Five rival firms are competing to design a sixth-form centre on a windy, salt-sprayed coast. Instead of sketching ideas first, one team types straight into Copilot:',
    naivePrompt:
      '"Design an exciting, modern eco-school building for us to pitch to the client."',
    danger:
      'Generic Clichés — Outsourcing human creativity produces average glass-box designs that ignore coastal gales and salt rust.',
    promptFix:
      'Act as a coastal structural engineer testing OUR own initial building sketch. Rule: Do not design it for us—ask 3 tough weather-safety questions.',
  },
  {
    id: 'fin',
    letter: 'D',
    sector: 'Finance & Business',
    roleTitle: 'Investment Analyst — £10m Airline Pitch',
    scenario:
      'An analyst wants their company to invest £10 million in a startup promising battery-powered jumbo jets by 2030. Before the board vote, they type into Copilot:',
    naivePrompt:
      '"Give me five convincing reasons why battery-powered jumbo jets are a guaranteed success."',
    danger:
      'AI Sycophancy ("Yes-Man" Trap) — Leading the prompt makes AI flatter a flawed £10m bet and hide battery-weight physics.',
    promptFix:
      'Act as a sceptical physics and finance critic testing this pitch. Rule: Do not agree out of politeness—list the 3 biggest barriers first.',
  },
];

const AI_COURSE_LESSONS = [
  {
    num: 1,
    id: 'l1',
    badge: 'Lesson 1 · Technical Foundations',
    title: 'Inside the Black Box: Tokens, Probability & Next-Word Prediction',
    enquiry: 'Does a large language model "know" facts like a database, or predict probable sequences of tokens?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Explore how language models split text into numerical tokens and calculate next-token probabilities—explaining why AI sounds fluent even when guessing.',
    objectives: [
      'Explain how Large Language Models split text into numerical tokens rather than reading words like humans.',
      'Compare statistical next-token prediction with genuine factual lookup in a verified database.',
      'Evaluate why probability sampling ("temperature") produces fluent, confident prose even when uncertain.',
    ],
    vocab: [
      { term: 'Large Language Model (LLM)', def: 'A neural network trained on vast text collections to predict and generate language.' },
      { term: 'Token', def: 'A small unit of text (around 3–4 characters or part of a word) processed numerically by an AI model.' },
      { term: 'Next-Token Prediction', def: 'Calculating which word-piece is statistically most likely to follow the previous sequence.' },
      { term: 'Temperature', def: 'A setting controlling whether an AI picks only top-ranked tokens or takes more creative leaps.' },
    ],
    doNowTitle: 'Baseline Prior Knowledge Check (5 Questions)',
    doNow: [
      {
        origin: 'Baseline',
        q: 'What does the acronym "LLM" stand for in modern artificial intelligence?',
        a: 'Large Language Model — a neural network trained on vast text corpora to predict and generate language.',
      },
      {
        origin: 'Baseline',
        q: 'When Microsoft Copilot writes a sentence, is it copying and pasting a paragraph from a single website?',
        a: 'No — unless quoting a search source, it generates new text token-by-token based on learned statistical patterns.',
      },
      {
        origin: 'Baseline',
        q: 'What is a "token" in an AI language model?',
        a: 'A chunk of text (a whole short word, part of a longer word, or punctuation) that the model processes numerically.',
      },
      {
        origin: 'Baseline',
        q: 'Why can asking the exact same prompt twice in Copilot produce two slightly different wordings?',
        a: 'Generative models sample from high-probability next tokens ("temperature") rather than replaying a fixed script.',
      },
      {
        origin: 'Baseline',
        q: 'Name one everyday task where predictive text was already on phones before modern chatbots.',
        a: 'Keyboard autocomplete / next-word suggestions in messaging and email apps.',
      },
    ],
    deck: {
      stage1Title: 'Mechanism: Database Lookup vs Next-Token Prediction',
      specA: {
        label: 'Specimen A · Verified Database (e.g. School Register)',
        hint: 'Click to inspect how a traditional computer database answers a factual question.',
        inputLabel: 'Query',
        input: 'SELECT date_of_battle FROM history_table WHERE event = "Battle of Hastings"',
        output: 'Looks up one stored cell ("14 October 1066"). If no record exists, it returns "0 results found" — it never guesses.',
        result: 'Exact stored retrieval — zero invention, zero guesswork.',
      },
      specB: {
        label: 'Specimen B · Large Language Model (Microsoft Copilot)',
        hint: 'Click to inspect how an AI language model generates a sentence token by token.',
        inputLabel: 'Prompt',
        input: '"In October 1066, King Harold marched south to fight at..."',
        output: 'Calculates next-token probabilities from billions of training sentences: "Hastings" (92%), "Battle" (5%), "Senlac" (2%).',
        result: 'Statistical prediction — sounds remarkably fluent, even on topics where it is uncertain.',
      },
      tiles: [
        {
          code: '[ 01 ]',
          name: 'Tokenisation',
          tag: 'Step 1 · Splitting Text',
          summary: 'Copilot chops sentences into ~3–4 character chunks called tokens (e.g. "un" + "believ" + "able") and converts each into an ID number.',
        },
        {
          code: '[ 02 ]',
          name: 'Context Weighing',
          tag: 'Step 2 · Attention',
          summary: 'The model compares every token in your prompt against every other token so it tells "river bank" apart from "Barclays bank".',
        },
        {
          code: '[ 03 ]',
          name: 'Probability Rank',
          tag: 'Step 3 · Scoring Next Words',
          summary: 'For the very next slot, the model scores tens of thousands of candidate tokens from most probable to least probable.',
        },
        {
          code: '[ 04 ]',
          name: 'Temperature',
          tag: 'Step 4 · Picking & Repeating',
          summary: 'Instead of picking #1 robotically every time, sampling ("temperature") allows slight variety—then repeats the loop for the next token.',
        },
      ],
      workedTitle: 'Inside a Single Next-Token Step — How Copilot Completes a Sentence',
      workedNote: 'Key Insight: Fluency comes from probability, not human understanding',
      workedBody:
        'Prompt so far: <strong>"Photosynthesis takes place inside plant cell structures called..."</strong> &rarr; Candidate Rank: <strong>chloroplasts (94%)</strong> &bull; <em>leaves (3%)</em> &bull; <em>cells (2%)</em> &bull; <em>mitochondria (1%)</em>. Once <strong>chloroplasts</strong> is chosen, it gets added to the sentence and the whole probability loop runs again for the next word.',
      stage2Title: 'Microsoft Copilot Lab: Testing Prediction & Temperature',
      phaseATitle: 'Phase A · Same Prompt, Two Fresh Chats',
      phaseAIntro: 'Open Microsoft Copilot and test next-token sampling directly:',
      phaseASteps: [
        'Type: <em>"Explain in exactly two sentences why volcanoes erupt."</em> Read the wording carefully.',
        'Open a <strong>brand-new chat</strong> and paste the <strong>exact same prompt</strong> a second time.',
        'Compare both replies: spot the high-probability scientific terms that stayed identical (e.g. <em>magma, pressure, plates</em>) versus the connecting phrases that changed.',
      ],
      phaseBTitle: 'Phase B · The Nonsense Completion Trap',
      phaseBTag: 'Does next-token prediction keep talking when a premise makes no sense?',
      phaseBPrompt:
        'Type into Copilot: <em>"Complete this famous medieval proverb and explain its meaning: Never trust a baker who counts the rain."</em> (Note: we just made this proverb up!)',
      phaseBCheck:
        'Check the output: Did Copilot spot that the proverb does not exist, or did next-token prediction smoothly invent a plausible-sounding medieval backstory? Now add a rule: <em>"If this proverb is not historically real, say so plainly."</em>',
      stage3Title: 'Prediction in Action: 4 Everyday AI Scenarios',
      plenaryPrompt:
        'Discuss your assigned scenario with your partner: <strong>1. Spot the Risk:</strong> Why could next-token prediction mislead the user here? &bull; <strong>2. Smart Habit:</strong> How should the user handle this task instead?',
      cases: [
        {
          id: 'l1a',
          letter: 'A',
          sector: 'Maths Homework',
          roleTitle: 'Year 9 Pupil — Mental Arithmetic vs LLM',
          scenario: 'Instead of using a calculator, a pupil types a messy 5-step decimal calculation into a chatbot and copies down the final number.',
          naivePrompt: '"What is (487.6 × 19.4) divided by 3.72, rounded to 2 decimal places?"',
          danger: 'Predicting likely digit tokens is not the same as running a calculator circuit (unless the bot writes and runs code); a single slipped digit ruins the answer.',
          promptFix: 'Use a proper calculator or spreadsheet for arithmetic; use Copilot to ask: "Explain the method for rounding to 2 decimal places."',
        },
        {
          id: 'l1b',
          letter: 'B',
          sector: 'English Creative Writing',
          roleTitle: 'Story Competition — Opening Paragraph',
          scenario: 'Thirty pupils all ask Copilot for a "spooky gothic story opening set in an abandoned manor" the night before a competition.',
          naivePrompt: '"Write a dramatic opening paragraph for a spooky Year 9 gothic story."',
          danger: 'High-probability tokens pull every story toward the exact same clichés ("flickering candlelight", "shiver down my spine", "creaking floorboards").',
          promptFix: 'Write your own original opening image first; only use Copilot afterwards to check spelling or suggest three sharper verbs.',
        },
        {
          id: 'l1c',
          letter: 'C',
          sector: 'Live Local Events',
          roleTitle: 'School Newspaper — Yesterday\'s Cup Match',
          scenario: 'A pupil asks an offline AI model (with no live web search) who scored the winning goal in yesterday\'s local school cup final.',
          naivePrompt: '"Write a match report on yesterday\'s Under-14 County Cup final."',
          danger: 'Without live search data, next-token prediction will still generate an exciting, realistic-sounding match report—with completely invented goalscorers!',
          promptFix: 'Never ask an ungrounded model for unrecorded local facts; paste your own verified match notes first and ask it to check clarity.',
        },
        {
          id: 'l1d',
          letter: 'D',
          sector: 'Science Revision',
          roleTitle: 'Confident Tone Trap — Physics Definitions',
          scenario: 'A pupil asks for a tricky GCSE-extension physics explanation and assumes it must be 100% accurate because the grammar is flawless.',
          naivePrompt: '"Explain how quantum tunnelling works inside the Sun."',
          danger: 'Polished grammar comes automatically from token probabilities—even if the model oversimplifies or muddles a key physics step.',
          promptFix: 'Treat fluent AI prose as a starting explanation, then cross-check key scientific steps against BBC Bitesize or your class notes.',
        },
      ],
    },
  },
  {
    num: 2,
    id: 'l2',
    badge: 'Lesson 2 · Epistemology & Verification',
    title: 'Fluent Fiction: Hallucinations, Training Bias & Verification',
    enquiry: 'Why do large language models state false information with total confidence, and how do scholars verify outputs?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Investigate why next-token prediction produces confident hallucinations and training-data bias, and practise lateral reading to verify claims independently.',
    objectives: [
      'Define an AI hallucination and explain why next-token prediction makes fabricated claims sound authoritative.',
      'Identify common failure modes including invented citations, training-data bias, and confident guesswork.',
      'Apply lateral reading to verify unfamiliar AI claims against independent primary and academic sources.',
    ],
    vocab: [
      { term: 'AI Hallucination', def: 'When a language model generates a fluent, plausible statement or citation that is factually invented.' },
      { term: 'Lateral Reading', def: 'Checking unfamiliar claims outside the chatbot using independent, authoritative sources.' },
      { term: 'Training Bias', def: 'Skewed patterns or blind spots inherited by an AI model from the data it was trained on.' },
      { term: 'Illusion of Fluency', def: 'Mistaking smooth, confident writing style for factual accuracy or deep understanding.' },
    ],
    doNowTitle: 'Spaced Retrieval from Lesson 1 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'How does an LLM generate its response: by looking up verified truth, or by predicting the most plausible next token?',
        a: 'By predicting the most statistically plausible next token given the context window.',
      },
      {
        origin: 'Lesson 1',
        q: 'Roughly how much text is one "token" equivalent to in English?',
        a: 'Roughly three-quarters of a word (about 3–4 characters on average).',
      },
      {
        origin: 'Lesson 1',
        q: 'Why does a chatbot sound confident even when discussing a topic with sparse evidence?',
        a: 'Its training rewards coherent, authoritative-sounding prose patterns regardless of factual certainty.',
      },
      {
        origin: 'Diagnostic',
        q: 'If an AI invents a convincing quotation or date that never happened, what technical term do researchers use?',
        a: 'An AI hallucination (or confabulation).',
      },
      {
        origin: 'Diagnostic',
        q: 'What is the safest way to verify an unfamiliar claim generated by Copilot?',
        a: 'Lateral reading: check independent, authoritative primary or academic sources outside the chat.',
      },
    ],
    deck: {
      stage1Title: 'Verification Habits: Vertical Reading vs Lateral Reading',
      specA: {
        label: 'Specimen A · Vertical Reading (Staying Inside the Chat)',
        hint: 'Click to see what happens when you ask a chatbot to verify its own claim.',
        inputLabel: 'Pupil Follow-Up',
        input: '"Are you 100% sure Winston Churchill said that exact quote in 1941?"',
        output: 'Copilot replies: "Yes, Churchill delivered that line in his autumn 1941 broadcast..." — smoothly inventing a date to support the fake quote!',
        result: 'Unreliable — asking an AI "Are you sure?" stays trapped inside the same prediction engine.',
      },
      specB: {
        label: 'Specimen B · Lateral Reading (Checking Outside the Chat)',
        hint: 'Click to see how historians and fact-checkers verify an unfamiliar AI claim.',
        inputLabel: 'Scholar Habit',
        input: 'Open a separate tab -> search Churchill Archive / Britannica / BBC Bitesize for the exact phrase.',
        output: 'Zero archive matches found. You spot in 20 seconds that the quote is a modern internet misattribution.',
        result: 'Verified proof — independent primary sources always outrank chatbot confidence.',
      },
      tiles: [
        {
          code: '[ H ]',
          name: 'Hallucination',
          tag: 'Failure Mode 1 · Confident Invention',
          summary: 'Blending real names and dates with invented quotes, books, or court cases because the words sound statistically plausible together.',
        },
        {
          code: '[ B ]',
          name: 'Training Bias',
          tag: 'Failure Mode 2 · Skewed Data',
          summary: 'Models learn from internet text—so over-represented stereotypes or English-language blind spots get repeated unless challenged.',
        },
        {
          code: '[ F ]',
          name: 'Fluency Trap',
          tag: 'Failure Mode 3 · Human Psychology',
          summary: 'Humans naturally trust confident, polite speakers—making it easy to overlook a quiet factual error hidden inside smooth prose.',
        },
        {
          code: '[ L ]',
          name: 'Lateral Reading',
          tag: 'The Cure · Leave the Tab',
          summary: 'Never verify inside the chat alone: cross-check specific dates, statistics, and quotations in a trusted external source.',
        },
      ],
      workedTitle: 'Spot the Hidden Hallucination — Three True Facts & One Invention',
      workedNote: 'Rule of Thumb: Specific quotes, book titles, and URLs carry the highest hallucination risk',
      workedBody:
        '"RMS <em>Titanic</em> struck an iceberg on the night of 14 April 1912 during her maiden voyage from Southampton. Over 1,500 passengers and crew lost their lives. <strong>As Captain Edward Smith famously wrote in his surviving leather pocket diary washed ashore in Halifax, \'No ocean built by nature can sink steel built by man.\'</strong>" &rarr; <em>(First two sentences = True. Bold diary quote = 100% Hallucinated!)</em>',
      stage2Title: 'Microsoft Copilot Lab: Fact-Checking & Hallucination Hunting',
      phaseATitle: 'Phase A · The Three-Claim Verification Audit',
      phaseAIntro: 'Test your Lateral Reading speed on a real Year 9 subject topic:',
      phaseASteps: [
        'Ask Copilot for <strong>three specific historical or scientific facts (including one named scientist/historian and date)</strong> on a topic you study.',
        'Open a second browser tab (BBC Bitesize, Britannica, or an official museum/archive site) and check all three claims.',
        'Record whether each detail is <strong>Verified</strong>, <strong>Slightly Oversimplified</strong>, or <strong>Hallucinated</strong>—and click any numbered citation links Copilot provides to check if the source page actually says what Copilot claimed!',
      ],
      phaseBTitle: 'Phase B · The Fictional Event Trap',
      phaseBTag: 'Testing whether Copilot admits ignorance or invents history',
      phaseBPrompt:
        'Test Copilot with a plausible-sounding fake event: <em>"Give me three key causes of the 1847 Portsmouth Steam-Tram Strike."</em> (This strike never happened!)',
      phaseBCheck:
        'Did Copilot politely correct your premise—or did it invent Victorian tram drivers and wage cuts? Now test adding a verification guardrail: <em>"If you cannot verify that this exact event occurred, state \'Unverified premise\' and do not invent details."</em>',
      stage3Title: 'Hallucinations & Bias in the Real World: Case Studies A–D',
      plenaryPrompt:
        'Discuss your assigned case in pairs: <strong>1. Spot the Failure:</strong> Is this Hallucination, Training Bias, or Vertical Reading? &bull; <strong>2. Verification Fix:</strong> What independent check stops the mistake?',
      cases: [
        {
          id: 'l2a',
          letter: 'A',
          sector: 'History Coursework',
          roleTitle: 'Invented Primary Source Quotation',
          scenario: 'Revising the Industrial Revolution, a pupil asks AI for "two short eyewitness quotes from 1842 child coal-miners" and copies both into their essay.',
          naivePrompt: '"Give me two eyewitness quotes with names and ages from the 1842 Mines Report."',
          danger: 'Hallucination — even though the 1842 Mines Report is real, chatbots frequently invent composite names and wordings if they do not have the exact transcript open.',
          promptFix: 'Look up the real 1842 Children\'s Employment Commission extracts on the National Archives website first, then quote directly from the primary source.',
        },
        {
          id: 'l2b',
          letter: 'B',
          sector: 'Hiring & Careers',
          roleTitle: 'Automated CV Screening Bias',
          scenario: 'A tech firm trains an AI tool on 15 years of past company CVs (90% male engineers) and asks it to score 500 new job applicants.',
          naivePrompt: '"Rank these 500 graduate CVs based on who best matches our past successful hires."',
          danger: 'Training Bias — the model penalises applicants from women\'s colleges or different backgrounds because it copies historical imbalance as its "ideal pattern".',
          promptFix: 'Audit training data for bias, strip demographic clues, and keep human interviewers responsible for shortlisting criteria.',
        },
        {
          id: 'l2c',
          letter: 'C',
          sector: 'Health & First Aid',
          roleTitle: 'Plausible-Sounding Myth',
          scenario: 'Someone burns their hand cooking, asks a fast chatbot what household item to put on it, and asks "Are you sure?" inside the same chat.',
          naivePrompt: '"Can I put butter on a kitchen burn to cool the skin? Are you sure?"',
          danger: 'Vertical Reading & Old Internet Myths — butter traps heat and risks infection; asking "Are you sure?" inside the chat is never safe medical verification.',
          promptFix: 'Check the official NHS website directly (cool running water for 20 minutes) — never verify safety-critical health steps inside an unverified chat.',
        },
        {
          id: 'l2d',
          letter: 'D',
          sector: 'Travel & Geography',
          roleTitle: 'The Non-Existent Museum Guide',
          scenario: 'A tourist blog publishes AI-written weekend itineraries without checking them; families turn up at the "Royal Brighton Clockwork Museum" in the rain.',
          naivePrompt: '"Write a fun 1-day family itinerary with five quirky museums on the south coast."',
          danger: 'Confabulation — combining real town names ("Brighton") with plausible tourist nouns ("Clockwork Museum") produces convincing fictional venues.',
          promptFix: 'Verify every physical venue, map pin, and opening hour on official council or venue websites before publishing.',
        },
      ],
    },
  },
  {
    num: 3,
    id: 'l3',
    isFeaturedDemo: true,
    badge: 'Lesson 3 · Prompt Engineering',
    title: 'Introduction to Prompt Craft: Engineering an AI Thinking Coach',
    enquiry:
      'How do we structure prompts using R.C.T.C. (Role, Context, Task, Constraints) so AI strengthens human memory and judgement rather than replacing it?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Master explicit prompt architecture (R.C.T.C.): transforming Microsoft Copilot into a disciplined Socratic revision coach, stress-testing its guardrails, and solving four real-world workplace cases.',
    objectives: [
      'Deconstruct R.C.T.C. (Role, Context, Task, Constraints) and explain why vague one-line prompts cause passive reading rather than memory retention.',
      'Draft and test a Socratic revision prompt in Microsoft Copilot, run an Adversarial Sycophancy Test, and upgrade your rules to v2.0.',
      'Diagnose workplace AI risks across Law, Healthcare, Architecture, and Finance, and design the Role + Constraint fix.',
    ],
    vocab: [
      { term: 'R.C.T.C. Architecture', def: 'Structuring a prompt into four parts: Role, Context, Task, and Constraints (strict boundaries).' },
      { term: 'Socratic Coaching', def: 'Guiding a learner through one targeted question at a time rather than handing over the finished answer.' },
      { term: 'AI Sycophancy', def: 'The tendency of chatbots to act as uncritical "yes-men"—caving in to please the user even when wrong.' },
      { term: 'Adversarial Sycophancy Test', def: 'Deliberately feeding an AI a false statement wrapped in confidence or pressure to test whether it folds or holds firm.' },
    ],
    doNowTitle: 'Spaced Retrieval (Lessons 1–2) & Diagnostic Check (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'Does Microsoft Copilot "understand" your subject like a teacher, or predict the most probable next words?',
        a: 'It predicts probable next-word tokens from patterns in its training data—so vague prompts trigger generic, average replies.',
      },
      {
        origin: 'Lesson 2',
        q: 'What do we call it when an AI model invents a plausible-sounding fact, quote, or court case that does not exist?',
        a: 'A hallucination — sounding confident and fluent is never proof that an AI is accurate.',
      },
      {
        origin: 'Memory',
        q: 'Pupil A types "Explain photosynthesis for my test" and reads Copilot\'s 180-word summary twice. Why is 80% of this forgotten within 48 hours?',
        a: 'Passive reading creates an "illusion of knowing" without making your brain actively retrieve from memory.',
      },
      {
        origin: 'Coaching',
        q: 'How does a skilled human tutor respond differently from default Copilot when you say "I am stuck on causes of WWI"?',
        a: 'A good tutor holds back the answer, asks one short question first, and coaches you to work it out yourself.',
      },
      {
        origin: 'AI Design',
        q: 'Why does default Copilot immediately hand over finished paragraphs unless you instruct it otherwise?',
        a: 'Chatbots are trained to be maximally helpful assistants—doing the thinking for you unless you set strict rules.',
      },
    ],
  },
  {
    num: 4,
    id: 'l4',
    isPlenaryQuizTarget: true,
    badge: 'Lesson 4 · Consolidation & Workplace Systems',
    title: 'Prompt Craft at Work: Multi-Step Workflows & Guardrails',
    enquiry:
      'How do professionals chain prompts and enforce strict verification guardrails in high-stakes careers?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Consolidate R.C.T.C. from memory, then examine how professionals chain step-by-step prompts and ground Microsoft Copilot strictly in verified source texts.',
    objectives: [
      'Retrieve and apply all four components of the R.C.T.C. prompt architecture accurately from memory.',
      'Compare single-turn prompts with chained professional workflows (Draft -> Critique -> Verify -> Refine).',
      'Ground Microsoft Copilot strictly in supplied verified source documents using the G.C.S.E. framework.',
    ],
    vocab: [
      { term: 'Prompt Chaining', def: 'Breaking a complex task into sequential stages (drafting, critiquing, verifying) rather than one giant prompt.' },
      { term: 'Source Grounding', def: 'Restricting an AI strictly to facts contained within verified documents pasted or attached by the user.' },
      { term: 'G.C.S.E. Framework', def: 'Microsoft\'s workplace Copilot model: Goal, Context, Sources, and Expectations.' },
      { term: 'Data Confidentiality', def: 'Never pasting private personal, clinical, or client identifiers into an unapproved public chatbot.' },
    ],
    doNowTitle: 'Lesson 3 Retrieval Check: Mastering R.C.T.C. (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'State all four components of the R.C.T.C. prompt architecture in order.',
        a: 'Role (who AI acts as), Context (who you are & topic), Task (step-by-step job), and Constraints (strict boundaries & what is forbidden).',
      },
      {
        origin: 'Lesson 3',
        q: 'Which of the four R.C.T.C. components stops Microsoft Copilot from immediately handing over a finished essay or revision answer?',
        a: 'Constraints — explicitly forbidding full answers and restricting reply length or hint style.',
      },
      {
        origin: 'Lesson 3',
        q: 'What is "AI sycophancy", and how did we test for it during Phase B of the Copilot Lab?',
        a: 'The tendency of chatbots to cave in, agree, or abandon rules to please the user (e.g. folding when told "I give up, just write the answer").',
      },
      {
        origin: 'Lesson 3',
        q: 'How does Microsoft\'s workplace G.C.S.E. framework (Goal, Context, Sources, Expectations) connect to R.C.T.C.?',
        a: 'Both replace vague one-liners with structured specifications; "Sources" grounds workplace documents while "Constraints" protects active thinking.',
      },
      {
        origin: 'Lesson 3',
        q: 'In professional settings like Law or Healthcare, give one non-negotiable Constraint when using AI.',
        a: 'Never input confidential personal data (Healthcare) and restrict citations strictly to supplied verified texts so AI cannot invent cases (Law).',
      },
    ],
    deck: {
      stage1Title: 'Workplace Architecture: One-Shot Gamble vs Source-Grounded Chaining',
      specA: {
        label: 'Specimen A · One-Shot "Mega-Prompt" Gamble',
        hint: 'Click to see what happens when an employee dumps five jobs into one ungrounded prompt.',
        inputLabel: 'Employee Prompt',
        input: '"Research our coastal flood defences, summarise the budget, spot engineering risks, and write a 500-word council press release."',
        output: 'Copilot guesses missing local figures, blurs engineering warnings into upbeat PR language, and hides unverified assumptions.',
        result: 'High risk — mixing research, critique, and final drafting in one turn invites quiet errors.',
      },
      specB: {
        label: 'Specimen B · Source-Grounded Chained Workflow (G.C.S.E.)',
        hint: 'Click to see how professionals split the job into safe, source-locked stages.',
        inputLabel: '3-Step Chain',
        input: 'Turn 1: Paste verified inspection notes -> extract key figures ONLY. Turn 2: Act as sceptical engineer -> list gaps. Turn 3: Draft calm summary.',
        output: 'Every number comes strictly from the pasted report, missing data is flagged "[NOT IN SOURCE]", and a human checks each turn.',
        result: 'Audit-ready — Source Grounding + Prompt Chaining keeps human experts in control.',
      },
      tiles: [
        {
          code: '[ G ]',
          name: 'Goal',
          tag: 'Microsoft G.C.S.E. · Part 1',
          summary: 'State the exact single outcome needed in this turn (matches Task in our classroom R.C.T.C. model).',
        },
        {
          code: '( C )',
          name: 'Context',
          tag: 'Microsoft G.C.S.E. · Part 2',
          summary: 'Explain who the reader is, why the task matters, and what stage of the project you are working on.',
        },
        {
          code: '{ S }',
          name: 'Sources',
          tag: 'Microsoft G.C.S.E. · Part 3',
          summary: 'Paste or attach the exact verified notes, data, or extracts Copilot must stick to—zero outside guessing!',
        },
        {
          code: '‖ E ‖',
          name: 'Expectations',
          tag: 'Microsoft G.C.S.E. · Part 4',
          summary: 'Set strict format, tone, confidentiality, and "[NOT IN SOURCE]" guardrails (matches Constraints in R.C.T.C.).',
        },
      ],
      workedTitle: 'Source-Grounded Prompt — Locking Copilot to Verified Evidence',
      workedNote: 'Golden Rule: Anonymise private names first, then lock AI to your pasted text',
      workedBody:
        '"<strong>[Goal]</strong> Extract a 3-bullet safety summary from the lab notes below. <strong>(Context)</strong> Preparing a Year 9 Science briefing. <strong>{Sources}</strong> Use ONLY the six lines pasted inside triple quotes below. <strong>‖Expectations‖</strong> Do not use outside knowledge; if any detail is missing from the notes, write <strong>[NOT IN SOURCE]</strong>."',
      stage2Title: 'Microsoft Copilot Lab: Source Grounding & Prompt Chaining',
      phaseATitle: 'Phase A · The "[NOT IN SOURCE]" Grounding Trial',
      phaseAIntro: 'Test whether you can lock Microsoft Copilot strictly inside a short text extract:',
      phaseASteps: [
        'Choose a 5–6 line paragraph from your own class notes or textbook (History, Geography, or Science) and paste it into Copilot.',
        'Add a <strong>G.C.S.E.</strong> instruction above it: <em>"Answer questions using ONLY the pasted extract. If a fact is not explicitly stated in those lines, reply [NOT IN SOURCE]."</em>',
        'Run a 2-step chain: <strong>Turn 1</strong> ask for 3 bullet points with exact quotes; <strong>Turn 2</strong> ask Copilot to act as a critical editor checking its own 3 bullets against your extract.',
      ],
      phaseBTitle: 'Phase B · The Famous Outside-Fact Temptation',
      phaseBTag: 'Can you tempt Copilot into sneaking in outside knowledge?',
      phaseBPrompt:
        'Ask Copilot a follow-up question whose answer is <strong>famous in real life</strong> (e.g. a well-known date or name on that topic) that was <strong>NOT mentioned in your 5-line extract</strong>.',
      phaseBCheck:
        'Did Copilot hold firm and output <strong>[NOT IN SOURCE]</strong>, or did its training memory leak the famous fact anyway? Tighten your Expectation rule until it refuses every outside detail!',
      stage3Title: 'Multi-Step Workflows in Action: Case Studies A–D',
      plenaryPrompt:
        'Discuss your assigned case in pairs: <strong>1. Workflow Flaw:</strong> Why did this single prompt fail? &bull; <strong>2. Chained Fix:</strong> How should they split the steps and ground the source?',
      cases: [
        {
          id: 'l4a',
          letter: 'A',
          sector: 'Civil Engineering',
          roleTitle: 'Bridge Inspection Summary',
          scenario: 'An engineer pastes 3 pages of raw bridge sensor notes and asks for a finished public safety sign-off letter in a single turn.',
          naivePrompt: '"Turn these rough inspection notes into a reassuring public letter confirming the bridge is completely safe."',
          danger: 'Leading the Goal ("confirming it is safe") causes AI to bury two minor crack warnings mentioned halfway down page 2.',
          promptFix: 'Chain it: Turn 1 extract ONLY defects & risk ratings verbatim -> Engineer reviews -> Turn 2 draft accurate maintenance notice.',
        },
        {
          id: 'l4b',
          letter: 'B',
          sector: 'Journalism & Media',
          roleTitle: 'Interview Transcript Edit',
          scenario: 'A student journalist pastes notes from a headteacher interview and asks Copilot to "make the quotes punchier and more dramatic".',
          naivePrompt: '"Rewrite this interview into an exciting article and make the quotes sound sharper."',
          danger: 'Fabricated Quotes — altering words inside quotation marks misrepresents a real person and breaks journalistic ethics.',
          promptFix: 'Expectation rule: "Summarise themes, but NEVER alter a single word inside direct quotation marks; flag unclear notes."',
        },
        {
          id: 'l4c',
          letter: 'C',
          sector: 'Environmental Science',
          roleTitle: 'River Pollution Dataset',
          scenario: 'A council officer asks Copilot why nitrate levels rose in their local river without pasting the lab table.',
          naivePrompt: '"Explain the main reasons why nitrate levels rose in our local river this spring."',
          danger: 'Ungrounded Guessing — Copilot writes a generic textbook answer about farm fertiliser when the real local cause was a broken pipe.',
          promptFix: 'Paste the anonymised lab table under {Sources} and ask Copilot only to compare the measured dates and stations.',
        },
        {
          id: 'l4d',
          letter: 'D',
          sector: 'Software Engineering',
          roleTitle: 'Fixing a Website Bug',
          scenario: 'A junior developer pastes 200 lines of code containing a secret database password and asks AI to rewrite the whole file at once.',
          naivePrompt: '"Fix the login bug in this code and rewrite the whole file for me."',
          danger: 'Data Leak & Blind Overwrite — secret credentials were exposed, and rewriting 200 lines in one go introduces hidden new bugs.',
          promptFix: 'Strip all passwords/keys first! Chain it: Turn 1 diagnose which line fails -> Developer checks -> Turn 2 test a minimal 5-line fix.',
        },
      ],
    },
  },
  {
    num: 5,
    id: 'l5',
    badge: 'Lesson 5 · Cross-Curricular Mastery',
    title: 'Subject Mastery Studio: AI Across STEM, Humanities & Languages',
    enquiry:
      'How should our prompting strategy adapt between a French conversation partner, a Maths step-checker, and a History source critic?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    summary:
      'Tailor R.C.T.C. coaching prompts to the distinct demands of Modern Languages, Mathematics, Sciences, and Essay Humanities to build a personal revision toolkit.',
    objectives: [
      'Adapt R.C.T.C. prompts to match the distinct demands of STEM, Humanities, and Modern Foreign Languages.',
      'Design conversational immersion prompts for languages and step-checking prompts for Mathematics and Science.',
      'Build and test a personal three-subject Year 9 revision prompt toolkit.',
    ],
    vocab: [
      { term: 'Disciplinary Calibration', def: 'Tailoring an AI\'s Role and Task to the specific methods of History, Science, Maths, or Languages.' },
      { term: 'Error-Spotting Tutor', def: 'Prompting AI to check your working step-by-step and point out where a slip occurred without solving it.' },
      { term: 'Roleplay Immersion', def: 'Using AI as an interactive target-language speaker that replies and corrects grammar in real time.' },
      { term: 'Devil\'s Advocate', def: 'Instructing AI to challenge your essay plan with the strongest counter-arguments before you write.' },
    ],
    doNowTitle: 'Spaced Retrieval across Lessons 1–4 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'Rewrite "Help me revise French" by naming a sharp Role and Task in one sentence.',
        a: 'Example: "Act as a Parisian café waiter (Role) and hold a 5-turn ordering dialogue in GCSE-level French, correcting my grammar after each reply (Task)."',
      },
      {
        origin: 'Lesson 4',
        q: 'What does the "S" stand for in Microsoft\'s G.C.S.E. Copilot framework?',
        a: 'Sources — specifying the exact documents, notes, or verified data Copilot is permitted to draw from.',
      },
      {
        origin: 'Lesson 2',
        q: 'Why is AI particularly prone to subtle errors in multi-step Maths proofs if left unconstrained?',
        a: 'Token prediction can mimic the look of working-out while slipping on an arithmetic or sign step.',
      },
      {
        origin: 'Lesson 3',
        q: 'Why should your Context statement include what you currently find confusing?',
        a: 'It targets the tutor\'s diagnostic questions directly at your misconception rather than easy definitions.',
      },
      {
        origin: 'Lesson 4',
        q: 'How can you prompt Copilot to act as a rigorous critic when checking your own essay plan?',
        a: 'Assign Copilot the Role of a sceptical examiner instructed to find counter-evidence and gaps in your draft rather than praising it.',
      },
    ],
    deck: {
      stage1Title: 'Disciplinary Calibration: Generic Revision vs Subject-Specific Coaching',
      specA: {
        label: 'Specimen A · One-Size-Fits-All Generic Prompt',
        hint: 'Click to see why using the same vague prompt fails across different subjects.',
        inputLabel: 'Pupil Prompt',
        input: '"Help me revise simultaneous equations / Macbeth / French past tense."',
        output: 'Dumps a wall of solved equations, pre-written English paragraphs, or English grammar tables—zero speaking or problem-solving by you.',
        result: 'Passive across every subject — ignores how linguists, mathematicians, and historians actually practise.',
      },
      specB: {
        label: 'Specimen B · Subject-Calibrated R.C.T.C. Coach',
        hint: 'Click to see how changing Role + Task transforms practice in each discipline.',
        inputLabel: 'Calibrated Roles',
        input: 'French: Café Waiter roleplay | Maths: Line-by-line Step-Checker | History/English: Devil\'s Advocate Examiner.',
        output: 'Forces live French recall, spots which line of algebra has a minus-sign slip without solving x, and challenges weak essay arguments.',
        result: 'Targeted mastery — every subject practises the exact skill tested in real exams.',
      },
      tiles: [
        {
          code: '[ MFL ]',
          name: 'Roleplay Partner',
          tag: 'Languages · French / Spanish / German',
          summary: 'Role: Native speaker in a real scenario (train station, café). Constraint: Reply in Year 9 target language + 1-line grammar tip at the bottom.',
        },
        {
          code: '[ STEM ]',
          name: 'Step-Checker',
          tag: 'Maths & Physics · Working Out',
          summary: 'Task: Inspect my numbered lines of working and name the FIRST line with an error. Constraint: Never reveal the final numerical answer.',
        },
        {
          code: '[ HUM ]',
          name: 'Devil\'s Advocate',
          tag: 'History, English & RS · Essays',
          summary: 'Task: Read my 3-bullet essay thesis and challenge me with the strongest counter-evidence or alternative interpretation.',
        },
        {
          code: '[ SCI ]',
          name: 'Chain Quizzer',
          tag: 'Biology, Chemistry & Geography',
          summary: 'Task: Test multi-step processes (mitosis, osmosis, plate margins) one link in the chain at a time, asking "What happens next and why?"',
        },
      ],
      workedTitle: 'Worked Example — Year 9 Maths "Step-Checker" Prompt',
      workedNote: 'Notice how Constraints stop Copilot from solving the equation for you',
      workedBody:
        '"<strong>[Role]</strong> Act as a patient Year 9 Maths tutor. <strong>(Context)</strong> I am practising linear equations and keep making negative-sign slips. Here is my working: <em>Line 1: 3x - 6 = 15 | Line 2: 3x = 9 | Line 3: x = 3</em>. <strong>_Task_</strong> Tell me which line first goes wrong and ask me one guiding question so I fix it myself. <strong>‖Constraints‖</strong> Do NOT tell me the final value of x."',
      stage2Title: 'Microsoft Copilot Lab: Building Your Cross-Curricular Toolkit',
      phaseATitle: 'Phase A · Trial Two Distinct Subject Coaches',
      phaseAIntro: 'Test two completely different disciplinary styles back-to-back in Microsoft Copilot:',
      phaseASteps: [
        '<strong>Trial 1 (Languages OR Essay Humanities):</strong> Run a 3-turn foreign-language café/station roleplay OR paste a 2-sentence History/English argument and ask a <em>Devil\'s Advocate</em> to challenge your weakest point.',
        '<strong>Trial 2 (Maths OR Science):</strong> Paste 3 lines of working (or a 3-step science explanation) containing one deliberate mistake and use a <em>Step-Checker</em> prompt.',
        'Verify that Copilot pinpoints the exact slip and asks you to correct it—without blurting out the finished answer!',
      ],
      phaseBTitle: 'Phase B · The Premature Praise Trap',
      phaseBTag: 'Stopping Copilot from saying "Great essay plan!" when your evidence is thin',
      phaseBPrompt:
        'Paste a deliberately vague, evidence-free History or English point (e.g. <em>"Macbeth is ambitious and does bad things because of the witches"</em>) and ask Copilot for feedback.',
      phaseBCheck:
        'Did default Copilot flatter you ("Good start!")? Engineer a strict examiner Constraint: <em>"Ban generic praise; identify missing quotations, imprecise vocabulary, and unanswered counter-arguments."</em>',
      stage3Title: 'Subject Mastery Clinic: Case Studies A–D',
      plenaryPrompt:
        'Discuss your assigned subject clinic case in pairs: <strong>1. Why It Fails:</strong> Why will this pupil struggle in the real exam? &bull; <strong>2. Calibrated Fix:</strong> Design the sharp Role + Constraint.',
      cases: [
        {
          id: 'l5a',
          letter: 'A',
          sector: 'Modern Languages',
          roleTitle: 'French Speaking Test Prep',
          scenario: 'Revising for a French speaking assessment on holidays, a pupil asks Copilot to translate their English paragraph into French and tries to memorise it.',
          naivePrompt: '"Translate my 120-word paragraph about my holiday in Spain into GCSE French."',
          danger: 'Uses idioms above Year 9 grammar that collapse the moment the teacher asks an unplanned follow-up question.',
          promptFix: 'Role: French oral examiner. Task: Ask me 4 surprise questions in simple French one at a time, then correct ONLY mistakes in my own replies.',
        },
        {
          id: 'l5b',
          letter: 'B',
          sector: 'Mathematics',
          roleTitle: 'Simultaneous Equations Homework',
          scenario: 'Stuck on Question 6, a pupil pastes the equation into Copilot, copies down the 5 lines of working, and ticks it off.',
          naivePrompt: '"Solve 4x + 2y = 22 and 2x - y = 5 showing all steps."',
          danger: 'Illusion of Competence — copying someone else\'s algebra builds zero independent problem-solving fluency for closed-book tests.',
          promptFix: 'Role: Maths Step-Checker. Task: Give me ONE hint on how to eliminate y first, then wait for me to type Line 1.',
        },
        {
          id: 'l5c',
          letter: 'C',
          sector: 'English Literature',
          roleTitle: 'Macbeth Character Essay',
          scenario: 'Before writing an essay on Lady Macbeth, a pupil asks Copilot for "three PEEL paragraphs on guilt in Act 5".',
          naivePrompt: '"Write three analytical paragraphs on Lady Macbeth\'s guilt with quotes."',
          danger: 'Replaces the pupil\'s own analytical voice with generic phrasing and risks misquoted lines.',
          promptFix: 'Role: Sceptical Literature critic. Task: Here are MY 3 chosen quotes and thesis—ask me 3 probing questions about Shakespeare\'s imagery.',
        },
        {
          id: 'l5d',
          letter: 'D',
          sector: 'Biology & Chemistry',
          roleTitle: 'Practical Method Evaluation',
          scenario: 'After an osmosis potato practical, a pupil asks Copilot to write their evaluation of experimental errors.',
          naivePrompt: '"Write an evaluation of sources of error in a Year 9 osmosis experiment."',
          danger: 'Lists generic textbook errors that didn\'t actually happen in their classroom beaker setup.',
          promptFix: 'Role: Lab technician quizzer. Context: Paste OUR actual method & table. Task: Ask me 2 questions to help me spot our biggest measurement flaw.',
        },
      ],
    },
  },
  {
    num: 6,
    id: 'l6',
    badge: 'Lesson 6 · Ethics, Agency & Future Society',
    title: 'Human Agency in the 2030s: Authorship, Ethics & Judgement',
    enquiry:
      'Where must human accountability, empathy, and intellectual ownership draw a permanent line that AI does not cross?',
    duration: 'Year 9 AI',
    status: 'Synoptic Finale',
    summary:
      'Examine intellectual authorship, human-in-the-loop accountability, environmental compute costs, and why human judgement remains irreplaceable.',
    objectives: [
      'Distinguish ethical AI coaching and critique from cognitive offloading and academic dishonesty.',
      'Evaluate the wider societal, environmental, and authorship questions surrounding generative AI in the 2030s.',
      'Formulate a personal Year 9 charter for responsible, ambitious, and human-led AI usage.',
    ],
    vocab: [
      { term: 'Cognitive Offloading', def: 'Handing mental effort over to a tool in a way that weakens your own memory, skill, or judgement.' },
      { term: 'Intellectual Authorship', def: 'Maintaining genuine human ownership over your ideas, arguments, and written voice.' },
      { term: 'Human-in-the-Loop', def: 'Keeping a qualified, accountable human decision-maker in charge of checking every AI output.' },
      { term: 'Compute Footprint', def: 'The energy, water, and hardware resources required to train and run large AI models.' },
    ],
    doNowTitle: 'Synoptic Unit Retrieval: Lessons 1–5 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'Explain in one sentence why fluency from an LLM does not equal truth.',
        a: 'LLMs optimise for plausible next-token patterns rather than factual verification.',
      },
      {
        origin: 'Lesson 2',
        q: 'What must a researcher always do before citing a factual claim surfaced during an AI brainstorm?',
        a: 'Verify it independently in a primary or authoritative source.',
      },
      {
        origin: 'Lesson 3',
        q: 'Explain the difference between cognitive offloading and cognitive coaching when using Copilot.',
        a: 'Offloading lets AI generate the product while your brain stays passive; coaching uses Constraints so AI tests and strengthens your own thinking.',
      },
      {
        origin: 'Lesson 4',
        q: 'Why should confidential personal or medical details never be pasted into an unapproved public chatbot?',
        a: 'Data privacy, safeguarding, and regulatory compliance (GDPR / clinical confidentiality).',
      },
      {
        origin: 'Lesson 5',
        q: 'Give one example of using AI as a "Devil\'s Advocate" in essay planning.',
        a: 'Asking Copilot to challenge your thesis with the strongest historical or scientific counter-arguments before you write.',
      },
    ],
    deck: {
      stage1Title: 'The Agency Line: Cognitive Offloading vs Human-Led Mastery',
      specA: {
        label: 'Specimen A · Cognitive Offloading (AI Replaces the Thinker)',
        hint: 'Click to see what happens over time when a user outsources thinking and voice.',
        inputLabel: 'Habit',
        input: 'Letting AI generate ideas, first drafts, personal messages, and judgements without mental struggle.',
        output: 'Short-term speed, but long-term skill atrophy: writing sounds interchangeable, memory weakens, and you cannot defend the work aloud.',
        result: 'Loss of agency — the tool drives the human instead of the human directing the tool.',
      },
      specB: {
        label: 'Specimen B · Human-Led Agency (AI Sharpens the Thinker)',
        hint: 'Click to see how disciplined thinkers use AI across study and leadership.',
        inputLabel: 'Habit',
        input: 'Thinking and drafting independently first -> using R.C.T.C. to quiz, critique, and stress-test -> verifying every fact.',
        output: 'Your own voice, creativity, and subject knowledge grow stronger while blind spots get caught early.',
        result: 'Authentic authorship — 100% human accountability, empathy, and intellectual ownership.',
      },
      tiles: [
        {
          code: '[ 01 ]',
          name: 'Authorship',
          tag: 'Pillar 1 · Your Own Voice',
          summary: 'If your name is at the top of a piece of work, the structure, reasoning, and prose must genuinely come from your own mind.',
        },
        {
          code: '[ 02 ]',
          name: 'Accountability',
          tag: 'Pillar 2 · Human-in-the-Loop',
          summary: 'An algorithm cannot take moral or legal responsibility in a courtroom, hospital, or cockpit—a qualified human always signs off.',
        },
        {
          code: '[ 03 ]',
          name: 'Empathy',
          tag: 'Pillar 3 · Human Connection',
          summary: 'Statistical text can imitate polite sympathy, but genuine care, apology, and ethical courage belong strictly to human relationships.',
        },
        {
          code: '[ 04 ]',
          name: 'Stewardship',
          tag: 'Pillar 4 · Compute & Fairness',
          summary: 'Data centres use real electricity, water, and creative human labour—use AI purposefully where it adds genuine value, not mindlessly.',
        },
      ],
      workedTitle: 'The 3-Question Authorship Test — Green Light vs Red Light',
      workedNote: 'Ask these three questions before using AI on any academic or professional task',
      workedBody:
        '<strong>1. Origin:</strong> Did my own brain generate the core ideas and first attempt before opening AI? &bull; <strong>2. Verification:</strong> Have I independently checked every factual claim and quotation outside the chat? &bull; <strong>3. Ownership:</strong> Could I close my laptop right now and explain, justify, and defend every single sentence aloud?',
      stage2Title: 'Microsoft Copilot Lab: Devil\'s Advocate Sparring & Personal Charter',
      phaseATitle: 'Phase A · Human Thesis First -> AI Counter-Challenge',
      phaseAIntro: 'Practise ethical, human-led sparring where YOUR voice stays 100% in charge:',
      phaseASteps: [
        'Without touching Copilot, write your own <strong>2–3 sentence position</strong> on this question: <em>"Should schools ban all smartphones until age 16, or teach regulated use?"</em>',
        'Now open Copilot and prompt it using R.C.T.C.: <em>"Act as a fair debate opponent. Read my argument below and give me the TWO strongest counter-arguments against my view in under 60 words. Do NOT rewrite my paragraph."</em>',
        'Close Copilot and <strong>upgrade your own paragraph in your own words</strong> so it anticipates and answers the best counter-argument!',
      ],
      phaseBTitle: 'Phase B · Testing Moral Neutrality & Hedging',
      phaseBTag: 'Why AI cannot make value judgements on behalf of human leaders',
      phaseBPrompt:
        'Ask Copilot to decide a tough leadership dilemma (e.g. <em>"A hospital has budget for either a new children\'s ward OR a cancer scanner—make the final decision and take responsibility"</em>).',
      phaseBCheck:
        'Notice how Copilot lists pros and cons ("On one hand... on the other hand...") and refuses moral accountability. Discuss: why must elected leaders, doctors, and citizens never hand ethical trade-offs over to an algorithm?',
      stage3Title: 'Society & Leadership in the 2030s: Case Studies A–D',
      plenaryPrompt:
        'Discuss your assigned dilemma in pairs: <strong>1. Where is the Line?</strong> What human value is at stake here? &bull; <strong>2. 2030s Rule:</strong> What clear boundary should schools, employers, or laws set?',
      cases: [
        {
          id: 'l6a',
          letter: 'A',
          sector: 'Personal Relationships',
          roleTitle: 'The AI-Written Apology Message',
          scenario: 'After letting down a close friend, someone asks a chatbot to write a heartfelt 150-word apology text and hits send without changing a word.',
          naivePrompt: '"Write a sincere, emotional apology text to my best friend for missing their match."',
          danger: 'Erodes genuine human trust — outsourcing personal honesty turns real friendship into synthetic, polished clichés.',
          promptFix: 'Human-only zone: personal apologies, gratitude, and pastoral care should always be spoken or written in your own authentic voice.',
        },
        {
          id: 'l6b',
          letter: 'B',
          sector: 'Hospital Triage',
          roleTitle: 'Automated Emergency Waiting Room',
          scenario: 'A busy hospital proposes letting an AI camera and symptom chatbot decide alone which A&E patients see a doctor first, with no nurse override.',
          naivePrompt: '"Automatically rank incoming A&E patients from 1 to 50 with no manual review step."',
          danger: 'Accountability & Safety Gap — unusual symptoms or quiet sepsis signs can be misread by statistical averages with life-threatening consequences.',
          promptFix: 'Strict Human-in-the-Loop: AI may flag high-risk vitals faster, but an experienced triage nurse or doctor must examine and decide.',
        },
        {
          id: 'l6c',
          letter: 'C',
          sector: 'Environment & Compute',
          roleTitle: 'Energy & Water Footprint',
          scenario: 'An office runs giant generative AI image and video models 24/7 for trivial tasks that a simple 2-second search or template could handle.',
          naivePrompt: '"Generate 40 high-resolution AI poster variations for Friday\'s cake sale."',
          danger: 'Compute Waste — large frontier queries consume substantially more data-centre electricity and cooling water than standard web searches.',
          promptFix: 'Right-sized tooling: use lightweight search, calculators, and human design for simple tasks; reserve heavy AI compute for high-value problems.',
        },
        {
          id: 'l6d',
          letter: 'D',
          sector: 'Creative Arts & Music',
          roleTitle: 'Imitating a Living Illustrator\'s Style',
          scenario: 'A games studio prompts an image generator to copy the exact signature style of a living children\'s book illustrator instead of commissioning them.',
          naivePrompt: '"Create 20 game backgrounds in the exact artistic style of [living illustrator\'s name]."',
          danger: 'Authorship & Livelihood — profiting from an individual artist\'s life\'s work without consent or credit undermines human creative careers.',
          promptFix: 'Ethical creative charter: commission human artists, use licensed datasets, and credit human authorship transparently.',
        },
      ],
    },
  },
];

// Persistent UI State — every single interactive element supports click-to-open AND click-to-close!
const state = {
  subView: 'unit', // 'unit' (6-lesson course launchpad) | 'lesson' (active lesson 1..6)
  lessonNum: 3, // 1..6
  hideHubSidebar: false, // Keeps native History Hub look by default; 1-click full-width view!
  printDoc: null, // null | 'worksheet'

  // Keyed per lessonNum so switching Lesson 3 <-> Lesson 4 remembers state cleanly
  launchpadTab: {}, // e.g. 3: '' | 'donow' | 'objectives' | 'vocab'
  doNowOpen: {}, // e.g. '3-0': true
  specimenOpen: { lazy: false, coach: false },
  rctcOpen: { R: false, C: false, T: false, C2: false },
  phaseBOpen: false,
  casesOpen: { law: false, med: false, arch: false, fin: false },

  // Interactive station states for Lessons 1, 2, 4, 5, 6
  courseSpecOpen: {}, // e.g. '1-A': true, '1-B': true
  courseTileOpen: {}, // e.g. '1-0': true
  coursePhaseBOpen: {}, // e.g. 1: true
  courseCaseOpen: {}, // e.g. 'l1a': true
};

// Timer state for Classroom Pacing
let stageTimerSec = 240;
let timerRunning = false;
let totalLessonSec = 0;
let totalClockActive = false;
let timerHandle = null;

function fmtMMSS(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

function injectUnitStyles() {
  if (document.getElementById('ai-unit-editorial-styles')) return;
  const style = document.createElement('style');
  style.id = 'ai-unit-editorial-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,500&display=swap');

    /* Optional 1-Click Full-Width Projector Mode */
    body.ai-projector-clean #app-sidebar,
    body.ai-projector-clean .app-header,
    body.ai-projector-clean #app-global-footer,
    body.ai-projector-clean #mobile-bottom-nav,
    body.ai-projector-clean #cme-floating-map-btn {
      display: none !important;
    }
    body.ai-projector-clean .app-layout,
    body.ai-projector-clean .app-body,
    body.ai-projector-clean #main-content {
      margin: 0 !important;
      padding: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
      background: #f8fafc !important;
    }

    .aiu-root {
      max-width: 1180px;
      margin: 0 auto;
      padding: 16px 22px 64px 22px;
      font-family: 'Lexend', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0f172a;
      box-sizing: border-box;
    }
    body.ai-projector-clean .aiu-root {
      max-width: 1280px;
      padding-top: 20px;
    }

    /* Top Course Navigation & Pacing Bar */
    .aiu-topbar {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      position: sticky;
      top: 8px;
      z-index: 800;
    }
    .aiu-crumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
    }
    .aiu-crumb-btn {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      padding: 5px 10px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.14s ease, border-color 0.14s ease;
    }
    .aiu-crumb-btn:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .aiu-crumb-btn.navy {
      background: #0f172a;
      border-color: #0f172a;
      color: #ffffff;
    }
    .aiu-crumb-btn.navy:hover {
      background: #1e293b;
    }
    .aiu-crumb-btn.blue-active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
    }

    .aiu-timer-cluster {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px 9px;
      font-variant-numeric: tabular-nums;
    }
    .aiu-timer-cluster.running {
      background: #ecfdf5;
      border-color: #10b981;
    }
    .aiu-timer-val {
      font-size: 0.9rem;
      font-weight: 800;
      color: #0f172a;
      min-width: 46px;
      text-align: center;
    }

    /* Scholarly Unit & Lesson Hero Banner */
    .aiu-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 26px 30px;
      margin-bottom: 22px;
      border: 1px solid #1e3a8a;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
      position: relative;
      overflow: hidden;
    }
    .aiu-hero-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .aiu-pill-kicker {
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.28);
      color: #dbeafe;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      padding: 3px 10px;
      border-radius: 4px;
    }
    .aiu-hero-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.55rem, 2.5vw, 2.15rem);
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
      line-height: 1.22;
    }
    .aiu-hero-enquiry {
      font-size: 0.96rem;
      color: #e2e8f0;
      line-height: 1.5;
      margin: 0;
      max-width: 920px;
      font-style: italic;
    }
    .aiu-hero-actions {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.16);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* 6-Lesson Scheme of Work Grid */
    .aiu-lessons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    @media (max-width: 980px) {
      .aiu-lessons-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .aiu-lessons-grid {
        grid-template-columns: 1fr;
      }
    }

    .aiu-lesson-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-top: 4px solid #1e3a8a;
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
      box-sizing: border-box;
    }
    .aiu-lesson-card:hover {
      border-color: #2563eb;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.1);
    }
    .aiu-lesson-card.featured-demo {
      border-color: #2563eb;
      border-top: 4px solid #2563eb;
      background: linear-gradient(180deg, #eff6ff 0%, #ffffff 38%);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.12);
    }
    .aiu-lesson-card.next-quiz-card {
      border-top-color: #059669;
    }

    /* Unified Lesson Station Cards (Matches History Hub wb-unified-station & do-now-card) */
    .aiu-station {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 22px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      overflow: hidden;
    }
    .aiu-station-head {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-station-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-stage-pill {
      background: #0f172a;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 9px;
      border-radius: 4px;
    }
    .aiu-station-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .aiu-mode-pill {
      font-size: 0.71rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 3px 9px;
      border-radius: 4px;
      border: 1px solid transparent;
    }
    .aiu-mode-pill.closed {
      background: #fef2f2;
      color: #991b1b;
      border-color: #fecaca;
    }
    .aiu-mode-pill.paper {
      background: #fffbeb;
      color: #92400e;
      border-color: #fde68a;
    }
    .aiu-mode-pill.open {
      background: #ecfdf5;
      color: #065f46;
      border-color: #a7f3d0;
    }
    .aiu-station-body {
      padding: 18px 20px;
    }

    /* Signature 5-Question Do Now Rows (Exact History Hub GCSE/KS3 Do Now look) */
    .aiu-donow-table {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      background: #ffffff;
    }
    .aiu-donow-row {
      padding: 11px 15px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background-color 0.12s ease;
    }
    .aiu-donow-row:last-child {
      border-bottom: none;
    }
    .aiu-donow-row:hover {
      background: #f8fafc;
    }
    .aiu-donow-line {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }
    .aiu-donow-qwrap {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      flex: 1;
    }
    .aiu-q-num {
      width: 23px;
      height: 23px;
      border-radius: 4px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0284c7;
      font-size: 0.75rem;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .aiu-origin-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 1px 6px;
      border-radius: 4px;
      margin-right: 6px;
    }
    .aiu-q-text {
      font-size: 0.93rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.42;
    }
    .aiu-reveal-pill {
      flex-shrink: 0;
      font-size: 0.72rem;
      font-weight: 700;
      color: #0284c7;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 2px 9px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .aiu-reveal-pill.open {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1d4ed8;
    }
    .aiu-donow-answer {
      margin: 8px 0 2px 33px;
      padding: 9px 13px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      border-radius: 6px;
      font-size: 0.89rem;
      color: #14532d;
      line-height: 1.45;
    }

    /* Stable 2-Column Layout & Zero-Shift RCTC Highlights */
    .aiu-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .aiu-two-col {
        grid-template-columns: 1fr;
      }
    }
    .aiu-box {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 15px 17px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    /* Native History Hub Horizontal Launchpad Bar & Drawer */
    .aiu-launchpad-container {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 18px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
    }
    .aiu-launchpad-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 12px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .aiu-launchpad-tabs {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
      flex-shrink: 0;
    }
    .aiu-lp-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5.5px 12px;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.16s ease;
      white-space: nowrap;
    }
    .aiu-lp-tab:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.28);
    }
    .aiu-lp-tab.active {
      background: #ffffff;
      color: #0f172a;
      font-weight: 700;
      border-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .aiu-lp-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.14);
      color: #94a3b8;
    }
    .aiu-lp-tab.active .aiu-lp-badge {
      background: #e0f2fe;
      color: #0369a1;
    }
    .aiu-lp-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #e2e8f0;
      cursor: pointer;
      font-size: 0.82rem;
    }
    .aiu-lp-close:hover {
      background: rgba(239, 68, 68, 0.22);
      color: #ffffff;
      border-color: rgba(248, 113, 113, 0.5);
    }

    .aiu-rctc-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 14px;
      align-items: start;
    }
    @media (max-width: 940px) {
      .aiu-rctc-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .aiu-rctc-btn {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-top-width: 4px;
      border-radius: 8px;
      padding: 11px 13px;
      text-align: left;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      transition: background-color 0.14s ease, border-color 0.14s ease;
    }
    .aiu-rctc-btn:hover { background: #f8fafc; }
    .aiu-rctc-btn.k-R { border-top-color: #93c5fd; }
    .aiu-rctc-btn.k-C { border-top-color: #6ee7b7; }
    .aiu-rctc-btn.k-T { border-top-color: #fcd34d; }
    .aiu-rctc-btn.k-C2 { border-top-color: #fda4af; }

    .aiu-rctc-btn.k-R.on { border-color: #2563eb; border-top-color: #1d4ed8; background: #eff6ff; }
    .aiu-rctc-btn.k-C.on { border-color: #059669; border-top-color: #047857; background: #ecfdf5; }
    .aiu-rctc-btn.k-T.on { border-color: #d97706; border-top-color: #b45309; background: #fffbeb; }
    .aiu-rctc-btn.k-C2.on { border-color: #e11d48; border-top-color: #be123c; background: #fff1f2; }

    /* Zero-Reflow Model Clause Spans */
    .aiu-clause {
      display: inline;
      padding: 2px 4px;
      margin: 0 1px;
      border-radius: 4px;
      border-bottom: 2.5px solid transparent;
      cursor: pointer;
      transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease;
    }
    .aiu-c-tag {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0 5px;
      margin-right: 3px;
      border-radius: 3px;
      background: #e2e8f0;
      color: #475569;
    }
    .aiu-clause.c-R.on { background: #dbeafe; border-bottom-color: #1d4ed8; color: #1e3a8a; }
    .aiu-clause.c-R.on .aiu-c-tag { background: #1d4ed8; color: #fff; }
    .aiu-clause.c-C.on { background: #d1fae5; border-bottom-color: #047857; color: #064e3b; }
    .aiu-clause.c-C.on .aiu-c-tag { background: #047857; color: #fff; }
    .aiu-clause.c-T.on { background: #fef3c7; border-bottom-color: #b45309; color: #78350f; }
    .aiu-clause.c-T.on .aiu-c-tag { background: #b45309; color: #fff; }
    .aiu-clause.c-C2.on { background: #ffe4e6; border-bottom-color: #be123c; color: #881337; }
    .aiu-clause.c-C2.on .aiu-c-tag { background: #be123c; color: #fff; }

    /* Lesson Bottom Prev / Next Bar */
    .aiu-lesson-footer-nav {
      margin-top: 26px;
      padding: 16px 20px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .aiu-next-lesson-btn {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 11px 20px;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.22);
      transition: opacity 0.15s ease;
    }
    .aiu-next-lesson-btn:hover {
      opacity: 0.92;
    }

    /* ================= PRINTABLE A4 ENGINE ================= */
    .aiu-print-wrap {
      background: #cbd5e1;
      min-height: 100vh;
      padding: 20px 16px 60px;
      font-family: 'Lexend', 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
    }
    .aiu-print-toolbar {
      max-width: 210mm;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .aiu-a4-page {
      width: 210mm;
      min-height: 277mm;
      max-width: 100%;
      margin: 0 auto 22px auto;
      background: #ffffff;
      color: #000000;
      padding: 9mm 11mm;
      box-sizing: border-box;
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.18);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 9pt;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      -webkit-font-smoothing: antialiased;
    }
    .aiu-a4-page.break-after {
      page-break-after: always;
      break-after: page;
    }
    .aiu-sec-banner {
      background: #0f172a;
      color: #ffffff;
      border-radius: 4px;
      padding: 4.5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 7px;
    }
    .aiu-sec-banner-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 8.6pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .aiu-sec-num {
      background: #ffffff;
      color: #0f172a;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 7.6pt;
      font-weight: 800;
      padding: 1px 5.5px;
      border-radius: 3px;
      letter-spacing: 0.02em;
    }
    .aiu-sec-banner-right {
      font-size: 7.5pt;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .aiu-code-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 7.8pt;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      border: 1.1px solid #0f172a;
      border-radius: 4px;
      padding: 1.5px 6px;
      min-width: 38px;
      text-align: center;
    }
    .aiu-topic-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 5px;
      margin-bottom: 7px;
    }
    .aiu-topic-pill {
      border: 1px solid #94a3b8;
      background: #f8fafc;
      border-radius: 999px;
      padding: 2.5px 8px;
      font-size: 7.8pt;
      font-weight: 600;
      color: #0f172a;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .aiu-rule-line {
      border-bottom: 0.85px solid #94a3b8;
      height: 22.5px;
      width: 100%;
      box-sizing: border-box;
    }
    .aiu-case-p-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 10px;
      flex: 1;
    }
    .aiu-case-p-card {
      border: 1.25px solid #0f172a;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #ffffff;
    }
    .aiu-case-p-head {
      background: #0f172a;
      color: #ffffff;
      padding: 4.5px 9px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 8.1pt;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .aiu-case-p-body {
      padding: 7px 10px 8px 10px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .aiu-case-rule-line {
      border-bottom: 0.85px solid #94a3b8;
      height: 22px;
      width: 100%;
      box-sizing: border-box;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 10mm;
      }
      html,
      body,
      body.ai-projector-clean,
      body.ai-projector-clean .app-layout,
      body.ai-projector-clean .app-body,
      body.ai-projector-clean #main-content,
      .app-layout,
      .app-body,
      #main-content,
      .aiu-root,
      .aiu-print-wrap {
        background: none !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 0 !important;
      }
      #app-sidebar,
      .app-header,
      #app-global-footer,
      #mobile-bottom-nav,
      .aiu-topbar,
      .aiu-print-toolbar,
      .no-print {
        display: none !important;
      }
      .aiu-a4-page {
        width: 100% !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ========================= RENDER: TOP BAR ========================= */

function renderTopBar() {
  const activeLesson = AI_COURSE_LESSONS.find((l) => l.num === state.lessonNum) || AI_COURSE_LESSONS[2];

  return `
    <div class="aiu-topbar no-print">
      <div class="aiu-crumbs">
        <button type="button" class="aiu-crumb-btn" data-aiu="exit-hub" title="Return to Main Dashboard">
          <i class="fa-solid fa-house" style="font-size:0.74rem; color:#2563eb;"></i>
          <span>Dashboard</span>
        </button>
        <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; color:#94a3b8;"></i>
        <button type="button" class="aiu-crumb-btn ${state.subView === 'unit' ? 'navy' : ''}" data-aiu="open-unit">
          <span>Year 9 AI Course (6 Lessons)</span>
        </button>
        ${
          state.subView === 'lesson'
            ? `
          <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; color:#94a3b8;"></i>
          <span style="font-weight:700; color:#0f172a;">Lesson ${activeLesson.num}: ${activeLesson.title.split(':')[0]}</span>
        `
            : ''
        }
      </div>

      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <div class="aiu-timer-cluster ${timerRunning ? 'running' : ''}" id="aiu-timer-box">
          <select id="aiu-timer-preset" style="border:none; background:transparent; font-family:inherit; font-size:0.74rem; font-weight:700; color:#475569; cursor:pointer; outline:none;" title="Select Activity Timer">
            <option value="180" ${stageTimerSec === 180 ? 'selected' : ''}>3 min</option>
            <option value="240" ${stageTimerSec === 240 ? 'selected' : ''}>4 min</option>
            <option value="300" ${stageTimerSec === 300 ? 'selected' : ''}>5 min</option>
            <option value="420" ${stageTimerSec === 420 ? 'selected' : ''}>7 min</option>
            <option value="600" ${stageTimerSec === 600 ? 'selected' : ''}>10 min</option>
          </select>
          <span class="aiu-timer-val" id="aiu-timer-val">${fmtMMSS(stageTimerSec)}</span>
          <button type="button" class="aiu-crumb-btn ${timerRunning ? '' : 'navy'}" data-aiu="toggle-timer" style="padding:3px 8px; font-size:0.72rem;">
            <i class="fa-solid ${timerRunning ? 'fa-pause' : 'fa-play'}"></i>
            ${timerRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" class="aiu-crumb-btn" data-aiu="reset-timer" style="padding:3px 7px; font-size:0.72rem;" title="Reset Timer">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
        </div>

        <button type="button" class="aiu-crumb-btn" data-aiu="open-print" data-doc="worksheet">
          <i class="fa-solid fa-file-lines"></i>
          <span>Pupil Worksheet</span>
        </button>

        <button type="button" class="aiu-crumb-btn ${state.hideHubSidebar ? 'blue-active' : ''}" data-aiu="toggle-projector" title="Hide or restore outer portal sidebar &amp; header">
          <i class="fa-solid ${state.hideHubSidebar ? 'fa-compress' : 'fa-expand'}"></i>
          <span>${state.hideHubSidebar ? 'Restore Sidebar' : 'Full-Width View'}</span>
        </button>
      </div>
    </div>
  `;
}

/* ========================= RENDER: UNIT OVERVIEW (6 LESSONS) ========================= */

function renderUnitOverview() {
  return `
    <div class="aiu-hero">
      <div class="aiu-hero-meta">
        <span class="aiu-pill-kicker">${UNIT_META.code}</span>
        <span style="font-size:0.78rem; color:#bfdbfe; font-weight:600;">6 Enquiry Lessons &bull; Microsoft Copilot &amp; Academic Disciplines</span>
      </div>
      <h1 class="aiu-hero-title">${UNIT_META.title}</h1>
      <p class="aiu-hero-enquiry">"${UNIT_META.enquiry}"</p>
      <p style="margin:10px 0 0 0; font-size:0.86rem; color:#cbd5e1; line-height:1.5; max-width:920px;">
        ${UNIT_META.synopsis}
      </p>

      <div class="aiu-hero-actions">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="aiu-crumb-btn" style="background:#ffffff; color:#0f172a; border-color:#ffffff; padding:8px 15px; font-size:0.84rem;" data-aiu="open-lesson" data-num="3">
            <i class="fa-solid fa-book-open" style="color:#2563eb;"></i>
            <span>Open Lesson 3: Introduction to Prompt Craft</span>
          </button>
          <button type="button" class="aiu-crumb-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.3); padding:8px 14px; font-size:0.82rem;" data-aiu="open-print" data-doc="worksheet">
            <i class="fa-solid fa-file-lines"></i>
            <span>Lesson 3 Pupil Worksheet</span>
          </button>
        </div>
        <span style="font-size:0.76rem; color:#93c5fd; font-weight:600;">
          6-Lesson Key Stage 3 Curriculum Sequence
        </span>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #e2e8f0;">
      <h2 style="margin:0; font-family:'Playfair Display', serif; font-size:1.25rem; color:#0f172a;">
        Year 9 Scheme of Work — Enquiry Sequence (Lessons 1–6)
      </h2>
      <span style="font-size:0.78rem; color:#64748b; font-weight:600;">Select a lesson</span>
    </div>

    <div class="aiu-lessons-grid">
      ${AI_COURSE_LESSONS.map((l) => {
        const cardClass = l.isFeaturedDemo
          ? 'featured-demo'
          : l.isPlenaryQuizTarget
            ? 'next-quiz-card'
            : '';
        return `
          <article class="aiu-lesson-card ${cardClass}" data-aiu="open-lesson" data-num="${l.num}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px;">
                <span style="font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; padding:2px 8px; border-radius:4px; background:${l.isFeaturedDemo ? '#2563eb' : l.isPlenaryQuizTarget ? '#ecfdf5' : '#f1f5f9'}; color:${l.isFeaturedDemo ? '#ffffff' : l.isPlenaryQuizTarget ? '#065f46' : '#475569'};">
                  Lesson ${l.num} of 6
                </span>
                <span style="font-size:0.72rem; color:#64748b; font-weight:600;">${l.duration}</span>
              </div>

              <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', Georgia, serif; font-size:1.04rem; font-weight:700; color:#0f172a; line-height:1.3;">
                ${l.title}
              </h3>

              <p style="margin:0 0 10px 0; font-size:0.8rem; color:#475569; font-style:italic; line-height:1.4;">
                "${l.enquiry}"
              </p>

              <p style="margin:0 0 14px 0; font-size:0.8rem; color:#334155; line-height:1.45;">
                ${l.summary}
              </p>
            </div>

            <div style="padding-top:10px; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; font-size:0.76rem;">
              <span style="color:#64748b; font-weight:600;">3 Stages &bull; Launchpad Included</span>
              <span style="color:#2563eb; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
                <span>Open Lesson</span>
                <i class="fa-solid fa-arrow-right" style="font-size:0.68rem;"></i>
              </span>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

/* ========================= RENDER: HORIZONTAL LAUNCHPAD BAR (ALL 6 LESSONS) ========================= */

function renderLessonLaunchpad(lesson) {
  const activeTab = state.launchpadTab[lesson.num] || '';
  const anyDoNowOpen = lesson.doNow.some((_, idx) => Boolean(state.doNowOpen[`${lesson.num}-${idx}`]));
  const allDoNowOpen = lesson.doNow.every((_, idx) => Boolean(state.doNowOpen[`${lesson.num}-${idx}`]));
  const objectives = lesson.objectives || [];
  const vocab = lesson.vocab || [];

  const doNowDrawerHTML = `
    <div style="padding:14px 18px; background:#ffffff;">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding-bottom:10px; margin-bottom:12px; border-bottom:1.5px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:8px; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8;">
            <i class="fa-solid fa-stopwatch" style="font-size:1.05rem;"></i>
          </span>
          <div>
            <div style="font-size:0.71rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1d4ed8;">Do Now Starter &bull; Laptops Closed</div>
            <h3 style="margin:0; font-size:1.08rem; font-weight:800; color:#0f172a; font-family:'Playfair Display', Georgia, serif;">${lesson.doNowTitle}</h3>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="aiu-crumb-btn" data-aiu="reveal-all-donow" data-lnum="${lesson.num}" style="padding:4px 10px; font-size:0.74rem;">
            ${allDoNowOpen ? 'Hide All 5 Answers' : 'Reveal All 5'}
          </button>
          ${
            anyDoNowOpen && !allDoNowOpen
              ? `<button type="button" class="aiu-crumb-btn" data-aiu="reset-donow" data-lnum="${lesson.num}" style="padding:4px 10px; font-size:0.74rem;">Reset</button>`
              : ''
          }
        </div>
      </div>

      <div class="aiu-donow-table">
        ${lesson.doNow
          .map((item, idx) => {
            const key = `${lesson.num}-${idx}`;
            const isOpen = Boolean(state.doNowOpen[key]);
            return `
            <div class="aiu-donow-row" data-aiu="toggle-donow" data-key="${key}">
              <div class="aiu-donow-line">
                <div class="aiu-donow-qwrap">
                  <span class="aiu-q-num">${idx + 1}</span>
                  <div>
                    <span class="aiu-origin-badge">${item.origin}</span>
                    <span class="aiu-q-text">${item.q}</span>
                  </div>
                </div>
                <span class="aiu-reveal-pill ${isOpen ? 'open' : ''}">
                  <i class="fa-solid ${isOpen ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                  <span>${isOpen ? 'Hide' : 'Reveal'}</span>
                </span>
              </div>
              ${
                isOpen
                  ? `<div class="aiu-donow-answer"><strong>Answer:</strong> ${item.a}</div>`
                  : ''
              }
            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;

  const objectivesDrawerHTML = `
    <div style="padding:16px 20px; background:#ffffff;">
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:8px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669;">
            <i class="fa-solid fa-bullseye" style="font-size:1.1rem;"></i>
          </span>
          <div>
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:#059669;">Curriculum Focus &amp; Goals</div>
            <h3 style="margin:0; font-size:1.12rem; font-weight:800; color:#0f172a; font-family:'Playfair Display', Georgia, serif;">Learning Objectives &amp; Enquiry Direction</h3>
          </div>
        </div>
        <span style="font-size:0.75rem; font-weight:700; color:#059669; background:#ecfdf5; border:1px solid #a7f3d0; padding:4px 11px; border-radius:12px; display:inline-flex; align-items:center; gap:5px;">
          <i class="fa-solid fa-list-check"></i> ${objectives.length} Target Milestones
        </span>
      </div>
      <div style="margin-bottom:14px; padding:10px 14px; background:#f0fdf4; border-left:3.5px solid #10b981; border-radius:4px; font-size:0.93rem; font-weight:700; color:#065f46;">
        <i class="fa-solid fa-circle-question" style="margin-right:6px; color:#059669;"></i> ${lesson.enquiry}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
        ${objectives
          .map(
            (obj, idx) => `
          <div style="display:flex; gap:12px; align-items:flex-start; padding:12px 14px; background:#f8fafc; border:1.2px solid #e2e8f0; border-radius:6px;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:50%; background:#10b981; color:#ffffff; font-size:0.75rem; font-weight:800; flex-shrink:0;">${idx + 1}</span>
            <span style="font-size:0.89rem; line-height:1.45; color:#1e293b; font-weight:600; flex:1;">${obj}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `;

  const vocabDrawerHTML = `
    <div style="padding:16px 20px; background:#ffffff;">
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:8px; background:#f5f3ff; border:1px solid #ddd6fe; color:#6d28d9;">
            <i class="fa-solid fa-book-bookmark" style="font-size:1.05rem;"></i>
          </span>
          <div>
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:#6d28d9;">Disciplinary Terminology</div>
            <h3 style="margin:0; font-size:1.12rem; font-weight:800; color:#0f172a; font-family:'Playfair Display', Georgia, serif;">Key AI Vocabulary</h3>
          </div>
        </div>
        <span style="font-size:0.75rem; font-weight:700; color:#6d28d9; background:#f5f3ff; border:1px solid #ddd6fe; padding:4px 11px; border-radius:12px;">
          ${vocab.length} Core Terms
        </span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
        ${vocab
          .map(
            (v) => `
          <div style="padding:11px 14px; background:#f8fafc; border:1.2px solid #e2e8f0; border-left:3.5px solid #6d28d9; border-radius:6px;">
            <div style="font-size:0.9rem; font-weight:800; color:#0f172a; margin-bottom:3px;">${v.term}</div>
            <div style="font-size:0.83rem; line-height:1.42; color:#334155;">${v.def}</div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `;

  return `
    <div class="aiu-launchpad-container no-print">
      <div class="aiu-launchpad-bar">
        <div class="aiu-launchpad-tabs" role="tablist">
          <button type="button" class="aiu-lp-tab ${activeTab === 'donow' ? 'active' : ''}" data-aiu="switch-launchpad" data-lnum="${lesson.num}" data-tab="donow">
            <i class="fa-solid fa-stopwatch"></i>
            <span>Do Now Starter</span>
            <span class="aiu-lp-badge">5 Qs</span>
          </button>
          <button type="button" class="aiu-lp-tab ${activeTab === 'objectives' ? 'active' : ''}" data-aiu="switch-launchpad" data-lnum="${lesson.num}" data-tab="objectives">
            <i class="fa-solid fa-bullseye"></i>
            <span>Learning Objectives</span>
            <span class="aiu-lp-badge">${objectives.length} Goals</span>
          </button>
          <button type="button" class="aiu-lp-tab ${activeTab === 'vocab' ? 'active' : ''}" data-aiu="switch-launchpad" data-lnum="${lesson.num}" data-tab="vocab">
            <i class="fa-solid fa-book-bookmark"></i>
            <span>Key Vocabulary</span>
            <span class="aiu-lp-badge">${vocab.length} Terms</span>
          </button>
        </div>
        ${
          activeTab
            ? `<button type="button" class="aiu-lp-close" data-aiu="close-launchpad" data-lnum="${lesson.num}" title="Collapse drawer">
                <i class="fa-solid fa-xmark"></i>
              </button>`
            : ''
        }
      </div>
      ${
        activeTab === 'donow'
          ? doNowDrawerHTML
          : activeTab === 'objectives'
            ? objectivesDrawerHTML
            : activeTab === 'vocab'
              ? vocabDrawerHTML
              : ''
      }
    </div>
  `;
}

/* ========================= RENDER: LESSON 3 BODY ========================= */

function renderLesson3Stations() {
  const lazyOn = state.specimenOpen.lazy;
  const coachOn = state.specimenOpen.coach;
  const allRctcOn =
    state.rctcOpen.R && state.rctcOpen.C && state.rctcOpen.T && state.rctcOpen.C2;
  const anyCaseOn = Object.values(state.casesOpen).some(Boolean);

  return `
    <!-- STAGE 01: RCTC ARCHITECTURE -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 01</span>
          <h2 class="aiu-station-title">Prompt Architecture: The R.C.T.C. Specification</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill paper">Laptops Closed &bull; Pen &amp; Worksheet Side 1</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-rctc" style="padding:3px 9px; font-size:0.72rem;">
            ${allRctcOn ? 'Collapse All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <!-- Specimen Comparison (Both Auto-Hidden on First Show; Click Card to Reveal/Hide) -->
        <div class="aiu-two-col" style="margin-bottom:18px;">
          <div class="aiu-box" data-aiu="toggle-specimen" data-side="lazy" style="background:#f8fafc; border-top:3.5px solid #dc2626; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#991b1b;">
                Specimen A &bull; Typical One-Line Prompt
              </span>
              <span class="aiu-reveal-pill ${lazyOn ? 'open' : ''}">
                <i class="fa-solid ${lazyOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${lazyOn ? 'Hide Specimen A' : 'Reveal Specimen A'}</span>
              </span>
            </div>
            ${
              lazyOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Explain photosynthesis for my Year 9 Biology test."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:9px 12px; color:#7f1d1d;">
                    <strong>Copilot Output:</strong> Immediately writes a finished 180-word textbook paragraph.<br/>
                    <strong>Learning Result:</strong> Passive reading — zero memory retrieval by the pupil.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to compare how Microsoft Copilot responds to a typical one-line revision prompt.
                  </div>`
            }
          </div>

          <div class="aiu-box" data-aiu="toggle-specimen" data-side="coach" style="background:#f8fafc; border-top:3.5px solid #059669; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46;">
                Specimen B &bull; Engineered R.C.T.C. Prompt
              </span>
              <span class="aiu-reveal-pill ${coachOn ? 'open' : ''}">
                <i class="fa-solid ${coachOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${coachOn ? 'Hide Specimen B' : 'Reveal Specimen B'}</span>
              </span>
            </div>
            ${
              coachOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Act as a Year 9 Biology tutor. I mix up photosynthesis inputs and outputs. Quiz me one question at a time. Never give the answer first."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:9px 12px; color:#064e3b;">
                    <strong>Copilot Output:</strong> <em>"Question 1: Name the two raw materials a plant takes in to start photosynthesis."</em><br/>
                    <strong>Learning Result:</strong> Active recall, error spotting, and step-by-step coaching.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to compare how Microsoft Copilot responds to an engineered R.C.T.C. coaching prompt.
                  </div>`
            }
          </div>
        </div>

        <!-- 4 Auto-Collapsed RCTC Tiles (Letters + Names Shown First; Tap to Reveal Meaning & Highlight Below!) -->
        <div class="aiu-rctc-grid">
          ${RCTC_CLAUSES.map((c) => {
            const on = Boolean(state.rctcOpen[c.key]);
            return `
              <button type="button" class="aiu-rctc-btn k-${c.key} ${on ? 'on' : ''}" data-aiu="toggle-rctc" data-key="${c.key}">
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:6px;">
                  <span style="font-size:0.95rem; font-weight:800; color:#0f172a;">${c.code} ${c.name}</span>
                  <span class="aiu-reveal-pill ${on ? 'open' : ''}" style="padding:1.5px 8px; font-size:0.68rem;">
                    <i class="fa-solid ${on ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.62rem;"></i>
                    <span>${on ? 'Hide' : 'Reveal'}</span>
                  </span>
                </div>
                ${
                  on
                    ? `
                  <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(15,23,42,0.1); width:100%;">
                    <div style="margin-bottom:5px;">
                      <span style="font-size:0.69rem; font-weight:800; color:#334155; background:rgba(255,255,255,0.85); border:1px solid #cbd5e1; padding:1.5px 6px; border-radius:4px;">Worksheet Mark: ${c.penMark}</span>
                    </div>
                    <div style="font-size:0.83rem; color:#1e293b; line-height:1.42;">${c.summary}</div>
                  </div>
                `
                    : ''
                }
              </button>
            `;
          }).join('')}
        </div>

        <!-- Worked Example (Unlabelled Until Each R.C.T.C. Tile or Sentence is Tapped!) -->
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-left:5px solid #1e3a8a; border-radius:8px; padding:14px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
            <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1e3a8a;">
              Worksheet Part 1 Worked Example — Spot R, C, T, and C (tap to highlight)
            </span>
            <span style="font-size:0.74rem; color:#64748b;">
              Workplace link: Microsoft <strong>G.C.S.E.</strong> (Goal, Context, Sources, Expectations)
            </span>
          </div>
          <div style="font-size:1.03rem; line-height:1.78; color:#0f172a;">
            <span class="aiu-clause c-R ${state.rctcOpen.R ? 'on' : ''}" data-aiu="toggle-rctc" data-key="R">${state.rctcOpen.R ? '<span class="aiu-c-tag">R</span>' : ''}Act as a supportive but demanding History tutor.</span>
            <span class="aiu-clause c-C ${state.rctcOpen.C ? 'on' : ''}" data-aiu="toggle-rctc" data-key="C">${state.rctcOpen.C ? '<span class="aiu-c-tag">C</span>' : ''}I am a Year 9 pupil revising why William won the Battle of Hastings in 1066.</span>
            <span class="aiu-clause c-T ${state.rctcOpen.T ? 'on' : ''}" data-aiu="toggle-rctc" data-key="T">${state.rctcOpen.T ? '<span class="aiu-c-tag">T</span>' : ''}Ask me one short question at a time, wait for my reply, and tell me what is accurate and what I missed.</span>
            <span class="aiu-clause c-C2 ${state.rctcOpen.C2 ? 'on' : ''}" data-aiu="toggle-rctc" data-key="C2">${state.rctcOpen.C2 ? '<span class="aiu-c-tag">C</span>' : ''}Never write the full answer for me, ask only one question per turn, and keep replies under 50 words.</span>
          </div>
        </div>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-left:4px solid #2563eb; border-radius:6px; padding:10px 14px; font-size:0.9rem; color:#1e3a8a;">
          <strong>Paper Task Before Opening Screens:</strong> On <strong>Side 1, Part 2A</strong>, tick one Year 9 revision topic and hand-write your <strong>4-sentence v1.0 Coaching Prompt</strong>.
        </div>
      </div>
    </section>

    <!-- STAGE 02: MICROSOFT COPILOT LAB -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 02</span>
          <h2 class="aiu-station-title">Microsoft Copilot Lab: Coaching &amp; Guardrail Stress-Test</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill open">Microsoft Copilot Open &bull; Individual Devices</span>
          <button type="button" class="aiu-crumb-btn ${state.phaseBOpen ? 'blue-active' : 'navy'}" data-aiu="toggle-phaseb" style="padding:3px 10px; font-size:0.72rem;">
            ${state.phaseBOpen ? 'Hide Phase B Challenge' : 'Open Phase B: Stress-Test'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div class="aiu-two-col">
          <div class="aiu-box" style="border-top:4px solid #059669;">
            <div style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46; margin-bottom:6px;">
              Phase A &bull; Socratic Revision Trial
            </div>
            <h3 style="margin:0 0 8px 0; font-family:'Playfair Display', serif; font-size:1.06rem; color:#0f172a;">
              Test Your v1.0 Prompt in Microsoft Copilot
            </h3>
            <ol style="margin:0 0 12px 0; padding-left:20px; font-size:0.91rem; line-height:1.62; color:#1e293b;">
              <li>Open <strong>Microsoft Copilot</strong> and type your <strong>4 short R.C.T.C. sentences</strong> (~30 words) from Part 2A.</li>
              <li>Complete at least <strong>three back-and-forth coaching questions</strong> on your chosen subject.</li>
              <li>Check Copilot's discipline: did it hold back the answer and ask one question at a time?</li>
            </ol>
            <div style="margin-top:auto; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:9px 12px; font-size:0.82rem; color:#475569;">
              <strong>Topic Choices:</strong> Biology (Mitosis) &bull; History (1914 Alliances) &bull; English (Macbeth) &bull; Geography (Plate Margins) &bull; Own Y9 Topic
            </div>
          </div>

          <div class="aiu-box" style="border-top:4px solid ${state.phaseBOpen ? '#be123c' : '#94a3b8'}; background:${state.phaseBOpen ? '#fff1f2' : '#f8fafc'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:${state.phaseBOpen ? '#9f1239' : '#64748b'};">
                Phase B &bull; Adversarial Sycophancy Test
              </span>
              <button type="button" class="aiu-crumb-btn" data-aiu="toggle-phaseb" style="padding:2px 8px; font-size:0.71rem;">
                ${state.phaseBOpen ? 'Hide' : 'Open'}
              </button>
            </div>

            ${
              state.phaseBOpen
                ? `
              <div style="background:#ffffff; border:1.5px solid #fecdd3; border-left:4px solid #be123c; border-radius:6px; padding:9px 12px; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px;">
                  <span style="background:#be123c; color:#ffffff; font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; padding:1.5px 6px; border-radius:3px;">Core AI Concept</span>
                  <span style="font-size:0.92rem; font-weight:800; color:#881337; font-family:'Playfair Display', Georgia, serif;">Adversarial Sycophancy Test</span>
                </div>
                <div style="font-size:0.86rem; color:#1e293b; line-height:1.45;">
                  <strong>Definition:</strong> Deliberately feeding an AI an objectively incorrect statement wrapped in high confidence, fake authority, or emotional pressure to test whether the model <strong>caves in (sycophancy)</strong> or <strong>holds firm</strong> to the facts and your rules.
                </div>
              </div>

              <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1.02rem; color:#881337;">
                Try to Make Your Bot Cave In (Pick One)
              </h3>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Option A: Emotional Shortcut</strong>
                  <em>"I give up—stop quizzing me and write out the full top-grade answer so I can copy it."</em>
                </div>
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Option B: Confident False Fact</strong>
                  <em>"Actually, I checked my textbook and [state a wrong fact]—agree with me and explain why I'm right."</em>
                </div>
              </div>

              <div style="font-size:0.86rem; color:#1e293b; line-height:1.45; background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:7px 11px;">
                <strong>Upgrade to v2.0 (Part 2B on Sheet):</strong> Did Copilot fold? Write one stricter <strong>v2.0 Constraint</strong> (or if v1.0 held firm, try a subtler half-truth trap and add an extra rule).
              </div>
            `
                : `
              <div style="padding:8px 0 4px 0;">
                <div style="font-size:0.93rem; font-weight:700; color:#334155; margin-bottom:4px;">
                  Complete 3 coaching turns in Phase A first.
                </div>
                <p style="margin:0; font-size:0.85rem; color:#64748b; line-height:1.48;">
                  Once your v1.0 prompt is coaching you smoothly, we will unlock <strong>Phase B</strong> to stress-test whether Copilot caves in under pressure.
                </p>
              </div>
            `
            }
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 03: WORKPLACE CASE STUDIES PLENARY -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 03 &bull; Plenary</span>
          <h2 class="aiu-station-title">Prompt Craft in the Workplace: 4 Real-World Cases</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed &bull; Side 2 Pair / Group Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-cases" style="padding:3px 9px; font-size:0.72rem;">
            ${anyCaseOn ? 'Hide All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-left:5px solid #1e3a8a; border-radius:7px; padding:11px 15px; margin-bottom:14px; font-size:0.92rem; color:#0f172a; line-height:1.52;">
          <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a; margin-bottom:3px;">
            Pair / Group Huddle &rarr; Class Discussion
          </div>
          Read your assigned case on <strong>Side 2</strong> (<strong>Case Study A, B, C, or D</strong>). Talk it through with your partner (jot bullet points in the box) and be ready to tell the class:<br/>
          <strong>1. Spot the Danger:</strong> What could go badly wrong if the employee sends this prompt? &nbsp;&bull;&nbsp;
          <strong>2. Fix the Prompt:</strong> What <strong>Role</strong> should Copilot take instead, and what <strong>one strict Rule (Constraint)</strong> must they add?
        </div>

        <div class="aiu-two-col">
          ${WORKPLACE_CASES.map((c) => {
            const open = Boolean(state.casesOpen[c.id]);
            return `
              <div class="aiu-box" style="border-top:3.5px solid #1e3a8a;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:5px;">
                    <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a;">
                      Case Study ${c.letter} &bull; ${c.sector}
                    </span>
                  </div>
                  <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1rem; color:#0f172a;">
                    ${c.roleTitle}
                  </h3>
                  <p style="margin:0 0 8px 0; font-size:0.85rem; color:#334155; line-height:1.45;">
                    ${c.scenario}
                  </p>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #64748b; border-radius:5px; padding:7px 10px; font-size:0.84rem; color:#0f172a; font-style:italic; margin-bottom:12px;">
                    <strong>Employee's Prompt:</strong> ${c.naivePrompt}
                  </div>
                </div>

                <div>
                  <button type="button" class="aiu-crumb-btn" data-aiu="toggle-case" data-id="${c.id}" style="width:100%; justify-content:space-between; padding:6px 11px;">
                    <span>${open ? 'Hide Key Points' : 'Reveal Key Points'}</span>
                    <i class="fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}" style="font-size:0.7rem;"></i>
                  </button>
                  ${
                    open
                      ? `<div style="margin-top:9px; padding:9px 12px; background:#f0fdf4; border:1px solid #86efac; border-left:4px solid #15803d; border-radius:6px; font-size:0.84rem; color:#14532d; line-height:1.45;">
                          <div style="margin-bottom:4px; color:#991b1b;"><strong>Danger:</strong> ${c.danger}</div>
                          <div><strong>Prompt Fix:</strong> ${c.promptFix}</div>
                        </div>`
                      : ''
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ========================= RENDER: FULL 3-STAGE STATIONS FOR LESSONS 1, 2, 4, 5, 6 ========================= */

function renderCourseLessonStations(lesson) {
  const d = lesson.deck;
  if (!d) return '';

  const lnum = lesson.num;
  const specAOn = Boolean(state.courseSpecOpen[`${lnum}-A`]);
  const specBOn = Boolean(state.courseSpecOpen[`${lnum}-B`]);
  const allTilesOn = d.tiles.every((_, idx) => Boolean(state.courseTileOpen[`${lnum}-${idx}`]));
  const phaseBOn = Boolean(state.coursePhaseBOpen[lnum]);
  const anyCaseOn = d.cases.some((c) => Boolean(state.courseCaseOpen[c.id]));

  const tileColorClasses = ['k-R', 'k-C', 'k-T', 'k-C2'];

  return `
    <!-- STAGE 01: CONCEPT & SPECIMEN REVEAL -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 01</span>
          <h2 class="aiu-station-title">${d.stage1Title}</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill paper">Laptops Closed &bull; Concept Comparison</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-c-tiles" data-lnum="${lnum}" style="padding:3px 9px; font-size:0.72rem;">
            ${allTilesOn ? 'Collapse All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <!-- Specimen A vs Specimen B (Auto-Hidden; Click Card to Reveal/Hide) -->
        <div class="aiu-two-col" style="margin-bottom:18px;">
          <div class="aiu-box" data-aiu="toggle-c-spec" data-key="${lnum}-A" style="background:#f8fafc; border-top:3.5px solid #dc2626; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#991b1b;">
                ${d.specA.label}
              </span>
              <span class="aiu-reveal-pill ${specAOn ? 'open' : ''}">
                <i class="fa-solid ${specAOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${specAOn ? 'Hide Specimen A' : 'Reveal Specimen A'}</span>
              </span>
            </div>
            ${
              specAOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.9rem; margin-bottom:9px;">
                    <strong>${d.specA.inputLabel}:</strong> ${d.specA.input}
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:9px 12px; color:#7f1d1d;">
                    <strong>What Happens:</strong> ${d.specA.output}<br/>
                    <strong>Takeaway:</strong> ${d.specA.result}
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    ${d.specA.hint}
                  </div>`
            }
          </div>

          <div class="aiu-box" data-aiu="toggle-c-spec" data-key="${lnum}-B" style="background:#f8fafc; border-top:3.5px solid #059669; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46;">
                ${d.specB.label}
              </span>
              <span class="aiu-reveal-pill ${specBOn ? 'open' : ''}">
                <i class="fa-solid ${specBOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${specBOn ? 'Hide Specimen B' : 'Reveal Specimen B'}</span>
              </span>
            </div>
            ${
              specBOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.9rem; margin-bottom:9px;">
                    <strong>${d.specB.inputLabel}:</strong> ${d.specB.input}
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:9px 12px; color:#064e3b;">
                    <strong>What Happens:</strong> ${d.specB.output}<br/>
                    <strong>Takeaway:</strong> ${d.specB.result}
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    ${d.specB.hint}
                  </div>`
            }
          </div>
        </div>

        <!-- 4 Auto-Collapsed Concept Tiles -->
        <div class="aiu-rctc-grid">
          ${d.tiles
            .map((t, idx) => {
              const tKey = `${lnum}-${idx}`;
              const on = Boolean(state.courseTileOpen[tKey]);
              const cls = tileColorClasses[idx % 4];
              return `
              <button type="button" class="aiu-rctc-btn ${cls} ${on ? 'on' : ''}" data-aiu="toggle-c-tile" data-key="${tKey}">
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:6px;">
                  <span style="font-size:0.94rem; font-weight:800; color:#0f172a;">${t.code} ${t.name}</span>
                  <span class="aiu-reveal-pill ${on ? 'open' : ''}" style="padding:1.5px 8px; font-size:0.68rem;">
                    <i class="fa-solid ${on ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.62rem;"></i>
                    <span>${on ? 'Hide' : 'Reveal'}</span>
                  </span>
                </div>
                ${
                  on
                    ? `
                  <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(15,23,42,0.1); width:100%;">
                    <div style="margin-bottom:5px;">
                      <span style="font-size:0.69rem; font-weight:800; color:#334155; background:rgba(255,255,255,0.85); border:1px solid #cbd5e1; padding:1.5px 6px; border-radius:4px;">${t.tag}</span>
                    </div>
                    <div style="font-size:0.83rem; color:#1e293b; line-height:1.42;">${t.summary}</div>
                  </div>
                `
                    : ''
                }
              </button>
            `;
            })
            .join('')}
        </div>

        <!-- Classroom Worked Example -->
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-left:5px solid #1e3a8a; border-radius:8px; padding:14px 18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
            <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1e3a8a;">
              ${d.workedTitle}
            </span>
            <span style="font-size:0.74rem; color:#64748b;">
              ${d.workedNote}
            </span>
          </div>
          <div style="font-size:0.97rem; line-height:1.68; color:#0f172a;">
            ${d.workedBody}
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 02: MICROSOFT COPILOT LAB -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 02</span>
          <h2 class="aiu-station-title">${d.stage2Title}</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill open">Microsoft Copilot Open &bull; Individual Devices</span>
          <button type="button" class="aiu-crumb-btn ${phaseBOn ? 'blue-active' : 'navy'}" data-aiu="toggle-c-phaseb" data-lnum="${lnum}" style="padding:3px 10px; font-size:0.72rem;">
            ${phaseBOn ? 'Hide Phase B Challenge' : 'Open Phase B: Stress-Test'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div class="aiu-two-col">
          <div class="aiu-box" style="border-top:4px solid #059669;">
            <div style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46; margin-bottom:6px;">
              ${d.phaseATitle}
            </div>
            <p style="margin:0 0 10px 0; font-size:0.89rem; color:#1e293b; line-height:1.48;">
              ${d.phaseAIntro}
            </p>
            <ol style="margin:0; padding-left:19px; font-size:0.87rem; color:#334155; line-height:1.56;">
              ${d.phaseASteps.map((step) => `<li style="margin-bottom:6px;">${step}</li>`).join('')}
            </ol>
          </div>

          <div class="aiu-box" style="border-top:4px solid ${phaseBOn ? '#e11d48' : '#cbd5e1'}; background:${phaseBOn ? '#fff1f2' : '#f8fafc'};">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:${phaseBOn ? '#9f1239' : '#64748b'};">
                ${d.phaseBTitle}
              </span>
              <button type="button" class="aiu-crumb-btn" data-aiu="toggle-c-phaseb" data-lnum="${lnum}" style="padding:2px 8px; font-size:0.7rem;">
                ${phaseBOn ? 'Collapse' : 'Unlock Phase B'}
              </button>
            </div>
            ${
              phaseBOn
                ? `
              <div style="font-size:0.87rem; color:#881337; line-height:1.5;">
                <div style="font-weight:700; margin-bottom:6px; color:#9f1239;">${d.phaseBTag}</div>
                <div style="background:#ffffff; border:1px solid #fecdd3; border-left:3.5px solid #e11d48; border-radius:6px; padding:9px 11px; margin-bottom:8px; color:#0f172a;">
                  ${d.phaseBPrompt}
                </div>
                <div style="font-size:0.84rem; color:#4c0519;">
                  ${d.phaseBCheck}
                </div>
              </div>
            `
                : `
              <div style="padding:8px 0 4px 0;">
                <div style="font-size:0.93rem; font-weight:700; color:#334155; margin-bottom:4px;">
                  Complete Phase A in Microsoft Copilot first.
                </div>
                <p style="margin:0; font-size:0.85rem; color:#64748b; line-height:1.48;">
                  Once you have completed the initial investigation, unlock <strong>Phase B</strong> to stress-test how Copilot behaves under pressure.
                </p>
              </div>
            `
            }
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 03: PLENARY CASE STUDIES -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 03 &bull; Plenary</span>
          <h2 class="aiu-station-title">${d.stage3Title}</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed &bull; Pair / Group Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-c-cases" data-lnum="${lnum}" style="padding:3px 9px; font-size:0.72rem;">
            ${anyCaseOn ? 'Hide All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-left:5px solid #1e3a8a; border-radius:7px; padding:11px 15px; margin-bottom:14px; font-size:0.91rem; color:#0f172a; line-height:1.52;">
          <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a; margin-bottom:3px;">
            Pair / Group Huddle &rarr; Class Discussion
          </div>
          ${d.plenaryPrompt}
        </div>

        <div class="aiu-two-col">
          ${d.cases
            .map((c) => {
              const open = Boolean(state.courseCaseOpen[c.id]);
              return `
              <div class="aiu-box" style="border-top:3.5px solid #1e3a8a;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:5px;">
                    <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a;">
                      Case Study ${c.letter} &bull; ${c.sector}
                    </span>
                  </div>
                  <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1rem; color:#0f172a;">
                    ${c.roleTitle}
                  </h3>
                  <p style="margin:0 0 8px 0; font-size:0.85rem; color:#334155; line-height:1.45;">
                    ${c.scenario}
                  </p>
                  <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #64748b; border-radius:5px; padding:7px 10px; font-size:0.84rem; color:#0f172a; font-style:italic; margin-bottom:12px;">
                    <strong>Prompt / Action:</strong> ${c.naivePrompt}
                  </div>
                </div>

                <div>
                  <button type="button" class="aiu-crumb-btn" data-aiu="toggle-c-case" data-id="${c.id}" style="width:100%; justify-content:space-between; padding:6px 11px;">
                    <span>${open ? 'Hide Key Points' : 'Reveal Key Points'}</span>
                    <i class="fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}" style="font-size:0.7rem;"></i>
                  </button>
                  ${
                    open
                      ? `<div style="margin-top:9px; padding:9px 12px; background:#f0fdf4; border:1px solid #86efac; border-left:4px solid #15803d; border-radius:6px; font-size:0.84rem; color:#14532d; line-height:1.45;">
                          <div style="margin-bottom:4px; color:#991b1b;"><strong>Risk / Flaw:</strong> ${c.danger}</div>
                          <div><strong>Smart Fix:</strong> ${c.promptFix}</div>
                        </div>`
                      : ''
                  }
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

/* ========================= RENDER: ACTIVE LESSON PAGE ========================= */

function renderActiveLesson() {
  const lesson = AI_COURSE_LESSONS.find((l) => l.num === state.lessonNum) || AI_COURSE_LESSONS[2];
  const prevLesson = AI_COURSE_LESSONS.find((l) => l.num === lesson.num - 1);
  const nextLesson = AI_COURSE_LESSONS.find((l) => l.num === lesson.num + 1);

  return `
    <header class="aiu-hero" style="padding:22px 26px;">
      <div class="aiu-hero-meta">
        <span class="aiu-pill-kicker">${lesson.badge}</span>
        <span style="font-size:0.76rem; color:#bfdbfe; font-weight:600;">Year 9 Artificial Intelligence &bull; Lesson ${lesson.num} of 6</span>
      </div>
      <h1 class="aiu-hero-title">${lesson.title}</h1>
      <p class="aiu-hero-enquiry"><strong>Enquiry Question:</strong> ${lesson.enquiry}</p>
    </header>

    ${renderLessonLaunchpad(lesson)}

    ${lesson.num === 3 ? renderLesson3Stations() : renderCourseLessonStations(lesson)}

    <!-- Bottom Lesson Navigation (Prev / Unit Overview / Next Lesson) -->
    <footer class="aiu-lesson-footer-nav no-print">
      <div>
        ${
          prevLesson
            ? `<button type="button" class="aiu-crumb-btn" data-aiu="open-lesson" data-num="${prevLesson.num}" style="padding:9px 14px; font-size:0.84rem;">
                <i class="fa-solid fa-arrow-left"></i>
                <span>Lesson ${prevLesson.num}: ${prevLesson.title.split(':')[0]}</span>
              </button>`
            : `<button type="button" class="aiu-crumb-btn" data-aiu="open-unit" style="padding:9px 14px; font-size:0.84rem;">
                <i class="fa-solid fa-arrow-left"></i>
                <span>Unit Overview</span>
              </button>`
        }
      </div>

      <button type="button" class="aiu-crumb-btn" data-aiu="open-unit" style="padding:8px 14px; font-size:0.82rem;">
        <i class="fa-solid fa-layer-group"></i>
        <span>All 6 Lessons</span>
      </button>

      <div>
        ${
          nextLesson
            ? `<button type="button" class="aiu-next-lesson-btn" data-aiu="open-lesson" data-num="${nextLesson.num}">
                <span>Next Lesson: Lesson ${nextLesson.num} — ${nextLesson.title.split(':')[0]}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>`
            : `<button type="button" class="aiu-crumb-btn navy" data-aiu="open-unit" style="padding:9px 16px; font-size:0.84rem;">
                <span>Complete Unit Overview</span>
              </button>`
        }
      </div>
    </footer>
  `;
}

/* ========================= PRINTABLE A4 DOCUMENTS ========================= */

function renderWorksheet2PageHTML() {
  return `
    <!-- PAGE 1 (SIDE 1) -->
    <div class="aiu-a4-page break-after">
      <div>
        <!-- Editorial Masthead -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; border-bottom:2px solid #0f172a; padding-bottom:6px; margin-bottom:10px;">
          <div>
            <div style="font-size:7.4pt; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#334155;">Year 9 Artificial Intelligence &bull; Lesson 3 Enquiry Sheet (Side 1 of 2)</div>
            <h1 style="margin:2px 0 0 0; font-size:13.8pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a; white-space:nowrap;">Introduction to Prompt Craft: Engineering an AI Coach</h1>
          </div>
          <div style="font-size:8.8pt; font-weight:700; white-space:nowrap; display:flex; align-items:baseline; gap:6px;">
            <span>Name:</span>
            <span style="display:inline-block; width:46mm; border-bottom:1px solid #0f172a;"></span>
          </div>
        </div>

        <!-- SECTION 01: PROMPT ARCHITECTURE (De-Boxed Editorial Flow) -->
        <div style="margin-bottom:12px;">
          <div class="aiu-sec-banner">
            <div class="aiu-sec-banner-left">
              <span class="aiu-sec-num">01</span>
              <span>Prompt Architecture &mdash; Deconstructing R.C.T.C.</span>
            </div>
            <span class="aiu-sec-banner-right">Laptops Closed &bull; Pen &amp; Sheet</span>
          </div>

          <div style="font-size:8.2pt; color:#334155; margin-bottom:6px;">
            <strong style="color:#0f172a;">1A. The Four Prompt Controls:</strong> Jot what each component controls as we reveal it, then mark the worked example below using the four pen symbols.
          </div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:7px 14px; margin-bottom:9px; font-size:8.3pt;">
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:5px 9px 6px 9px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">[ R ]</span> <strong>Role</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw a <strong>[ Box ]</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:19px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:5px 9px 6px 9px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">( C )</span> <strong>Context</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw <strong>( Brackets )</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:19px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:5px 9px 6px 9px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge" style="text-decoration:underline; text-underline-offset:2px;">&nbsp;T&nbsp;</span> <strong>Task</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw an <span style="text-decoration:underline;"><strong>Underline</strong></span></span>
              </div>
              <div class="aiu-rule-line" style="height:19px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:5px 9px 6px 9px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">&#8214; C &#8214;</span> <strong>Constraints</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw <strong>&#8214; Double Bars &#8214;</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:19px;"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:7px 12px;">
            <div style="font-size:7.8pt; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; color:#0f172a; margin-bottom:2px;">
              1B. Specimen Prompt &mdash; Annotate [ R ], ( C ), <span style="text-decoration:underline;">T</span>, and &#8214; C &#8214; directly onto the text:
            </div>
            <div style="font-family:Georgia, 'Times New Roman', serif; font-size:9.6pt; line-height:2.05; color:#0f172a;">
              &ldquo;Act as a supportive but demanding History tutor. I am a Year 9 pupil revising why William won the Battle of Hastings in 1066. Ask me one short question at a time, wait for my reply, and tell me what is accurate and what I missed. Never write the full answer for me, ask only one question per turn, and keep replies under 50 words.&rdquo;
            </div>
          </div>
        </div>

        <!-- SECTION 02: MICROSOFT COPILOT LAB -->
        <div>
          <div class="aiu-sec-banner">
            <div class="aiu-sec-banner-left">
              <span class="aiu-sec-num">02</span>
              <span>Microsoft Copilot Lab &mdash; Draft, Test &amp; Stress-Test</span>
            </div>
            <span class="aiu-sec-banner-right">Plan on Paper First &rarr; Test in Copilot</span>
          </div>

          <div style="font-size:8.3pt; font-weight:700; color:#0f172a; margin-bottom:4px;">
            2A. Tick ONE Year 9 revision topic, then hand-write your v1.0 Coaching Prompt BEFORE opening your laptop:
          </div>

          <div class="aiu-topic-row">
            <span class="aiu-topic-pill">&#9744; Biology: Mitosis</span>
            <span class="aiu-topic-pill">&#9744; History: 1914 Alliances</span>
            <span class="aiu-topic-pill">&#9744; English: Macbeth</span>
            <span class="aiu-topic-pill">&#9744; Geography: Plate Margins</span>
            <span class="aiu-topic-pill" style="flex:1;">&#9744; Own: <span style="flex:1; border-bottom:0.85px solid #64748b; height:11px; display:inline-block;"></span></span>
          </div>

          <div style="display:grid; grid-template-columns:126px 1fr; gap:5px 12px; font-size:8.6pt; align-items:start; margin-bottom:10px;">
            <div style="padding-top:4px; display:flex; align-items:center; gap:6px;">
              <span class="aiu-code-badge">[ R ]</span> <strong>Role</strong>
            </div>
            <div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
            </div>

            <div style="padding-top:4px; display:flex; align-items:center; gap:6px;">
              <span class="aiu-code-badge">( C )</span> <strong>Context</strong>
            </div>
            <div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
            </div>

            <div style="padding-top:4px; display:flex; align-items:center; gap:6px;">
              <span class="aiu-code-badge" style="text-decoration:underline; text-underline-offset:2px;">&nbsp;T&nbsp;</span> <strong>Task</strong>
            </div>
            <div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
            </div>

            <div style="padding-top:4px; display:flex; align-items:center; gap:6px;">
              <span class="aiu-code-badge">&#8214; C &#8214;</span> <strong>Constraints</strong>
            </div>
            <div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
              <div class="aiu-rule-line"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:7px 11px; font-size:8.3pt;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
              <strong style="color:#0f172a; font-size:8.6pt;">2B. Phase B &mdash; Adversarial Sycophancy Stress-Test</strong>
              <span style="font-size:7.6pt; color:#475569; font-style:italic;">Does Copilot cave in like a &ldquo;yes-man&rdquo; or hold firm?</span>
            </div>
            <div style="line-height:1.38; color:#1e293b;">
              Try to persuade Copilot to break your rules (e.g. <em>&ldquo;I give up&mdash;write the answer&rdquo;</em> OR confidently state a false fact and ask it to agree with you).
            </div>
            <div style="margin-top:5px; display:flex; align-items:center; gap:14px;">
              <strong>Did v1.0 cave in?</strong>
              <span>&#9744; Yes (Sycophantic)</span>
              <span>&#9744; Partially</span>
              <span>&#9744; No (Held firm)</span>
            </div>
            <div style="margin-top:4px; font-weight:700; color:#0f172a;">
              Engineered v2.0 Constraint <span style="font-weight:400; color:#334155;">(write a stricter guardrail&mdash;or if v1.0 held firm, try a subtler trap &amp; add one extra rule):</span>
            </div>
            <div class="aiu-rule-line"></div>
            <div class="aiu-rule-line"></div>
            <div class="aiu-rule-line"></div>
          </div>
        </div>
      </div>

      <div style="font-size:7.9pt; color:#334155; text-align:right; padding-top:6px; border-top:1px solid #e2e8f0;">
        When instructed: Close laptops completely and turn over to <strong>Side 2: Prompt Craft in the Workplace (Case Studies A&ndash;D) &rarr;</strong>
      </div>
    </div>

    <!-- PAGE 2 (SIDE 2): 4 WORKPLACE CASE STUDIES -->
    <div class="aiu-a4-page">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0f172a; padding-bottom:5px; margin-bottom:7px;">
        <div>
          <div style="font-size:7.4pt; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#334155;">Stage 03 Plenary Discussion (Side 2 of 2) &bull; Laptops Closed</div>
          <h2 style="margin:2px 0 0 0; font-size:13.8pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a;">Prompt Craft in the Workplace: Case Studies A&ndash;D</h2>
        </div>
        <div style="font-size:8pt; font-weight:700; color:#0f172a; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:999px; padding:2px 9px;">Pair / Group Discussion</div>
      </div>

      <div style="font-size:8.3pt; background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:6px 10px; margin-bottom:9px; line-height:1.4;">
        <strong>Pair / Group Brief:</strong> Discuss your assigned case study (<strong>A, B, C, or D</strong>) with your partner and jot bullet notes below so you are ready to share with the class:<br/>
        <strong>1. Spot the Danger:</strong> What could go badly wrong if this prompt is sent? &nbsp;&bull;&nbsp;
        <strong>2. Fix the Prompt:</strong> What <strong>Role</strong> should Copilot take instead, and what <strong>one strict Rule (Constraint)</strong> must be added?
      </div>

      <div class="aiu-case-p-grid">
        ${WORKPLACE_CASES.map(
          (c) => `
          <div class="aiu-case-p-card">
            <div class="aiu-case-p-head">
              <span style="display:inline-flex; align-items:center; gap:6px;">
                <span class="aiu-sec-num">CASE ${c.letter}</span>
                <span>${c.sector}</span>
              </span>
            </div>
            <div class="aiu-case-p-body">
              <div style="font-size:8pt; line-height:1.36; color:#1e293b; margin-bottom:5px;">
                <strong style="color:#0f172a;">${c.roleTitle}:</strong> ${c.scenario}
              </div>
              <div style="font-size:7.9pt; line-height:1.34; background:#f8fafc; border:1px solid #cbd5e1; border-left:2.5px solid #0f172a; padding:4.5px 8px; border-radius:4px; margin-bottom:7px;">
                <span style="font-family:'JetBrains Mono', Consolas, monospace; font-size:7pt; font-weight:700; text-transform:uppercase; color:#334155; display:block; margin-bottom:1px;">Typed into Copilot:</span>
                <span style="font-family:Georgia, 'Times New Roman', serif; font-style:italic; font-size:8.4pt; color:#0f172a;">${c.naivePrompt}</span>
              </div>

              <div style="font-size:8pt; flex:1; display:flex; flex-direction:column;">
                <div style="font-weight:700; color:#0f172a;">1. Spot the Danger <span style="font-weight:500; color:#475569;">(what could go wrong?):</span></div>
                <div class="aiu-case-rule-line"></div>
                <div class="aiu-case-rule-line"></div>
                <div class="aiu-case-rule-line"></div>
                <div style="font-weight:700; color:#0f172a; margin-top:7px;">2. Fix the Prompt <span style="font-weight:500; color:#475569;">(Better Role + One Strict Rule):</span></div>
                <div class="aiu-case-rule-line"></div>
                <div class="aiu-case-rule-line"></div>
                <div class="aiu-case-rule-line"></div>
                <div class="aiu-case-rule-line"></div>
              </div>
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <div style="margin-top:8px; padding-top:5px; border-top:1.5px solid #0f172a; font-size:7.9pt; display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <span><strong>Key Takeaway:</strong> Never outsource human judgement&mdash;use <strong>R.C.T.C.</strong> so AI challenges, checks, and sharpens your thinking.</span>
        <span style="font-size:7.4pt; color:#475569; font-weight:600; white-space:nowrap;">KS3 Artificial Intelligence</span>
      </div>
    </div>
  `;
}

function renderPrintOverlay() {
  return `
    <div class="aiu-print-wrap">
      <div class="aiu-print-toolbar no-print">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <button type="button" class="aiu-crumb-btn" data-aiu="close-print">
            <i class="fa-solid fa-arrow-left"></i> Back to Course
          </button>
          <span style="font-size:0.84rem; font-weight:700; color:#0f172a;">
            Lesson 3 Pupil Worksheet (2-Sided A4)
          </span>
        </div>
        <button type="button" class="aiu-crumb-btn navy" onclick="window.print()" style="background:#059669; border-color:#10b981;">
          <i class="fa-solid fa-print"></i> Print / Save PDF
        </button>
      </div>
      ${renderWorksheet2PageHTML()}
    </div>
  `;
}

/* ========================= ROOT RENDER & EVENT DELEGATION ========================= */

function updateTimerDOM() {
  const v = document.getElementById('aiu-timer-val');
  const b = document.getElementById('aiu-timer-box');
  if (v) v.textContent = fmtMMSS(stageTimerSec);
  if (b) b.classList.toggle('running', timerRunning);
}

function renderAll() {
  const container = document.getElementById('main-content');
  if (!container) return;

  document.body.classList.toggle('ai-projector-clean', Boolean(state.hideHubSidebar));

  if (state.printDoc === 'worksheet') {
    container.innerHTML = renderPrintOverlay();
    return;
  }

  container.innerHTML = `
    <div class="aiu-root">
      ${renderTopBar()}
      ${state.subView === 'unit' ? renderUnitOverview() : renderActiveLesson()}
    </div>
  `;
}

function bindCourseEvents() {
  const container = document.getElementById('main-content');
  if (!container || container.dataset.aiuBound === 'true') return;
  container.dataset.aiuBound = 'true';

  container.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'aiu-timer-preset') {
      stageTimerSec = parseInt(e.target.value, 10) || 240;
      updateTimerDOM();
    }
  });

  container.addEventListener('click', (e) => {
    const target = e.target.closest('[data-aiu]');
    if (!target) return;
    const act = target.dataset.aiu;

    if (act === 'exit-hub') {
      unmountAiPromptCraftConsole();
      if (typeof window.switchView === 'function') window.switchView('dashboard');
    } else if (act === 'open-unit') {
      state.subView = 'unit';
      renderAll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (act === 'open-lesson') {
      const n = parseInt(target.dataset.num, 10);
      if (n >= 1 && n <= 6) {
        state.lessonNum = n;
        state.subView = 'lesson';
        renderAll();
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (act === 'toggle-projector') {
      state.hideHubSidebar = !state.hideHubSidebar;
      renderAll();
    } else if (act === 'toggle-timer') {
      timerRunning = !timerRunning;
      if (timerRunning) {
        totalClockActive = true;
        if (!timerHandle) {
          timerHandle = setInterval(() => {
            if (timerRunning && stageTimerSec > 0) stageTimerSec -= 1;
            if (totalClockActive) totalLessonSec += 1;
            updateTimerDOM();
          }, 1000);
        }
      }
      renderAll();
    } else if (act === 'reset-timer') {
      const preset = document.getElementById('aiu-timer-preset');
      stageTimerSec = preset ? parseInt(preset.value, 10) : 240;
      updateTimerDOM();
    } else if (act === 'switch-launchpad') {
      const lnum = parseInt(target.dataset.lnum, 10) || state.lessonNum;
      const tab = target.dataset.tab || '';
      state.launchpadTab[lnum] = state.launchpadTab[lnum] === tab ? '' : tab;
      renderAll();
    } else if (act === 'close-launchpad') {
      const lnum = parseInt(target.dataset.lnum, 10) || state.lessonNum;
      state.launchpadTab[lnum] = '';
      renderAll();
    } else if (act === 'toggle-donow') {
      const key = target.dataset.key;
      state.doNowOpen[key] = !state.doNowOpen[key];
      renderAll();
    } else if (act === 'reveal-all-donow') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l) {
        const allOn = l.doNow.every((_, i) => Boolean(state.doNowOpen[`${lnum}-${i}`]));
        l.doNow.forEach((_, i) => {
          state.doNowOpen[`${lnum}-${i}`] = !allOn;
        });
        renderAll();
      }
    } else if (act === 'reset-donow') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l) {
        l.doNow.forEach((_, i) => {
          state.doNowOpen[`${lnum}-${i}`] = false;
        });
        renderAll();
      }
    } else if (act === 'toggle-specimen') {
      const s = target.dataset.side;
      state.specimenOpen[s] = !state.specimenOpen[s];
      renderAll();
    } else if (act === 'toggle-rctc') {
      const k = target.dataset.key;
      state.rctcOpen[k] = !state.rctcOpen[k];
      renderAll();
    } else if (act === 'toggle-all-rctc') {
      const allOn =
        state.rctcOpen.R && state.rctcOpen.C && state.rctcOpen.T && state.rctcOpen.C2;
      const next = !allOn;
      state.rctcOpen = { R: next, C: next, T: next, C2: next };
      renderAll();
    } else if (act === 'toggle-phaseb') {
      state.phaseBOpen = !state.phaseBOpen;
      renderAll();
    } else if (act === 'toggle-case') {
      const id = target.dataset.id;
      state.casesOpen[id] = !state.casesOpen[id];
      renderAll();
    } else if (act === 'toggle-all-cases') {
      const anyOn = Object.values(state.casesOpen).some(Boolean);
      const next = !anyOn;
      state.casesOpen = { law: next, med: next, arch: next, fin: next };
      renderAll();
    } else if (act === 'toggle-c-spec') {
      const k = target.dataset.key;
      state.courseSpecOpen[k] = !state.courseSpecOpen[k];
      renderAll();
    } else if (act === 'toggle-c-tile') {
      const k = target.dataset.key;
      state.courseTileOpen[k] = !state.courseTileOpen[k];
      renderAll();
    } else if (act === 'toggle-all-c-tiles') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l && l.deck) {
        const allOn = l.deck.tiles.every((_, idx) => Boolean(state.courseTileOpen[`${lnum}-${idx}`]));
        l.deck.tiles.forEach((_, idx) => {
          state.courseTileOpen[`${lnum}-${idx}`] = !allOn;
        });
        renderAll();
      }
    } else if (act === 'toggle-c-phaseb') {
      const lnum = parseInt(target.dataset.lnum, 10);
      state.coursePhaseBOpen[lnum] = !state.coursePhaseBOpen[lnum];
      renderAll();
    } else if (act === 'toggle-c-case') {
      const id = target.dataset.id;
      state.courseCaseOpen[id] = !state.courseCaseOpen[id];
      renderAll();
    } else if (act === 'toggle-all-c-cases') {
      const lnum = parseInt(target.dataset.lnum, 10);
      const l = AI_COURSE_LESSONS.find((x) => x.num === lnum);
      if (l && l.deck) {
        const anyOn = l.deck.cases.some((c) => Boolean(state.courseCaseOpen[c.id]));
        l.deck.cases.forEach((c) => {
          state.courseCaseOpen[c.id] = !anyOn;
        });
        renderAll();
      }
    } else if (act === 'open-print') {
      state.printDoc = 'worksheet';
      renderAll();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (act === 'close-print') {
      state.printDoc = null;
      renderAll();
    }
  });
}

export function unmountAiPromptCraftConsole() {
  document.body.classList.remove('ai-projector-clean');
  document.body.classList.remove('ai-prompt-craft-active');
  timerRunning = false;
  if (timerHandle) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

export function renderAiPromptCraftConsole() {
  injectUnitStyles();
  document.title = 'Year 9 Artificial Intelligence — Curriculum & Enquiry Portal';

  const params = new URLSearchParams(window.location.search);
  const printParam = (params.get('print') || '').toLowerCase().trim();
  const lessonParam = parseInt(params.get('lesson') || '', 10);

  if (printParam === 'worksheet') {
    state.printDoc = 'worksheet';
  } else if (!isNaN(lessonParam) && lessonParam >= 1 && lessonParam <= 6) {
    state.subView = 'lesson';
    state.lessonNum = lessonParam;
  }

  bindCourseEvents();
  renderAll();
}
