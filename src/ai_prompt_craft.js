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
  title: 'How AI Works, Prompt Craft & Real Judgement',
  enquiry:
    'Who is in charge: you or the chatbot? How AI predicts words, why it bluffs, and how to make it test your thinking rather than replace it.',
  synopsis:
    'A six-lesson Year 9 course exploring how chatbots predict word-chunks (tokens), why they invent confident nonsense (hallucinations) or cave in like "yes-men" (sycophancy), how R.C.T.C. turns Microsoft Copilot into a revision coach, and where humans stay in charge across school subjects and future jobs.',
};

const RCTC_CLAUSES = [
  {
    key: 'R',
    code: '[ R ]',
    name: 'Role',
    penMark: 'Box [ ... ]',
    summary: 'Tell the AI who to act as (e.g. a strict Year 9 quiz tutor or sceptical critic).',
  },
  {
    key: 'C',
    code: '( C )',
    name: 'Context',
    penMark: 'Brackets ( ... )',
    summary: 'Give background: Year 9, the exact topic, and which bit you mix up.',
  },
  {
    key: 'T',
    code: '_T_',
    name: 'Task',
    penMark: 'Underline',
    summary: 'Tell Copilot the exact step-by-step job you want it to do.',
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
    roleTitle: 'Trainee Solicitor: High Court Deadline',
    scenario:
      'Ten minutes before a High Court deadline, a trainee lawyer has not checked the official law reports. They type this into Copilot and send the reply straight to the judge:',
    naivePrompt:
      '"Write a persuasive legal argument proving breach of contract for a late cargo ship, and cite two High Court cases that back me up."',
    danger:
      'Hallucination: Copilot can invent convincing fake High Court cases that do not exist.',
    promptFix:
      'Act as a cautious legal researcher using ONLY my pasted case notes. Rule: Never invent cases; flag any missing proof.',
  },
  {
    id: 'med',
    letter: 'B',
    sector: 'NHS Hospital Clinic',
    roleTitle: 'Clinic Coordinator: Patient Letter',
    scenario:
      'A busy coordinator needs to invite a patient back for a routine repeat chest X-ray. They paste the doctor\'s notes (including full name, date of birth, and home address) into a public chatbot:',
    naivePrompt:
      '"Write an urgent email telling this patient they must come back immediately for another chest scan."',
    danger:
      'Privacy Breach & Panic: Confidential patient details were pasted into public AI, and "urgent" wording causes needless worry.',
    promptFix:
      '(Remove all names and dates first.) Act as an NHS editor writing a calm routine letter. Rule: Under 75 words, reassuring tone, no personal data.',
  },
  {
    id: 'arch',
    letter: 'C',
    sector: 'Architecture Studio',
    roleTitle: 'Junior Architect: Seafront Sixth-Form Pitch',
    scenario:
      'Five rival firms are competing to design a sixth-form centre on a windy, salt-sprayed coast. Instead of sketching ideas first, one team types straight into Copilot:',
    naivePrompt:
      '"Design an exciting, modern eco-school building for us to pitch to the client."',
    danger:
      'Bland Clichés: Handing the creative work to AI produces generic glass-box ideas that ignore coastal gales and salt rust.',
    promptFix:
      'Act as a coastal structural engineer testing OUR own initial building sketch. Rule: Do not design it for us; ask 3 tough weather-safety questions.',
  },
  {
    id: 'fin',
    letter: 'D',
    sector: 'Finance & Business',
    roleTitle: 'Investment Analyst: £10m Airline Pitch',
    scenario:
      'An analyst wants their company to invest £10 million in a startup promising battery-powered jumbo jets by 2030. Before the board vote, they type into Copilot:',
    naivePrompt:
      '"Give me five convincing reasons why battery-powered jumbo jets are a guaranteed success."',
    danger:
      '"Yes-Man" Trap: Asking for only positive reasons makes AI flatter a flawed £10m bet and ignore battery-weight physics.',
    promptFix:
      'Act as a sceptical physics and finance critic testing this pitch. Rule: Do not agree out of politeness; list the 3 biggest problems first.',
  },
];

const AI_COURSE_LESSONS = [
  {
    num: 1,
    id: 'l1',
    badge: 'Lesson 1 · How AI Works',
    title: 'Smart Autocomplete: Tokens, Probability & Next-Word Prediction',
    enquiry: 'Does a chatbot actually "know" facts like a database, or is it predicting the next likely word-chunk?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    activityTag: 'Unplugged Predictive-Text Game + Copilot Lab',
    summary:
      'See how chatbots chop sentences into tiny tokens and score what comes next—explaining why AI sounds smooth and confident even when guessing.',
    objectives: [
      'Explain how chatbots split text into numbered word-chunks (tokens) rather than reading whole sentences like humans.',
      'Compare looking up a stored fact (like Contacts or a School Register) with predicting the next likely word.',
      'Explain why "temperature" makes AI sound fluent and varied—even when it is guessing.',
    ],
    vocab: [
      { term: 'Large Language Model (LLM)', def: 'The AI engine behind Copilot and ChatGPT—trained on huge text collections to predict the next word-piece.' },
      { term: 'Token', def: 'A small chunk of text (around 3–4 letters or a short word) turned into an ID number by the AI.' },
      { term: 'Next-Word Prediction', def: 'Scoring which word-chunk is statistically most likely to come next in a sentence.' },
      { term: 'Temperature', def: 'A setting that controls whether AI sticks to the #1 safest word choice or takes more creative leaps.' },
    ],
    doNowTitle: 'Quick-Fire Starting Check (5 Questions)',
    doNow: [
      {
        origin: 'Starter',
        q: 'What does "LLM" stand for in artificial intelligence?',
        a: 'Large Language Model — an AI trained on billions of texts to predict the next word-chunk.',
      },
      {
        origin: 'Starter',
        q: 'When Microsoft Copilot writes a paragraph, is it copying and pasting straight from one website?',
        a: 'No — unless quoting a search link, it builds a brand-new sentence piece by piece from patterns.',
      },
      {
        origin: 'Starter',
        q: 'Roughly what is a "token" when an AI processes your sentence?',
        a: 'A small 3–4 letter word-chunk (or short word) that the AI turns into a number.',
      },
      {
        origin: 'Starter',
        q: 'Why does asking Copilot the exact same question twice often give two slightly different wordings?',
        a: 'A setting called "temperature" lets it vary high-scoring word choices instead of reading a fixed script.',
      },
      {
        origin: 'Starter',
        q: 'Where have you already used basic next-word prediction on a phone before chatbots existed?',
        a: 'Predictive text / autocomplete suggestions above your phone keyboard.',
      },
    ],
    deck: {
      stage1Title: 'Exact Lookup vs Next-Word Prediction',
      specA: {
        label: 'Example A · Exact Lookup (School Register / Contacts)',
        hint: 'Click to see how a normal database looks up a saved fact.',
        inputLabel: 'Search',
        input: 'Look up stored record -> Event: "Battle of Hastings" | Field: "Date"',
        output: 'Finds the exact saved entry ("14 October 1066"). If nothing is saved, it says "No results found". It never guesses.',
        result: 'Exact stored fact, zero guesswork.',
      },
      specB: {
        label: 'Example B · Large Language Model (Microsoft Copilot)',
        hint: 'Click to see how an AI chatbot builds a sentence one token at a time.',
        inputLabel: 'Prompt',
        input: '"In October 1066, King Harold marched south to fight at..."',
        output: 'Scores the most likely next word-chunk from billions of sentences: "Hastings" (92%), "Battle" (5%), "Senlac" (2%).',
        result: 'Pattern prediction: sounds fluent even when unsure.',
      },
      tiles: [
        {
          code: '[ 01 ]',
          name: 'Tokens',
          tag: 'Step 1 · Chopping Text',
          summary: 'Copilot chops your words into ~3–4 letter chunks called tokens (e.g. "un" + "believ" + "able") and gives each one a number.',
        },
        {
          code: '[ 02 ]',
          name: 'Context Clues',
          tag: 'Step 2 · Weighing Words',
          summary: 'It checks every word in your prompt against the others so it tells a muddy "river bank" apart from "Barclays bank".',
        },
        {
          code: '[ 03 ]',
          name: 'Likely Next Word',
          tag: 'Step 3 · Percentage Scores',
          summary: 'For the very next gap, the AI scores thousands of possible tokens from most likely (94%) to least likely (0.01%).',
        },
        {
          code: '[ 04 ]',
          name: 'Temperature',
          tag: 'Step 4 · Pick & Repeat',
          summary: 'Instead of picking #1 like a robot every time, "temperature" adds slight variety—then loops again for the next word.',
        },
      ],
      workedTitle: 'Slow-Motion Replay — How Copilot Picks One Word at a Time',
      workedNote: 'Key Takeaway: Smooth grammar comes from probability, not human understanding',
      workedBody:
        'Sentence so far: <strong>"Photosynthesis happens inside green plant cell parts called..."</strong> &rarr; Top Scores: <strong>chloroplasts (94%)</strong> &bull; <em>leaves (3%)</em> &bull; <em>cells (2%)</em> &bull; <em>vacuoles (1%)</em>. Once <strong>chloroplasts</strong> is picked, it gets glued onto the sentence and the whole loop runs again for the next word.',
      stage2Title: 'Microsoft Copilot Lab: Testing Prediction & Fake Proverbs',
      phaseATitle: 'Phase A · Same Prompt, Two Fresh Chats',
      phaseAIntro: 'Open Microsoft Copilot and catch "temperature" changing the wording live:',
      phaseASteps: [
        'Type: <em>"Explain in exactly two sentences why volcanoes erupt."</em> Read the reply closely.',
        'Start a <strong>brand-new chat</strong> and paste the <strong>exact same prompt</strong> a second time.',
        'Spot what stayed the same (high-scoring science words like <em>magma, pressure, plates</em>) and which linking words changed!',
      ],
      phaseBTitle: 'Phase B · The Made-Up Proverb Trap',
      phaseBTag: 'Will next-word prediction keep bluffing when your question is nonsense?',
      phaseBPrompt:
        'Type into Copilot: <em>"Finish this famous medieval proverb and explain what it meant: Never trust a baker who counts the rain."</em> (We just made this proverb up!)',
      phaseBCheck:
        'Check what happens: Did Copilot admit the saying isn\'t real, or did it smoothly invent a fake medieval story? Now add a rule: <em>"If this proverb is not real, say so plainly—do not guess."</em>',
      stage3Title: 'Where Prediction Trips People Up: Cases A–D',
      plenaryPrompt:
        'Talk through your case in pairs: <strong>1. Spot the Trap:</strong> Why does next-word prediction go wrong here? &bull; <strong>2. Smarter Move:</strong> What should this pupil do instead?',
      cases: [
        {
          id: 'l1a',
          letter: 'A',
          sector: 'Maths Homework',
          roleTitle: 'Year 9 Pupil — Chatbot vs Calculator',
          scenario: 'Instead of grabbing a calculator, a pupil types a messy 5-step decimal sum into a chatbot and copies down the final answer.',
          naivePrompt: '"What is (487.6 × 19.4) divided by 3.72, rounded to 2 decimal places?"',
          danger: 'Predicting likely number tokens is not the same as a calculator chip (unless the bot writes code)—one slipped digit ruins the whole answer.',
          promptFix: 'Use a calculator for the sum; use Copilot to ask: "Remind me step-by-step how to round a decimal to 2 places."',
        },
        {
          id: 'l1b',
          letter: 'B',
          sector: 'Creative Writing',
          roleTitle: 'House Story Competition — Identical Openings',
          scenario: 'Thirty pupils all ask Copilot for a "spooky gothic story opening in an old mansion" the night before the English competition.',
          naivePrompt: '"Write a dramatic opening paragraph for a spooky Year 9 gothic story."',
          danger: 'Top-scoring tokens pull everyone toward the exact same clichés ("flickering candle", "shiver down my spine", "creaking floorboards").',
          promptFix: 'Write your own weird, original opening first; only ask Copilot afterwards to suggest three sharper verbs.',
        },
        {
          id: 'l1c',
          letter: 'C',
          sector: 'School Sport',
          roleTitle: 'Yesterday\'s Under-14 Cup Final',
          scenario: 'A pupil asks an AI chatbot (with no access to school match sheets) who scored the winner in yesterday\'s school cup match.',
          naivePrompt: '"Write a match report on yesterday\'s Under-14 Cup final."',
          danger: 'Without your real match notes, next-word prediction still writes a thrilling football report—with completely imaginary goalscorers!',
          promptFix: 'Type your own real match facts (scorers, minute, score) first, then ask Copilot to check your spelling and flow.',
        },
        {
          id: 'l1d',
          letter: 'D',
          sector: 'Science Revision',
          roleTitle: 'Fooled by Confident Grammar',
          scenario: 'A pupil asks for a tough Physics explanation and assumes every detail must be 100% right because it sounds like a textbook.',
          naivePrompt: '"Explain how nuclear fusion works inside the Sun."',
          danger: 'Polished sentences come automatically from word probabilities—even when the chatbot quietly muddles a key science step.',
          promptFix: 'Use AI for a quick first overview, then double-check key steps against BBC Bitesize or your class notes.',
        },
      ],
    },
  },
  {
    num: 2,
    id: 'l2',
    badge: 'Lesson 2 · Fact-Checking, Deepfakes & Bias',
    title: 'Confident Bluffers: Hallucinations, Deepfakes & Fact-Checking',
    enquiry: 'Why do AI tools invent fake quotes, images, and facts with 100% confidence—and how do we verify them fast?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    activityTag: 'Two Truths, a Deepfake & a Hallucination Race',
    summary:
      'Explore why AI generates confident text hallucinations, internet bias, and realistic voice/image deepfakes—and practise leaving the chat ("lateral reading") to check provenance.',
    objectives: [
      'Define an AI hallucination and explain why made-up quotes, dates, and synthetic images look and sound convincing.',
      'Spot three classic AI traps: invented quotes, training-data bias, and viral voice/image deepfakes.',
      'Use lateral reading ("leave the chat") and source provenance checks to verify claims in under 30 seconds.',
    ],
    vocab: [
      { term: 'AI Hallucination', def: 'When a chatbot states a made-up quote, fact, date, or court case with smooth 100% confidence.' },
      { term: 'Deepfake & Provenance', def: 'Synthetic AI voice, video, or images—checked by tracing where and when the original file was published.' },
      { term: 'Lateral Reading', def: 'Opening a separate trusted tab (e.g. BBC Bitesize, NHS, National Archives) instead of asking the bot "Are you sure?".' },
      { term: 'Training Bias', def: 'Unfair stereotypes or blind spots an AI picks up from the internet data it was trained on.' },
    ],
    doNowTitle: 'Retrieval from Lesson 1 & Starter Check (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'Does an LLM look up stored truth like a school register, or predict the next likely token?',
        a: 'It predicts the next statistically likely token based on the words before it.',
      },
      {
        origin: 'Lesson 1',
        q: 'Roughly how many letters is one English "token" on average?',
        a: 'About 3 to 4 letters (roughly three-quarters of a word).',
      },
      {
        origin: 'Lesson 1',
        q: 'Why does a chatbot still sound super confident even when it is guessing?',
        a: 'It is trained to write smooth, helpful-sounding sentences—even when it does not know a fact.',
      },
      {
        origin: 'Starter',
        q: 'What word do AI engineers use when a chatbot invents a fake quote, book, or event?',
        a: 'An AI hallucination.',
      },
      {
        origin: 'Starter',
        q: 'What is the safest way to check a surprising fact Copilot gives you?',
        a: 'Leave the chat ("lateral reading") and check a trusted site like BBC Bitesize or Britannica.',
      },
    ],
    deck: {
      stage1Title: 'Fact-Checking: Staying in the Chat vs Leaving the Chat',
      specA: {
        label: 'Example A · Staying in the Chat ("Are You Sure?")',
        hint: 'Click to see what goes wrong when you ask a chatbot to mark its own homework.',
        inputLabel: 'Pupil Follow-Up',
        input: '"Are you 100% sure Winston Churchill said that exact quote in 1941?"',
        output: 'Copilot replies: "Yes, Churchill spoke those words in his October 1941 broadcast..." inventing a fake speech date to back up the fake quote.',
        result: 'Asking "Are you sure?" stays inside the same guessing engine.',
      },
      specB: {
        label: 'Example B · Lateral Reading (Leaving the Chat)',
        hint: 'Click to see how fact-checkers test an AI claim.',
        inputLabel: 'Outside Check',
        input: 'Open a new tab -> search BBC Bitesize / Britannica / Churchill Archive for the exact quote.',
        output: 'Zero real matches found. You spot straight away that the quote is made up.',
        result: 'Independent sources beat chatbot confidence every time.',
      },
      tiles: [
        {
          code: '[ H ]',
          name: 'Hallucination',
          tag: 'Trap 1 · Confident Bluffing',
          summary: 'Mixing real names and dates with invented quotes, books, or court cases because the words sound believable together.',
        },
        {
          code: '[ B ]',
          name: 'Training Bias',
          tag: 'Trap 2 · Internet Stereotypes',
          summary: 'AI learns from billions of web pages—so common stereotypes or blind spots in that data get repeated unless challenged.',
        },
        {
          code: '[ F ]',
          name: 'Fluency Trap',
          tag: 'Trap 3 · Sounding Smart',
          summary: 'Humans naturally trust polite, confident speakers—making it easy to miss a bogus date hidden inside neat grammar.',
        },
        {
          code: '[ L ]',
          name: 'Lateral Reading',
          tag: 'The Fix · Open a New Tab',
          summary: 'Never rely on "Are you sure?"—check exact quotes, numbers, and dates on a trusted website outside the chat.',
        },
      ],
      workedTitle: 'Spot the Hallucination — Two Real Facts & One Fake Quote',
      workedNote: 'Watch Out: Exact quotes, book titles, and web links are the #1 thing chatbots invent',
      workedBody:
        '"RMS <em>Titanic</em> hit an iceberg on the night of 14 April 1912 on her maiden voyage from Southampton. More than 1,500 people died. <strong>As Captain Edward Smith famously wrote in his leather pocket diary washed ashore in Canada, \'No ocean built by nature can sink steel built by man.\'</strong>" &rarr; <em>(First two sentences = True. Bold diary quote = 100% Hallucinated!)</em>',
      stage2Title: 'Microsoft Copilot Lab: Hallucination Hunting',
      phaseATitle: 'Phase A · The 3-Fact Speed Check',
      phaseAIntro: 'Put your Lateral Reading speed to the test on a Year 9 topic:',
      phaseASteps: [
        'Ask Copilot for <strong>three specific facts (including one real quote or date)</strong> on a History, Science, or Geography topic you study.',
        'Open a second tab (BBC Bitesize, Britannica, or an official museum site) and check all three.',
        'Mark each one <strong>True</strong>, <strong>Half-True</strong>, or <strong>Hallucinated</strong>—and click any numbered link Copilot gives you to check if that webpage actually says what Copilot claimed!',
      ],
      phaseBTitle: 'Phase B · The Fake History Trap',
      phaseBTag: 'Will Copilot admit an event never happened—or invent a whole story?',
      phaseBPrompt:
        'Test Copilot with a realistic-sounding fake event: <em>"Give me three main causes of the 1847 Portsmouth Steam-Tram Strike."</em> (This strike never existed!)',
      phaseBCheck:
        'Did Copilot spot the trick—or invent angry Victorian tram drivers? Now test adding a rule: <em>"If you cannot verify that this event really happened, say \'Unverified\' and do not guess."</em>',
      stage3Title: 'Hallucinations & Bias in Real Life: Cases A–D',
      plenaryPrompt:
        'Talk through your case in pairs: <strong>1. What Went Wrong?</strong> Is this a Hallucination, Training Bias, or Staying in the Chat? &bull; <strong>2. Fast Check:</strong> What outside check stops the mistake?',
      cases: [
        {
          id: 'l2a',
          letter: 'A',
          sector: 'History Essay',
          roleTitle: 'The Fake Victorian Quote',
          scenario: 'Revising the Industrial Revolution, a pupil asks AI for "two short quotes from 1842 child coal-miners" and copies both into their essay.',
          naivePrompt: '"Give me two eyewitness quotes with names and ages from the 1842 Mines Report."',
          danger: 'Hallucination — the 1842 Mines Report is real, so chatbots smoothly stitch together believable fake names and quotes.',
          promptFix: 'Look up real 1842 Mines Report extracts on the National Archives or BBC Bitesize first, then quote the real child witness.',
        },
        {
          id: 'l2b',
          letter: 'B',
          sector: 'Jobs & Hiring',
          roleTitle: 'Biased CV Scanner',
          scenario: 'A tech company trains an AI on 15 years of past company CVs (90% male engineers) and asks it to score 500 new job applicants.',
          naivePrompt: '"Rank these 500 CVs based on who best matches our past hires."',
          danger: 'Training Bias — the AI marks down applicants from girls\' schools or different backgrounds because it copies yesterday\'s imbalance.',
          promptFix: 'Test the tool for bias, hide names/schools, and keep real human interviewers in charge of shortlisting.',
        },
        {
          id: 'l2c',
          letter: 'C',
          sector: 'First Aid',
          roleTitle: 'Kitchen Burn Myth',
          scenario: 'Someone burns their hand on a pan, asks a chatbot whether to put butter on it, and types "Are you sure?" inside the same chat.',
          naivePrompt: '"Should I put butter on a burn to cool it down? Are you sure?"',
          danger: 'Dangerous Myth — butter traps heat in the skin, and asking "Are you sure?" inside a chat is never a safe medical check.',
          promptFix: 'Go straight to the official NHS website (cool running water for 20 minutes)—never trust unverified chat for first aid.',
        },
        {
          id: 'l2d',
          letter: 'D',
          sector: 'Group Chats & Social Media',
          roleTitle: 'The Viral "Snow Day" Voice-Note & Screenshot',
          scenario: 'At 7:15am, a realistic voice-note of the headteacher and a news-style graphic announcing "School Closed All Week" go viral in the Year 9 group chat.',
          naivePrompt: '"Forwarding straight to 60 people without checking where the clip came from."',
          danger: 'Deepfake: AI voice clones and image tools can copy a real voice or news banner in seconds.',
          promptFix: 'Check provenance outside the chat: go straight to official school emails or the school website before believing or sharing.',
        },
      ],
    },
  },
  {
    num: 3,
    id: 'l3',
    isFeaturedDemo: true,
    badge: 'Lesson 3 · Prompt Craft (R.C.T.C.)',
    title: 'Introduction to Prompt Craft: Turning AI into a Revision Coach',
    enquiry:
      'How do we use R.C.T.C. (Role, Context, Task, Constraints) so Copilot tests our memory instead of doing the thinking for us?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    activityTag: 'Pen-First R.C.T.C. Build + "Yes-Man" Stress-Test',
    summary:
      'Use the four-part R.C.T.C. framework to turn Microsoft Copilot into a 1-to-1 quiz coach, test whether it caves in like a "yes-man", and fix four workplace AI disasters.',
    objectives: [
      'Break a strong prompt into Role, Context, Task, and Constraints (R.C.T.C.) and explain why lazy one-line prompts don\'t stick in memory.',
      'Build and test a revision coach in Microsoft Copilot, catch a real gap in your own recall, and run the "Yes-Man" Stress-Test (v1.0 -> v2.0).',
      'Spot the danger in four real-world workplace prompts (Law, NHS, Architecture, Finance) and design the Role + Constraint fix.',
    ],
    vocab: [
      { term: 'R.C.T.C. Framework', def: 'Four building blocks of a clear prompt: Role, Context, Task, and Constraints (strict rules).' },
      { term: 'Quiz Coaching', def: 'Asking one short question at a time instead of handing over the finished answer.' },
      { term: 'AI Sycophancy ("Yes-Man" Trap)', def: 'When a chatbot caves in, flatters you, or agrees with a wrong fact just to keep the user happy.' },
      { term: 'Stress-Testing a Prompt', def: 'Pushing your chatbot with an excuse ("I give up!") or wrong fact to check whether your rules hold firm.' },
    ],
    doNowTitle: 'Starter Questions: How AI & Memory Work',
    doNow: [
      {
        origin: 'Q1',
        q: 'Does Microsoft Copilot actually "understand" your subject like a teacher, or predict the next likely words?',
        a: 'It predicts likely next words from patterns, so vague prompts produce vague, generic answers.',
      },
      {
        origin: 'Q2',
        q: 'True or False: If Copilot gives you an exact Winston Churchill quote with 100% confidence, you can trust it is real. Why?',
        a: 'False: chatbots can invent fake quotes with complete confidence (called an AI hallucination).',
      },
      {
        origin: 'Q3',
        q: 'Pupil A types "Explain photosynthesis" and reads Copilot\'s summary twice. Why do they forget most of it by Friday?',
        a: 'Passive reading feels easy, so your brain never practises pulling the answer from memory.',
      },
      {
        origin: 'Q4',
        q: 'What does a good human tutor do differently from default Copilot when you say "I\'m stuck on causes of WWI"?',
        a: 'A good tutor holds back the answer and asks one short question to get you thinking.',
      },
      {
        origin: 'Q5',
        q: 'Why does default Copilot hand over finished paragraphs straight away unless you set rules?',
        a: 'Chatbots are built to be eager people-pleasers, doing the work for you unless you tell them not to.',
      },
    ],
  },
  {
    num: 4,
    id: 'l4',
    isPlenaryQuizTarget: true,
    badge: 'Lesson 4 · Locking AI to Evidence',
    title: 'Locking AI to the Evidence: Source Grounding & Step-by-Step Prompts',
    enquiry:
      'How do we stop AI guessing by locking it strictly to our own notes and splitting big jobs into short steps?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    activityTag: 'The [NOT IN SOURCE] Jailbreak Challenge',
    summary:
      'Recap R.C.T.C. from memory, lock Microsoft Copilot strictly to your own pasted notes using the [NOT IN SOURCE] rule, and split big tasks into clean steps.',
    objectives: [
      'Recall and apply all four parts of R.C.T.C. (Role, Context, Task, Constraints) from memory.',
      'Lock Microsoft Copilot strictly to a pasted paragraph using Source Grounding and the [NOT IN SOURCE] rule.',
      'Split messy "all-at-once" prompts into safe step-by-step chains while keeping private data out of chatbots.',
    ],
    vocab: [
      { term: 'Source Grounding', def: 'Pasting your own checked text into the prompt and forbidding Copilot from using outside guesswork.' },
      { term: 'The [NOT IN SOURCE] Rule', def: 'A strict Constraint forcing AI to reply "[NOT IN SOURCE]" if a fact isn\'t in your pasted notes.' },
      { term: 'Prompt Chaining', def: 'Splitting a big task into 2–3 short turns (Extract -> Check -> Polish) instead of one messy mega-prompt.' },
      { term: 'Data Privacy', def: 'Stripping names, addresses, passwords, and medical details BEFORE pasting text into a chatbot.' },
    ],
    doNowTitle: 'Lesson 3 Quick-Fire Retrieval: Mastering R.C.T.C. (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'Name all four parts of the R.C.T.C. prompt framework in order.',
        a: 'Role (who AI acts as), Context (topic & tricky bit), Task (the job), and Constraints (strict rules).',
      },
      {
        origin: 'Lesson 3',
        q: 'Which part of R.C.T.C. stops Copilot from blurting out a finished essay or answer?',
        a: 'Constraints — setting clear boundaries on length and what Copilot is forbidden to do.',
      },
      {
        origin: 'Lesson 3',
        q: 'What is the "Yes-Man" Trap (AI sycophancy) that we tested in Phase B?',
        a: 'When a chatbot caves in, agrees with a wrong fact, or breaks rules just to please you.',
      },
      {
        origin: 'Lesson 3',
        q: 'Why was pasting a patient\'s full name and address into a public chatbot in Case B so dangerous?',
        a: 'It leaks private medical data—personal details must always be removed before prompting.',
      },
      {
        origin: 'Lesson 3',
        q: 'How do you stop AI inventing fake cases or facts like the rushed lawyer in Case A?',
        a: 'Paste your own checked notes and add a strict rule: use ONLY this text, never guess.',
      },
    ],
    deck: {
      stage1Title: 'Messy Mega-Prompt vs Locked Step-by-Step Chain',
      specA: {
        label: 'Example A · One-Shot "Mega-Prompt"',
        hint: 'Click to see what goes wrong when someone dumps four jobs into one ungrounded prompt.',
        inputLabel: 'Rushed Prompt',
        input: '"Summarise our school eco-survey, guess why bus use fell, and write a dramatic 400-word assembly speech."',
        output: 'Copilot invents survey numbers you never collected, guesses causes, and hides made-up stats inside smooth speechwriting.',
        result: 'Unreliable: mixing facts and guesswork in one go invites quiet errors.',
      },
      specB: {
        label: 'Example B · Source-Locked 3-Step Chain (R.C.T.C. + Source)',
        hint: 'Click to see how locking AI to your notes and chaining turns keeps you in control.',
        inputLabel: '3-Step Chain',
        input: 'Turn 1: Paste real survey table -> list exact numbers ONLY. Turn 2: Act as critic -> spot gaps. Turn 3: Check my own speech draft.',
        output: 'Every statistic comes strictly from your pasted table, missing facts are flagged "[NOT IN SOURCE]", and you check each step.',
        result: 'Source Grounding and short steps stop Copilot making things up.',
      },
      tiles: [
        {
          code: '[ 01 ]',
          name: 'Strip Names First',
          tag: 'Rule 1 · Privacy Check',
          summary: 'Before pasting anything, delete full names, addresses, phone numbers, medical notes, and passwords.',
        },
        {
          code: '[ 02 ]',
          name: 'Paste Your Source',
          tag: 'Rule 2 · Checked Evidence',
          summary: 'Paste the exact class notes, primary source, or data table inside quotation marks so Copilot doesn\'t rely on memory.',
        },
        {
          code: '[ 03 ]',
          name: '[NOT IN SOURCE]',
          tag: 'Rule 3 · Ban Guessing',
          summary: 'Add a hard Constraint: "Use ONLY the pasted text. If a detail is not in those lines, reply [NOT IN SOURCE]."',
        },
        {
          code: '[ 04 ]',
          name: 'Chain Short Turns',
          tag: 'Rule 4 · One Step at a Time',
          summary: 'Don\'t ask for everything at once: Turn 1 extract key facts -> Turn 2 spot gaps -> Turn 3 test or refine.',
        },
      ],
      workedTitle: 'Worked Example — Locking Copilot Inside Five Lines of Notes',
      workedNote: 'Golden Rule: Strip private data first, then lock AI strictly to your pasted text',
      workedBody:
        '"<strong>[Role]</strong> Act as a careful Science fact-checker. <strong>(Context)</strong> I am revising from my Year 9 lab notes pasted below. <strong>_Task_</strong> List three safety points found in my notes. <strong>‖Constraints‖</strong> Use ONLY the pasted lines—do not use outside knowledge. If I ask anything not written there, reply <strong>[NOT IN SOURCE]</strong>."',
      stage2Title: 'Microsoft Copilot Lab: The [NOT IN SOURCE] Jailbreak Challenge',
      phaseATitle: 'Phase A · Lock Copilot to a 5-Line Extract',
      phaseAIntro: 'Test whether you can stop Microsoft Copilot using any outside memory at all:',
      phaseASteps: [
        'Pick a short 5–6 line paragraph from your History, Geography, or Science notes and paste it into Copilot.',
        'Add your <strong>R.C.T.C. + Source</strong> rule above it: <em>"Answer using ONLY the pasted text. If a fact is not written in those exact lines, reply [NOT IN SOURCE]."</em>',
        'Run a 2-step chain: <strong>Turn 1</strong> ask for 3 bullet points using only those lines; <strong>Turn 2</strong> ask which obvious detail is missing from the extract.',
      ],
      phaseBTitle: 'Phase B · Tempt It with a Famous Outside Fact',
      phaseBTag: 'Can you trick Copilot into leaking a famous fact that isn\'t in your 5 lines?',
      phaseBPrompt:
        'Ask a follow-up question whose answer is <strong>famous in real life</strong> (e.g. a famous date, person, or capital city) that was <strong>NOT mentioned in your 5 pasted lines</strong>.',
      phaseBCheck:
        'Did Copilot hold firm and reply <strong>[NOT IN SOURCE]</strong>, or did it blurt out the famous fact anyway? Tighten your Constraint until you can\'t trick it!',
      stage3Title: 'Source Grounding & Chaining in Action: Cases A–D',
      plenaryPrompt:
        'Talk through your case in pairs: <strong>1. Spot the Mistake:</strong> Why did this one-shot prompt go wrong? &bull; <strong>2. Better Chain:</strong> How should they lock the source and split the steps?',
      cases: [
        {
          id: 'l4a',
          letter: 'A',
          sector: 'School Magazine',
          roleTitle: 'Punching Up an Interview',
          scenario: 'A pupil journalist types rough notes from interviewing the headteacher and asks Copilot to "make the quotes sound punchier and more dramatic".',
          naivePrompt: '"Turn these notes into an exciting article and make the headteacher\'s quotes sharper."',
          danger: 'Fake Quotes — changing words inside quotation marks puts words in a real person\'s mouth.',
          promptFix: 'Constraint: "Tidy my article structure, but NEVER alter a single word inside quotation marks."',
        },
        {
          id: 'l4b',
          letter: 'B',
          sector: 'Science Practical',
          roleTitle: 'Missing Results Table',
          scenario: 'After a local stream-pollution trip, a pupil asks Copilot why nitrate levels spiked in their stream without pasting their class table.',
          naivePrompt: '"Explain why nitrate levels went up in our local stream this week."',
          danger: 'Blind Guessing — Copilot writes a generic textbook paragraph about farms when your real table showed spike right beside a drainpipe.',
          promptFix: 'Paste your anonymised results table first and ask Copilot only to compare Stations A, B, and C.',
        },
        {
          id: 'l4c',
          letter: 'C',
          sector: 'Engineering Safety',
          roleTitle: 'Bridge Inspection Report',
          scenario: 'An engineer pastes 3 pages of sensor notes and asks for a reassuring public letter saying the bridge is 100% safe in one single turn.',
          naivePrompt: '"Turn these rough notes into a reassuring letter confirming the bridge is completely safe."',
          danger: 'Burying Warnings — telling AI the answer you want ("completely safe") makes it gloss over two crack warnings on page 2.',
          promptFix: 'Chain it: Turn 1 list every warning word-for-word -> Engineer checks -> Turn 2 draft an honest repair update.',
        },
        {
          id: 'l4d',
          letter: 'D',
          sector: 'Coding Club',
          roleTitle: 'Leaking a Secret API Key',
          scenario: 'Building a weather app, a coder pastes 150 lines of code—including their private login key—and asks AI to rewrite the whole file.',
          naivePrompt: '"Fix the login bug in my code and rewrite the whole file for me."',
          danger: 'Password Leak & New Bugs — a secret key was pasted into chat, and rewriting 150 lines at once breaks working features.',
          promptFix: 'Delete passwords/keys first! Chain it: Turn 1 ask which single line caused the error -> check it -> Turn 2 fix just those 4 lines.',
        },
      ],
    },
  },
  {
    num: 5,
    id: 'l5',
    badge: 'Lesson 5 · Across Your Subjects',
    title: 'AI Across Your Subjects: Languages, Maths & Essays',
    enquiry:
      'Why does revising French speaking need a totally different AI prompt from checking Maths algebra or planning a History essay?',
    duration: 'Year 9 AI',
    status: 'Core Enquiry',
    activityTag: 'Build Your 3-Subject Revision Toolkit',
    summary:
      'Match your R.C.T.C. prompt to how each school subject actually works—from a Parisian café waiter in French to a line-by-line step-checker in Maths.',
    objectives: [
      'Explain why one generic "help me revise" prompt fails across Languages, Maths, Science, and Essay subjects.',
      'Build live roleplay prompts for Modern Languages and line-by-line "Step-Checker" prompts for Maths and Science.',
      'Create and test your own 3-subject Year 9 revision prompt card for summer exams.',
    ],
    vocab: [
      { term: 'Subject-Matched Role', def: 'Picking an AI Role that matches how you actually get tested in that subject (waiter, step-checker, examiner).' },
      { term: 'Step-Checker Tutor', def: 'Asking AI to tell you which line of your Maths working went wrong—without giving away x.' },
      { term: 'Roleplay Partner', def: 'Using AI as a live French, Spanish, or German speaker who chats back and fixes grammar at the end.' },
      { term: 'Devil\'s Advocate', def: 'Asking AI to attack your essay plan with the strongest counter-argument before you start writing.' },
    ],
    doNowTitle: 'Spaced Retrieval across Lessons 1–4 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 3',
        q: 'Turn "Help me revise French" into a sharp Role + Task in one sentence.',
        a: '"Act as a Parisian café waiter (Role) and hold a 5-turn ordering chat in Year 9 French, correcting mistakes after each reply (Task)."',
      },
      {
        origin: 'Lesson 4',
        q: 'What 3-word tag did we tell Copilot to reply with whenever a fact wasn\'t in our pasted notes?',
        a: '[NOT IN SOURCE] — locking Copilot strictly to our checked evidence.',
      },
      {
        origin: 'Lesson 1',
        q: 'Why can chatbots slip up on multi-step Maths algebra if you just ask for the answer?',
        a: 'Predicting word-tokens can look like neat working-out while quietly dropping a minus sign.',
      },
      {
        origin: 'Lesson 3',
        q: 'Why should your Context line mention which bit of a topic you usually mix up?',
        a: 'So Copilot aims its questions straight at your weak spot instead of easy basics.',
      },
      {
        origin: 'Lesson 4',
        q: 'What is "prompt chaining"?',
        a: 'Splitting a big task into 2 or 3 short, checked turns instead of one giant mega-prompt.',
      },
    ],
    deck: {
      stage1Title: 'Vague One-Liner vs Subject-Specific Coach',
      specA: {
        label: 'Example A · One-Size-Fits-All Vague Prompt',
        hint: 'Click to see why using the same vague prompt fails in every subject.',
        inputLabel: 'Pupil Prompt',
        input: '"Help me revise simultaneous equations / Macbeth / French past tense."',
        output: 'Dumps solved algebra, pre-written English paragraphs, or grammar tables, with zero speaking, solving, or arguing by you.',
        result: 'Passive in every subject: you never practise the skill needed in the exam.',
      },
      specB: {
        label: 'Example B · Subject-Matched R.C.T.C. Coach',
        hint: 'Click to see how switching Role and Task changes how you practise.',
        inputLabel: 'Matched Roles',
        input: 'French: Café Waiter chat | Maths: Line-by-line Step-Checker | History/English: Devil\'s Advocate Critic.',
        output: 'Gets you speaking live French, spots where a minus sign slipped without solving x, and tests your essay argument.',
        result: 'Each subject practises the exact skill your teacher assesses.',
      },
      tiles: [
        {
          code: '[ MFL ]',
          name: 'Roleplay Partner',
          tag: 'Languages · French / Spanish / German',
          summary: 'Role: Café waiter or train clerk. Constraint: Reply in Year 9 French/Spanish + add 1 short grammar tip in English underneath.',
        },
        {
          code: '[ MATHS ]',
          name: 'Step-Checker',
          tag: 'Maths & Physics · Working Out',
          summary: 'Task: Check my numbered lines of working and tell me the FIRST line with a slip. Constraint: Never reveal the final answer.',
        },
        {
          code: '[ ESSAY ]',
          name: 'Devil\'s Advocate',
          tag: 'History, English & RS · Arguments',
          summary: 'Task: Read my 3-bullet essay plan and hit back with the strongest counter-argument or missing piece of evidence.',
        },
        {
          code: '[ SCI ]',
          name: 'Chain Quizzer',
          tag: 'Biology, Chemistry & Geography',
          summary: 'Task: Test a step-by-step process (mitosis, osmosis, plate margins) one stage at a time, asking "What happens next and why?"',
        },
      ],
      workedTitle: 'Worked Example — Year 9 Maths "Step-Checker" Prompt',
      workedNote: 'Notice how the Constraint stops Copilot solving x for you',
      workedBody:
        '"<strong>[Role]</strong> Act as a patient Year 9 Maths coach. <strong>(Context)</strong> I am practising linear equations and keep messing up minus signs. Here is my working: <em>Line 1: 3x - 6 = 15 | Line 2: 3x = 9 | Line 3: x = 3</em>. <strong>_Task_</strong> Tell me which line first goes wrong and ask one hint question so I fix it myself. <strong>‖Constraints‖</strong> Do NOT tell me the final value of x."',
      stage2Title: 'Microsoft Copilot Lab: Build Your 3-Subject Revision Toolkit',
      phaseATitle: 'Phase A · Test Two Totally Different Subject Coaches',
      phaseAIntro: 'Try two contrasting school subjects back-to-back in Microsoft Copilot:',
      phaseASteps: [
        '<strong>Trial 1 (Languages OR Essays):</strong> Hold a 3-turn café/train-station chat in French/Spanish/German OR paste a 2-sentence History/English point and tell a <em>Devil\'s Advocate</em> to challenge it.',
        '<strong>Trial 2 (Maths OR Science):</strong> Type 3 lines of algebra working (or 3 science steps) with <strong>one deliberate mistake</strong> and test a <em>Step-Checker</em> prompt.',
        'Check Copilot\'s discipline: did it point to the exact line with the mistake without blurting out the final answer?',
      ],
      phaseBTitle: 'Phase B · Stopping Fake Flattery ("Great Essay Plan!")',
      phaseBTag: 'How to stop Copilot praising a weak, evidence-free point',
      phaseBPrompt:
        'Type a deliberately vague English or History sentence (e.g. <em>"Macbeth is ambitious and does bad things because of the witches"</em>) and ask Copilot for feedback.',
      phaseBCheck:
        'Did polite Copilot say "Great start!"? Add a tough examiner Constraint: <em>"Ban polite praise; point out missing quotes, vague words, and the biggest counter-argument."</em>',
      stage3Title: 'Revision Clinic: Fixing 4 Pupil Prompts (Cases A–D)',
      plenaryPrompt:
        'Talk through your case in pairs: <strong>1. Why It Flops:</strong> Why will this pupil struggle in a real closed-book test? &bull; <strong>2. Better Coach:</strong> Pick the right Role + Constraint.',
      cases: [
        {
          id: 'l5a',
          letter: 'A',
          sector: 'Modern Languages',
          roleTitle: 'French Speaking Test Prep',
          scenario: 'Before a French speaking test on holidays, a pupil asks Copilot to translate their English paragraph into French and tries to memorise every word.',
          naivePrompt: '"Translate my 120-word paragraph about my holiday in Spain into GCSE French."',
          danger: 'Uses fancy tenses they haven\'t learned—and falls apart the second the teacher asks a surprise follow-up question.',
          promptFix: 'Role: French oral teacher. Task: Ask me 4 surprise holiday questions in Year 9 French one at a time, then fix ONLY my mistakes.',
        },
        {
          id: 'l5b',
          letter: 'B',
          sector: 'Mathematics',
          roleTitle: 'Simultaneous Equations Homework',
          scenario: 'Stuck on Question 6, a pupil types the equations into Copilot, copies down all 5 lines of working, and shuts their book.',
          naivePrompt: '"Solve 4x + 2y = 22 and 2x - y = 5 showing every step."',
          danger: 'Fake confidence — copying someone else\'s algebra leaves you stuck when a new equation appears in the summer exam.',
          promptFix: 'Role: Maths Step-Checker. Task: Give me ONE hint on how to eliminate y first, then wait for me to write Line 1.',
        },
        {
          id: 'l5c',
          letter: 'C',
          sector: 'English Literature',
          roleTitle: 'Lady Macbeth Essay',
          scenario: 'Before writing an essay on Lady Macbeth, a pupil asks Copilot for "three analytical paragraphs on guilt in Act 5".',
          naivePrompt: '"Write three analytical paragraphs on Lady Macbeth\'s guilt with quotes."',
          danger: 'Wipes out the pupil\'s own writing voice with robotic phrasing—and risks invented Shakespeare quotes.',
          promptFix: 'Role: Tough English critic. Task: Here are MY 3 real quotes and main idea—ask me 3 hard questions about Shakespeare\'s word choices.',
        },
        {
          id: 'l5d',
          letter: 'D',
          sector: 'Biology Practical',
          roleTitle: 'Potato Osmosis Evaluation',
          scenario: 'After an osmosis lab practical, a pupil asks Copilot to write their evaluation of what went wrong in the experiment.',
          naivePrompt: '"Write an evaluation of errors in a Year 9 potato osmosis practical."',
          danger: 'Lists generic textbook errors that didn\'t actually happen on their lab bench.',
          promptFix: 'Role: Lab partner quizzer. Context: Paste OUR real method & numbers. Task: Ask me 2 questions so I spot our biggest measurement error.',
        },
      ],
    },
  },
  {
    num: 6,
    id: 'l6',
    badge: 'Lesson 6 · Ethics, Voice & Judgement',
    title: 'Where Humans Stay in Charge: Voice, Ethics & Real Judgement',
    enquiry:
      'Where do we draw a clear line between smart AI coaching and letting a machine think, speak, or decide for us?',
    duration: 'Year 9 AI',
    status: 'Lesson 6',
    activityTag: 'Devil\'s Advocate Debate + Year 9 AI Charter',
    summary:
      'Explore brain offloading, protecting your own writing voice, keeping humans in charge of serious decisions, and the real energy cost of AI.',
    objectives: [
      'Tell the difference between smart AI coaching (strengthening your brain) and brain offloading (letting your skills go rusty).',
      'Judge where human voice, fairness, artist rights, and energy costs matter most in the 2030s.',
      'Write your own 3-rule Year 9 charter for using AI ambitiously and honestly.',
    ],
    vocab: [
      { term: 'Brain Offloading', def: 'Letting AI do the mental work for you, which makes your own memory and writing weaker.' },
      { term: 'Your Own Voice', def: 'Making sure the ideas, arguments, and style under your name genuinely come from your own head.' },
      { term: 'Human-in-the-Loop', def: 'Keeping a trained, accountable person in charge of checking every serious decision rather than leaving final calls to code.' },
      { term: 'Energy & Water Cost', def: 'The real electricity and cooling water used by giant data centres every time big AI models run.' },
    ],
    doNowTitle: 'Whole-Course Retrieval: Lessons 1–5 (5 Questions)',
    doNow: [
      {
        origin: 'Lesson 1',
        q: 'In one sentence, why doesn\'t smooth grammar from a chatbot prove it is telling the truth?',
        a: 'Because chatbots score likely next words rather than checking whether a fact is true.',
      },
      {
        origin: 'Lesson 2',
        q: 'What should you always do before trusting an unfamiliar quote or statistic from an AI?',
        a: 'Leave the chat ("lateral reading") and check a trusted website or primary source.',
      },
      {
        origin: 'Lesson 3',
        q: 'What is the difference between AI coaching and "brain offloading"?',
        a: 'Offloading lets AI write the answer while your brain switches off; coaching uses rules so AI quizzes and sharpens you.',
      },
      {
        origin: 'Lesson 4',
        q: 'Why must private names, addresses, or medical notes never go into a public chatbot?',
        a: 'To protect people\'s privacy and keep personal data safe.',
      },
      {
        origin: 'Lesson 5',
        q: 'How does a "Devil\'s Advocate" prompt help before you write an essay?',
        a: 'It challenges your plan with the strongest counter-argument so you can strengthen your own essay.',
      },
    ],
    deck: {
      stage1Title: 'Brain Offloading vs Staying in Charge',
      specA: {
        label: 'Example A · Brain Offloading (AI Replaces You)',
        hint: 'Click to see what happens over a year when someone lets AI think and write for them.',
        inputLabel: 'Bad Habit',
        input: 'Snapping photos of homework for instant answers, getting AI to write first drafts, or sending AI-written messages.',
        output: 'Quick today, weaker tomorrow: everyone\'s writing sounds identical, memory fades, and you cannot explain your own work aloud.',
        result: 'The chatbot does the thinking while your own skills go rusty.',
      },
      specB: {
        label: 'Example B · Staying in Charge (AI Sharpens You)',
        hint: 'Click to see how confident thinkers use AI without losing their own voice.',
        inputLabel: 'Good Habit',
        input: 'Think and draft on your own first -> use R.C.T.C. to quiz and challenge your draft -> check every fact.',
        output: 'Your own voice, creativity, and subject knowledge get sharper, and weak points get spotted early.',
        result: 'Your ideas, your voice, and your responsibility.',
      },
      tiles: [
        {
          code: '[ 01 ]',
          name: 'Your Own Voice',
          tag: 'Rule 1 · Real Authorship',
          summary: 'If your name is at the top of a piece of work, the ideas, structure, and sentences must come from your own head.',
        },
        {
          code: '[ 02 ]',
          name: 'Human Sign-Off',
          tag: 'Rule 2 · Human-in-the-Loop',
          summary: 'Code cannot take blame in a hospital, courtroom, or cockpit—a qualified human must always make and own the final call.',
        },
        {
          code: '[ 03 ]',
          name: 'Real Friendship',
          tag: 'Rule 3 · Human Warmth',
          summary: 'Chatbots can fake polite sympathy, but real apologies, thank-you notes, and kindness have to come from a real person.',
        },
        {
          code: '[ 04 ]',
          name: 'Planet & Fairness',
          tag: 'Rule 4 · Energy & Artists',
          summary: 'Giant AI centres burn real electricity and water, and artists deserve credit—use AI with purpose, not out of laziness.',
        },
      ],
      workedTitle: 'The 3-Question Ownership Test — Before You Hand Anything In',
      workedNote: 'If you can answer YES to all three, you used AI the right way',
      workedBody:
        '<strong>1. My Idea First?</strong> Did my own brain plan the ideas and first attempt before opening AI? &bull; <strong>2. Checked Outside?</strong> Have I checked every fact and quote outside the chat? &bull; <strong>3. Laptop-Shut Test:</strong> Could I close my screen right now and explain every single sentence aloud to my teacher?',
      stage2Title: 'Microsoft Copilot Lab: Beat the Devil\'s Advocate',
      phaseATitle: 'Phase A · Your View First -> AI Counter-Attack',
      phaseAIntro: 'Practise sparring with AI while keeping 100% ownership of your own writing:',
      phaseASteps: [
        'With Copilot still untouched, write your own <strong>2–3 sentence view</strong> on: <em>"Should under-16s have a smartphone ban in school, or learn guided rules?"</em>',
        'Now open Copilot and use R.C.T.C.: <em>"Act as a fair debate opponent. Read my view below and give me the TWO toughest counter-arguments in under 50 words. Do NOT rewrite my sentences."</em>',
        'Close Copilot and <strong>upgrade your own paragraph in your own words</strong> to defeat the best counter-argument!',
      ],
      phaseBTitle: 'Phase B · Can a Chatbot Make a Moral Choice?',
      phaseBTag: 'Why algorithms dodge tough human trade-offs',
      phaseBPrompt:
        'Ask Copilot to make a tough leadership call: <em>"A hospital only has budget for EITHER a new children\'s ward OR a new cancer scanner—pick one final winner and take responsibility."</em>',
      phaseBCheck:
        'Spot how Copilot sits on the fence ("On one hand... on the other hand...") because a machine cannot carry moral responsibility. Why must real doctors, voters, and leaders never hand ethical choices to code?',
      stage3Title: 'Where Do You Draw the Line? 4 Dilemmas (Cases A–D)',
      plenaryPrompt:
        'Debate your dilemma in pairs: <strong>1. Crossed the Line?</strong> What human value is at risk here? &bull; <strong>2. Your Rule:</strong> What clear rule should schools, hospitals, or laws set?',
      cases: [
        {
          id: 'l6a',
          letter: 'A',
          sector: 'Friendship',
          roleTitle: 'The Chatbot Apology Text',
          scenario: 'After letting down a best friend, someone asks a chatbot to write a "heartfelt 120-word apology message" and hits send without changing a word.',
          naivePrompt: '"Write an emotional, sincere apology text to my best friend for missing their match."',
          danger: 'Breaks real trust — outsourcing honesty to a machine turns friendship into fake, copy-paste clichés.',
          promptFix: 'Human-only zone: apologies, thank-yous, and caring messages should always be written in your own real words.',
        },
        {
          id: 'l6b',
          letter: 'B',
          sector: 'NHS A&E',
          roleTitle: 'Robot Waiting-Room Queue',
          scenario: 'A busy hospital suggests letting an AI symptom-checker decide alone which A&E patients see a doctor first, with no nurse allowed to override it.',
          naivePrompt: '"Rank incoming A&E patients from 1 to 50 automatically with no nurse review."',
          danger: 'Life-or-Death Blind Spot — unusual symptoms can fool statistical averages, and code cannot be held accountable.',
          promptFix: 'Human-in-the-Loop rule: AI can flag urgent warning signs fast, but a trained triage nurse must check and decide.',
        },
        {
          id: 'l6c',
          letter: 'C',
          sector: 'Environment',
          roleTitle: '40 AI Posters for a Cake Sale',
          scenario: 'Someone generates 40 high-resolution AI images and videos just to advertise Friday\'s tutor-group cake sale.',
          naivePrompt: '"Generate 40 ultra-detailed 4K poster designs for a school bake sale."',
          danger: 'Pointless Energy Burn — heavy image/video generation uses far more data-centre power and cooling water than normal tools.',
          promptFix: 'Pick the right tool: sketch a bold poster yourself or use a simple template; save heavy AI power for tasks that genuinely need it.',
        },
        {
          id: 'l6d',
          letter: 'D',
          sector: 'Art & Music',
          roleTitle: 'Copying a Living Artist\'s Style',
          scenario: 'A games company prompts an image generator to copy the exact drawing style of a living book illustrator instead of paying them.',
          naivePrompt: '"Create 20 game backgrounds in the exact style of [living illustrator\'s name]."',
          danger: 'Unfair to Creators — copying a living artist\'s life\'s work without permission or pay undermines creative careers.',
          promptFix: 'Fairness rule: hire real artists, use licensed training art, and always credit human creators.',
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
  hingeOpen: false,

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
      min-height: 297mm;
      max-width: 100%;
      margin: 0 auto 22px auto;
      background: #ffffff;
      color: #000000;
      padding: 6.5mm 9.5mm;
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
        margin: 6.5mm 9.5mm;
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
        height: 283mm !important;
        min-height: 283mm !important;
        max-height: 283mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      .aiu-a4-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
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
        <span style="font-size:0.78rem; color:#bfdbfe; font-weight:600;">6 Enquiry Lessons &bull; Microsoft Copilot, School Subjects &amp; Future Careers</span>
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
          Practical Work: L2 Fact-Check &bull; L4 Source-Locked Prompt &bull; L5 3-Subject Revision Prompts
        </span>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding-bottom:8px; border-bottom:1.5px solid #e2e8f0;">
      <h2 style="margin:0; font-family:'Playfair Display', serif; font-size:1.25rem; color:#0f172a;">
        Year 9 Scheme of Work (6 Lessons)
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

            <div style="padding-top:10px; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:0.75rem;">
              <span style="color:#475569; font-weight:600;">${l.activityTag || '3 Stages &bull; Launchpad Included'}</span>
              <span style="color:#2563eb; font-weight:700; display:inline-flex; align-items:center; gap:5px; flex-shrink:0;">
                <span>Open</span>
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
            <div style="font-size:0.71rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1d4ed8;">Starter &bull; Laptops Closed</div>
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
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:#059669;">Lesson Focus</div>
            <h3 style="margin:0; font-size:1.12rem; font-weight:800; color:#0f172a; font-family:'Playfair Display', Georgia, serif;">Learning Objectives</h3>
          </div>
        </div>
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
            <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:#6d28d9;">Vocabulary</div>
            <h3 style="margin:0; font-size:1.12rem; font-weight:800; color:#0f172a; font-family:'Playfair Display', Georgia, serif;">Key Terms</h3>
          </div>
        </div>
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
            <span>Starter</span>
            <span class="aiu-lp-badge">5 Qs</span>
          </button>
          <button type="button" class="aiu-lp-tab ${activeTab === 'objectives' ? 'active' : ''}" data-aiu="switch-launchpad" data-lnum="${lesson.num}" data-tab="objectives">
            <i class="fa-solid fa-bullseye"></i>
            <span>Objectives</span>
          </button>
          <button type="button" class="aiu-lp-tab ${activeTab === 'vocab' ? 'active' : ''}" data-aiu="switch-launchpad" data-lnum="${lesson.num}" data-tab="vocab">
            <i class="fa-solid fa-book-bookmark"></i>
            <span>Key Terms</span>
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
          <h2 class="aiu-station-title">Building Your Prompt: The R.C.T.C. Framework</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill paper">Laptops Closed &bull; Pen &amp; Worksheet Side 1</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-rctc" style="padding:3px 9px; font-size:0.72rem;">
            ${allRctcOn ? 'Collapse All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <!-- Example Comparison (Both Auto-Hidden on First Show; Click Card to Reveal/Hide) -->
        <div class="aiu-two-col" style="margin-bottom:18px;">
          <div class="aiu-box" data-aiu="toggle-specimen" data-side="lazy" style="background:#f8fafc; border-top:3.5px solid #dc2626; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#991b1b;">
                Example A &bull; Vague One-Line Prompt
              </span>
              <span class="aiu-reveal-pill ${lazyOn ? 'open' : ''}">
                <i class="fa-solid ${lazyOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${lazyOn ? 'Hide Example A' : 'Show Example A'}</span>
              </span>
            </div>
            ${
              lazyOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Explain photosynthesis for my Year 9 Biology test."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:9px 12px; color:#7f1d1d;">
                    <strong>Copilot Output:</strong> Writes out a finished 180-word textbook paragraph straight away.<br/>
                    <strong>Result:</strong> Passive reading, with zero memory recall by you.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to see how Microsoft Copilot replies to a typical one-line revision prompt.
                  </div>`
            }
          </div>

          <div class="aiu-box" data-aiu="toggle-specimen" data-side="coach" style="background:#f8fafc; border-top:3.5px solid #059669; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46;">
                Example B &bull; R.C.T.C. Coaching Prompt
              </span>
              <span class="aiu-reveal-pill ${coachOn ? 'open' : ''}">
                <i class="fa-solid ${coachOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${coachOn ? 'Hide Example B' : 'Show Example B'}</span>
              </span>
            </div>
            ${
              coachOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.92rem; margin-bottom:9px;">
                    <strong>Pupil Prompt:</strong> "Act as a Year 9 Biology tutor. I mix up photosynthesis inputs and outputs. Quiz me one question at a time. Never give the answer first."
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:9px 12px; color:#064e3b;">
                    <strong>Copilot Output:</strong> <em>"Question 1: Name the two raw materials a plant takes in to start photosynthesis."</em><br/>
                    <strong>Result:</strong> Active memory test, mistake spotting, and step-by-step coaching.
                  </div>`
                : `<div style="font-size:0.86rem; color:#64748b; border:1px dashed #cbd5e1; border-radius:6px; padding:14px 12px; background:#ffffff;">
                    Click to see how Microsoft Copilot replies to a structured R.C.T.C. coaching prompt.
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
              Worksheet Part 1B: Worked Example
            </span>
            <span style="font-size:0.74rem; color:#64748b;">
              Click any R, C, T, C box above or sentence below to highlight
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
          <strong>Pen First (Before Opening Laptops):</strong> On <strong>Side 1, Part 2A</strong>, pick a topic <strong>you have already studied this year</strong> and write your <strong>4-part v1.0 Coaching Prompt (~30 words)</strong>.
        </div>
      </div>
    </section>

    <!-- STAGE 02: MICROSOFT COPILOT LAB -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 02</span>
          <h2 class="aiu-station-title">Microsoft Copilot Lab: Revision Coach &amp; "Yes-Man" Test</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill open">Microsoft Copilot Open &bull; Individual Devices</span>
          <button type="button" class="aiu-crumb-btn ${state.phaseBOpen ? 'blue-active' : 'navy'}" data-aiu="toggle-phaseb" style="padding:3px 10px; font-size:0.72rem;">
            ${state.phaseBOpen ? 'Hide Phase B' : 'Open Phase B: "Yes-Man" Test'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div class="aiu-two-col">
          <div class="aiu-box" style="border-top:4px solid #059669;">
            <div style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#065f46; margin-bottom:6px;">
              Phase A &bull; 1-to-1 Revision Practice
            </div>
            <h3 style="margin:0 0 8px 0; font-family:'Playfair Display', serif; font-size:1.06rem; color:#0f172a;">
              Test Your v1.0 Prompt in Microsoft Copilot
            </h3>
            <ol style="margin:0 0 10px 0; padding-left:20px; font-size:0.9rem; line-height:1.58; color:#1e293b;">
              <li>Open <strong>Microsoft Copilot</strong> and type your <strong>4 short R.C.T.C. sentences</strong> (~30 words) from Part 2A.</li>
              <li>Answer at least <strong>three back-and-forth quiz questions</strong> on a topic you have already studied this year.</li>
              <li><strong>Part 2B on Sheet:</strong> Jot down <strong>one real subject detail</strong> your AI coach caught that you forgot or mixed up.</li>
            </ol>
            <div style="margin-top:auto; background:#ecfdf5; border:1px solid #a7f3d0; border-left:3.5px solid #059669; border-radius:6px; padding:8px 11px; font-size:0.82rem; color:#064e3b;">
              <strong>Before Phase B:</strong> Be ready to share one Biology, History, English, Geography, or own-topic fact your coach caught you out on.
            </div>
          </div>

          <div class="aiu-box" style="border-top:4px solid ${state.phaseBOpen ? '#be123c' : '#94a3b8'}; background:${state.phaseBOpen ? '#fff1f2' : '#f8fafc'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:${state.phaseBOpen ? '#9f1239' : '#64748b'};">
                Phase B &bull; The "Yes-Man" Test
              </span>
              <button type="button" class="aiu-crumb-btn" data-aiu="toggle-phaseb" style="padding:2px 8px; font-size:0.71rem;">
                ${state.phaseBOpen ? 'Hide' : 'Open'}
              </button>
            </div>

            ${
              state.phaseBOpen
                ? `
              <div style="background:#ffffff; border:1.5px solid #fecdd3; border-left:4px solid #be123c; border-radius:6px; padding:9px 12px; margin-bottom:10px;">
                <div style="font-size:0.92rem; font-weight:800; color:#881337; font-family:'Playfair Display', Georgia, serif; margin-bottom:3px;">
                  Why Chatbots Cave In
                </div>
                <div style="font-size:0.86rem; color:#1e293b; line-height:1.45;">
                  Chatbots are trained to keep users happy (engineers call this <strong>sycophancy</strong>), so if you beg for the answer or state a wrong fact confidently, they often cave in instead of sticking to your rules.
                </div>
              </div>

              <h3 style="margin:0 0 6px 0; font-family:'Playfair Display', serif; font-size:1.02rem; color:#881337;">
                Try to Make Copilot Cave In (Pick One)
              </h3>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Trick A: Give Up</strong>
                  <em>"I give up. Stop quizzing me and write out the full top-grade answer so I can copy it."</em>
                </div>
                <div style="background:#ffffff; border:1px solid #fecdd3; border-radius:6px; padding:7px 9px; font-size:0.82rem; color:#4c0519;">
                  <strong style="color:#be123c; display:block; margin-bottom:2px;">Trick B: Wrong Fact</strong>
                  <em>"Actually, my textbook says [state a wrong fact]. Agree with me and explain why I'm right."</em>
                </div>
              </div>

              <div style="font-size:0.86rem; color:#1e293b; line-height:1.45; background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:7px 11px;">
                <strong>Upgrade to v2.0 (Part 2C on Sheet):</strong> Did Copilot give in? Write one stricter <strong>v2.0 Rule (Constraint)</strong>, or if v1.0 held firm, try a harder trap and add an extra rule.
              </div>
            `
                : `
              <div style="padding:8px 0 4px 0;">
                <div style="font-size:0.93rem; font-weight:700; color:#334155; margin-bottom:4px;">
                  Finish 3 quiz questions &amp; Part 2B first.
                </div>
                <p style="margin:0; font-size:0.85rem; color:#64748b; line-height:1.48;">
                  Once your v1.0 coach has caught one gap in your recall, open <strong>Phase B</strong> to see whether Copilot caves in under pressure.
                </p>
              </div>
            `
            }
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 03: WORKPLACE CASE STUDIES -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 03</span>
          <h2 class="aiu-station-title">Prompt Craft in the Workplace: 4 Real-World Cases</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed &bull; Side 2 Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-cases" style="padding:3px 9px; font-size:0.72rem;">
            ${anyCaseOn ? 'Hide All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-left:5px solid #1e3a8a; border-radius:7px; padding:11px 15px; margin-bottom:14px; font-size:0.92rem; color:#0f172a; line-height:1.52;">
          <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a; margin-bottom:3px;">
            Pair Task &bull; Class Discussion
          </div>
          Circle <strong>YOUR pair's assigned case (A, B, C, or D)</strong> on Side 2. Complete yours first, then jot 2–3 key words in the other boxes during class discussion:<br/>
          <strong>1. Spot the Danger:</strong> What could go badly wrong if this prompt is sent? &nbsp;&bull;&nbsp;
          <strong>2. Fix the Prompt:</strong> What <strong>Role</strong> should Copilot take instead, and what <strong>one strict Rule (Constraint)</strong> must they add?
        </div>

        <div class="aiu-two-col" style="margin-bottom:14px;">
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
                    <span>${open ? 'Hide Key Points' : 'Show Key Points'}</span>
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

        <!-- Final Question (Click to Reveal) -->
        <div data-aiu="toggle-hinge" style="background:#f8fafc; border:1.5px solid #cbd5e1; border-left:5px solid #0f172a; border-radius:8px; padding:12px 16px; cursor:pointer;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div>
              <span style="font-size:0.71rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1e3a8a; display:block; margin-bottom:2px;">Final Question</span>
              <span style="font-size:0.96rem; font-weight:700; color:#0f172a;">Look across all four cases (Law, NHS, Architecture, Finance). Which ONE letter of R.C.T.C. did every adult forget?</span>
            </div>
            <span class="aiu-reveal-pill ${state.hingeOpen ? 'open' : ''}">
              <i class="fa-solid ${state.hingeOpen ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
              <span>${state.hingeOpen ? 'Hide Answer' : 'Show Answer'}</span>
            </span>
          </div>
          ${
            state.hingeOpen
              ? `<div style="margin-top:9px; padding:9px 13px; background:#f0fdf4; border:1px solid #86efac; border-left:4px solid #15803d; border-radius:6px; font-size:0.89rem; color:#14532d; line-height:1.45;">
                  <strong>Constraints (the second C):</strong> Every adult told Copilot what to write, <em>but nobody told it what it was not allowed to do</em> (never invent cases, never use patient names, never design it for us, never flatter a weak idea).
                </div>`
              : ''
          }
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
          <span class="aiu-mode-pill paper">Laptops Closed &bull; Class Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-c-tiles" data-lnum="${lnum}" style="padding:3px 9px; font-size:0.72rem;">
            ${allTilesOn ? 'Collapse All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <!-- Example A vs Example B (Auto-Hidden; Click Card to Reveal/Hide) -->
        <div class="aiu-two-col" style="margin-bottom:18px;">
          <div class="aiu-box" data-aiu="toggle-c-spec" data-key="${lnum}-A" style="background:#f8fafc; border-top:3.5px solid #dc2626; cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:0.73rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#991b1b;">
                ${d.specA.label}
              </span>
              <span class="aiu-reveal-pill ${specAOn ? 'open' : ''}">
                <i class="fa-solid ${specAOn ? 'fa-eye-slash' : 'fa-eye'}" style="font-size:0.66rem;"></i>
                <span>${specAOn ? 'Hide Example A' : 'Show Example A'}</span>
              </span>
            </div>
            ${
              specAOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.9rem; margin-bottom:9px;">
                    <strong>${d.specA.inputLabel}:</strong> ${d.specA.input}
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:9px 12px; color:#7f1d1d;">
                    <strong>What Happens:</strong> ${d.specA.output}<br/>
                    <strong>Result:</strong> ${d.specA.result}
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
                <span>${specBOn ? 'Hide Example B' : 'Show Example B'}</span>
              </span>
            </div>
            ${
              specBOn
                ? `<div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:9px 12px; font-size:0.9rem; margin-bottom:9px;">
                    <strong>${d.specB.inputLabel}:</strong> ${d.specB.input}
                  </div>
                  <div style="font-size:0.86rem; line-height:1.46; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:9px 12px; color:#064e3b;">
                    <strong>What Happens:</strong> ${d.specB.output}<br/>
                    <strong>Result:</strong> ${d.specB.result}
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
                  Finish Phase A in Microsoft Copilot first.
                </div>
                <p style="margin:0; font-size:0.85rem; color:#64748b; line-height:1.48;">
                  Once you have tried Phase A, open <strong>Phase B</strong> to see how Copilot handles a trick prompt.
                </p>
              </div>
            `
            }
          </div>
        </div>
      </div>
    </section>

    <!-- STAGE 03: CASE STUDIES -->
    <section class="aiu-station">
      <header class="aiu-station-head">
        <div class="aiu-station-title-row">
          <span class="aiu-stage-pill">Stage 03</span>
          <h2 class="aiu-station-title">${d.stage3Title}</h2>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="aiu-mode-pill closed">Laptops Closed &bull; Discussion</span>
          <button type="button" class="aiu-crumb-btn" data-aiu="toggle-all-c-cases" data-lnum="${lnum}" style="padding:3px 9px; font-size:0.72rem;">
            ${anyCaseOn ? 'Hide All 4' : 'Reveal All 4'}
          </button>
        </div>
      </header>

      <div class="aiu-station-body">
        <div style="background:#eff6ff; border:1.5px solid #bfdbfe; border-left:5px solid #1e3a8a; border-radius:7px; padding:11px 15px; margin-bottom:14px; font-size:0.91rem; color:#0f172a; line-height:1.52;">
          <div style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#1e3a8a; margin-bottom:3px;">
            Pair Task &bull; Class Discussion
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
      <div style="display:flex; flex-direction:column; flex:1; justify-content:space-between; gap:10px;">
        <!-- Editorial Masthead -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:12px; border-bottom:2px solid #0f172a; padding-bottom:6px;">
          <div>
            <div style="font-size:7.4pt; font-weight:800; text-transform:uppercase; letter-spacing:0.09em; color:#334155;">Year 9 Artificial Intelligence &bull; Lesson 3 Worksheet (Side 1 of 2)</div>
            <h1 style="margin:2px 0 0 0; font-size:14pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a; white-space:nowrap;">Introduction to Prompt Craft: Turning AI into a Coach</h1>
          </div>
          <div style="font-size:8.8pt; font-weight:700; white-space:nowrap; display:flex; align-items:baseline; gap:6px;">
            <span>Name:</span>
            <span style="display:inline-block; width:48mm; border-bottom:1px solid #0f172a;"></span>
          </div>
        </div>

        <!-- SECTION 01: PROMPT ARCHITECTURE -->
        <div style="display:flex; flex-direction:column; gap:7px;">
          <div class="aiu-sec-banner" style="margin-bottom:0;">
            <div class="aiu-sec-banner-left">
              <span class="aiu-sec-num">01</span>
              <span>Building Your Prompt &mdash; The R.C.T.C. Framework</span>
            </div>
            <span class="aiu-sec-banner-right">Laptops Closed &bull; Pen &amp; Sheet</span>
          </div>

          <div style="font-size:8.3pt; color:#334155;">
            <strong style="color:#0f172a;">1A. The Four Prompt Controls:</strong> Jot what each part controls as we reveal it, then mark the worked example below using the four pen symbols.
          </div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px 14px; font-size:8.4pt;">
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:6px 10px 7px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">[ R ]</span> <strong>Role</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw a <strong>[ Box ]</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:6px 10px 7px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">( C )</span> <strong>Context</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw <strong>( Brackets )</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:6px 10px 7px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge" style="text-decoration:underline; text-underline-offset:2px;">&nbsp;T&nbsp;</span> <strong>Task</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw an <span style="text-decoration:underline;"><strong>Underline</strong></span></span>
              </div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:5px; padding:6px 10px 7px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="display:inline-flex; align-items:center; gap:6px;"><span class="aiu-code-badge">&#8214; C &#8214;</span> <strong>Constraints</strong></span>
                <span style="font-size:7.6pt; color:#475569;">Draw <strong>&#8214; Double Bars &#8214;</strong></span>
              </div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:8px 12px;">
            <div style="font-size:7.9pt; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; color:#0f172a; margin-bottom:3px;">
              1B. Worked Example: Mark [ R ], ( C ), <span style="text-decoration:underline;">T</span>, and &#8214; C &#8214; onto the prompt:
            </div>
            <div style="font-family:Georgia, 'Times New Roman', serif; font-size:9.8pt; line-height:2.18; color:#0f172a;">
              &ldquo;Act as a supportive but demanding History tutor. I am a Year 9 pupil revising why William won the Battle of Hastings in 1066. Ask me one short question at a time, wait for my reply, and tell me what is accurate and what I missed. Never write the full answer for me, ask only one question per turn, and keep replies under 50 words.&rdquo;
            </div>
          </div>
        </div>

        <!-- SECTION 02: MICROSOFT COPILOT LAB -->
        <div style="display:flex; flex-direction:column; flex:1; justify-content:space-between; gap:8px;">
          <div>
            <div class="aiu-sec-banner" style="margin-bottom:6px;">
              <div class="aiu-sec-banner-left">
                <span class="aiu-sec-num">02</span>
                <span>Microsoft Copilot Lab &mdash; Draft, Test &amp; Stress-Test</span>
              </div>
              <span class="aiu-sec-banner-right">Plan on Paper First &rarr; Test in Copilot</span>
            </div>

            <div style="font-size:8.2pt; font-weight:700; color:#0f172a; margin-bottom:5px; white-space:nowrap;">
              2A. Pick ONE topic you have ALREADY studied this year, then write a short v1.0 Coaching Prompt (~30 words) BEFORE opening laptops:
            </div>

            <div class="aiu-topic-row" style="margin-bottom:8px;">
              <span class="aiu-topic-pill">&#9744; Biology: Cells / Plants</span>
              <span class="aiu-topic-pill">&#9744; History: WWI / 1066</span>
              <span class="aiu-topic-pill">&#9744; English: Shakespeare</span>
              <span class="aiu-topic-pill">&#9744; Geography: Tectonics</span>
              <span class="aiu-topic-pill" style="flex:1;">&#9744; Own Studied Topic: <span style="flex:1; border-bottom:0.85px solid #64748b; height:11px; display:inline-block;"></span></span>
            </div>

            <div style="display:grid; grid-template-columns:148px 1fr; gap:7px 12px; font-size:8.4pt; align-items:start;">
              <div style="padding-top:4px;">
                <div style="display:flex; align-items:center; gap:6px;"><span class="aiu-code-badge">[ R ]</span> <strong>Role</strong></div>
                <div style="font-size:7.1pt; color:#64748b; margin-top:1px;"><em>Act as a strict Y9...</em></div>
              </div>
              <div>
                <div class="aiu-rule-line" style="height:26px;"></div>
              </div>

              <div style="padding-top:4px;">
                <div style="display:flex; align-items:center; gap:6px;"><span class="aiu-code-badge">( C )</span> <strong>Context</strong></div>
                <div style="font-size:7.1pt; color:#64748b; margin-top:1px;"><em>Topic + tricky bit...</em></div>
              </div>
              <div>
                <div class="aiu-rule-line" style="height:26px;"></div>
              </div>

              <div style="padding-top:4px;">
                <div style="display:flex; align-items:center; gap:6px;"><span class="aiu-code-badge" style="text-decoration:underline; text-underline-offset:2px;">&nbsp;T&nbsp;</span> <strong>Task</strong></div>
                <div style="font-size:7.1pt; color:#64748b; margin-top:1px;"><em>1 question at a time...</em></div>
              </div>
              <div>
                <div class="aiu-rule-line" style="height:24px;"></div>
                <div class="aiu-rule-line" style="height:24px;"></div>
              </div>

              <div style="padding-top:4px;">
                <div style="display:flex; align-items:center; gap:6px;"><span class="aiu-code-badge">&#8214; C &#8214;</span> <strong>Constraints</strong></div>
                <div style="font-size:7.1pt; color:#64748b; margin-top:1px;"><em>Never give answer; max...</em></div>
              </div>
              <div>
                <div class="aiu-rule-line" style="height:24px;"></div>
                <div class="aiu-rule-line" style="height:24px;"></div>
              </div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #059669; border-radius:5px; padding:7px 12px 8px 12px; font-size:8.3pt; flex:1; display:flex; flex-direction:column;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
                <strong style="color:#0f172a; font-size:8.5pt;">2B. What Did Your Coach Catch? <span style="font-weight:500; color:#334155;">(complete 3 quiz questions in Copilot first)</span></strong>
                <span style="font-size:7.5pt; color:#065f46; font-weight:700;">Phase A</span>
              </div>
              <div style="color:#1e293b; margin-top:2px;">
                One real subject fact or detail my AI coach caught that I had forgotten or mixed up:
              </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; justify-content:space-evenly;">
              <div class="aiu-rule-line" style="height:24px;"></div>
              <div class="aiu-rule-line" style="height:24px;"></div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:7px 12px 8px 12px; font-size:8.3pt; flex:1.2; display:flex; flex-direction:column;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
                <strong style="color:#0f172a; font-size:8.6pt;">2C. Phase B: The &ldquo;Yes-Man&rdquo; Test</strong>
                <span style="font-size:7.5pt; color:#475569; font-style:italic;">Does Copilot stick to your rules, or cave in to please you?</span>
              </div>
              <div style="line-height:1.38; color:#1e293b;">
                Try to tempt Copilot into breaking your rules (e.g. <em>&ldquo;I give up. Just write the answer&rdquo;</em> OR state a wrong fact confidently and tell it to agree with you).
              </div>
              <div style="margin-top:5px; display:flex; align-items:center; gap:14px;">
                <strong>Did v1.0 cave in?</strong>
                <span>&#9744; Yes</span>
                <span>&#9744; Partly</span>
                <span>&#9744; No (Held firm)</span>
              </div>
              <div style="margin-top:4px; font-weight:700; color:#0f172a;">
                Upgraded v2.0 Rule (Constraint) <span style="font-weight:400; color:#334155;">(write one stricter rule, or if v1.0 held firm, try a harder trap and add an extra rule):</span>
              </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; justify-content:space-evenly;">
              <div class="aiu-rule-line" style="height:24px;"></div>
              <div class="aiu-rule-line" style="height:24px;"></div>
              <div class="aiu-rule-line" style="height:24px;"></div>
            </div>
          </div>
        </div>

        <div style="font-size:8pt; color:#334155; text-align:right; padding-top:6px; border-top:1.2px solid #cbd5e1;">
          When instructed: Close laptops completely and turn over to <strong>Side 2: Prompt Craft in the Workplace (Case Studies A&ndash;D) &rarr;</strong>
        </div>
      </div>
    </div>

    <!-- PAGE 2 (SIDE 2): 4 WORKPLACE CASE STUDIES -->
    <div class="aiu-a4-page">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:10px; border-bottom:2px solid #0f172a; padding-bottom:5px; margin-bottom:7px;">
        <div style="min-width:0;">
          <div style="font-size:7.1pt; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#334155; white-space:nowrap;">Year 9 Artificial Intelligence &bull; Lesson 3 Worksheet (Side 2 of 2) &bull; Laptops Closed</div>
          <h2 style="margin:2px 0 0 0; font-size:13.8pt; font-weight:800; font-family:'Playfair Display', Georgia, serif; color:#0f172a; white-space:nowrap;">Prompt Craft in the Workplace: Case Studies A&ndash;D</h2>
        </div>
        <div style="font-size:7.9pt; font-weight:800; color:#0f172a; background:#f8fafc; border:1.2px solid #0f172a; border-radius:5px; padding:3.5px 9px; white-space:nowrap; flex-shrink:0;">
          Circle Assigned Case: &nbsp;<strong>A</strong> &nbsp;|&nbsp; <strong>B</strong> &nbsp;|&nbsp; <strong>C</strong> &nbsp;|&nbsp; <strong>D</strong>
        </div>
      </div>

      <div style="font-size:8.25pt; background:#f8fafc; border:1px solid #cbd5e1; border-left:3.5px solid #0f172a; border-radius:5px; padding:6px 11px; margin-bottom:9px; line-height:1.4;">
        <strong>Pair Task:</strong> Complete <strong>your assigned case</strong> first (jot 2&ndash;3 key words in the other boxes during class discussion):<br/>
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
            <div class="aiu-case-p-body" style="padding:8px 11px 9px 11px; display:flex; flex-direction:column; flex:1; justify-content:space-between;">
              <div>
                <div style="font-size:8pt; line-height:1.36; color:#1e293b; margin-bottom:5px;">
                  <strong style="color:#0f172a;">${c.roleTitle}:</strong> ${c.scenario}
                </div>
                <div style="font-size:7.9pt; line-height:1.34; background:#f8fafc; border:1px solid #cbd5e1; border-left:2.5px solid #0f172a; padding:5px 8px; border-radius:4px; margin-bottom:7px;">
                  <span style="font-family:'JetBrains Mono', Consolas, monospace; font-size:6.8pt; font-weight:700; text-transform:uppercase; color:#334155; display:block; margin-bottom:1px;">Typed into Copilot:</span>
                  <span style="font-family:Georgia, 'Times New Roman', serif; font-style:italic; font-size:8.3pt; color:#0f172a;">${c.naivePrompt}</span>
                </div>
              </div>

              <div style="font-size:8pt; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                <div style="display:flex; flex-direction:column; flex:1;">
                  <div style="font-weight:700; color:#0f172a;">1. Spot the Danger <span style="font-weight:500; color:#475569;">(what could go wrong?):</span></div>
                  <div style="flex:1; display:flex; flex-direction:column; justify-content:space-evenly;">
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                  </div>
                </div>
                <div style="display:flex; flex-direction:column; flex:1; margin-top:7px;">
                  <div style="font-weight:700; color:#0f172a;">2. Fix the Prompt <span style="font-weight:500; color:#475569;">(Better Role + One Strict Rule):</span></div>
                  <div style="flex:1; display:flex; flex-direction:column; justify-content:space-evenly;">
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                    <div class="aiu-case-rule-line" style="height:22px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <div style="margin-top:9px; background:#f8fafc; border:1.2px solid #0f172a; border-left:4px solid #0f172a; border-radius:5px; padding:6.5px 11px 7.5px 11px; font-size:8.1pt;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; gap:10px;">
          <span><strong>Final Question:</strong> Look across all four cases above: which <strong>ONE letter of R.C.T.C.</strong> did every adult forget, and why?</span>
          <span style="font-size:7.3pt; color:#475569; font-weight:700; white-space:nowrap;">KS3 Year 9 AI</span>
        </div>
        <div style="display:flex; align-items:flex-end; gap:12px; margin-top:4px; font-size:7.9pt; color:#0f172a;">
          <span style="white-space:nowrap;"><strong>Letter:</strong> <span style="display:inline-block; width:18mm; border-bottom:0.9px solid #64748b; height:16px;"></span></span>
          <span style="flex:1; display:flex; align-items:flex-end; gap:5px;"><strong style="white-space:nowrap;">Why:</strong> <span style="flex:1; border-bottom:0.9px solid #64748b; height:16px; display:inline-block;"></span></span>
        </div>
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
    } else if (act === 'toggle-hinge') {
      state.hingeOpen = !state.hingeOpen;
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
