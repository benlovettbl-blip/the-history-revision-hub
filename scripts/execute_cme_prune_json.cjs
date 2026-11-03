const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  console.log('Processing:', filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
  const data = JSON.parse(jsonStr);

  // 1. Locate Lesson 7 (id: 'lesson_8', KT 2.3)
  const l7 = data.lessons.find(l => l.id === 'lesson_8');
  if (!l7) {
    console.error('Lesson 8 not found in', filePath);
    process.exit(1);
  }

  // Update Narrative Block 5
  const newSourceE = {
    id: "cme_l7_source_e",
    letter: "E",
    title: "Source E: The Khartoum Resolution and the 'Three Nos' (1 September 1967)",
    src: "/images/cme_khartoum_summit_1967.jpg",
    image: "/images/cme_khartoum_summit_1967.jpg",
    source: "/images/cme_khartoum_summit_1967.jpg",
    caption: "Arab heads of state at the Khartoum Summit in Sudan, where the Arab League adopted the famous 'Three Nos' resolution on 1 September 1967.",
    desc: "Archival photograph of Arab leaders at the Khartoum Summit formulating the 'Three Nos' resolution (1967).",
    provenance: "Arab League Summit Records / Sudanese Ministry of Information Archives, Khartoum, September 1967.",
    citation: "Khartoum Summit Declaration, Arab League Official Gazette, 1 September 1967.",
    hinge_question: "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
    source_context: "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
    context: "Arab leaders issued the 'Three Nos' at Khartoum, rejecting all peace, recognition, and negotiation with Israel.",
    question_badge: "Author’s Purpose",
    question_type: "Author’s Purpose",
    enquiry_question: "What was the primary purpose of the Arab League issuing the 'Three Nos' in Source E?",
    model_answer: "The purpose was to restore Arab pride after the humiliating 1967 defeat and demonstrate to the Arab public that leaders like Nasser would never surrender Palestinian land or accept Israel’s existence.",
    provenance_clues: {
      author: "Arab heads of state including Gamal Abdel Nasser of Egypt and King Faisal of Saudi Arabia.",
      audience: "The Arab public and the international community.",
      motive: "To prevent any individual Arab nation from breaking ranks to sign a separate peace treaty with Israel.",
      hinge_question: "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
    },
    teacher_notes: {
      source_context: "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
    }
  };

  l7.narrative_blocks[4] = {
    title: "The Khartoum Conference & The 'Three Nos'",
    paragraphs: [
      "<span class=\"para-ref\">[5.1]</span> In August and September 1967, leaders from eight Arab states gathered in Sudan for the **Khartoum Summit** to formulate a unified response to their catastrophic defeat in the Six-Day War. Determined to prove to their domestic populations that military loss did not mean political surrender, Arab leaders refused to negotiate with the victorious Israeli state.",
      "<span class=\"para-ref\">[5.2]</span> On **1 September 1967**, the summit issued the famous **Khartoum Resolution**, which laid down the defiant policy known as the **'Three Nos'**: **no peace with Israel, no recognition of Israel, and no negotiations with Israel**. This total rejection of compromise destroyed early hopes for a diplomatic breakthrough under UN Resolution 242, entrenching a permanent diplomatic stalemate and convincing Israeli leaders to maintain permanent military control over the occupied territories."
    ],
    act: 5,
    act_title: "Stage 5: The Khartoum Conference & The 'Three Nos' — Why did the Arab states reject territorial compromise with Israel?",
    theme_heading: "The Khartoum Conference & The 'Three Nos'",
    text: "<span class=\"para-ref\">[5.1]</span> In August and September 1967, leaders from eight Arab states gathered in Sudan for the **Khartoum Summit** to formulate a unified response to their catastrophic defeat in the Six-Day War. Determined to prove to their domestic populations that military loss did not mean political surrender, Arab leaders refused to negotiate with the victorious Israeli state.\n\n<span class=\"para-ref\">[5.2]</span> On **1 September 1967**, the summit issued the famous **Khartoum Resolution**, which laid down the defiant policy known as the **'Three Nos'**: **no peace with Israel, no recognition of Israel, and no negotiations with Israel**. This total rejection of compromise destroyed early hopes for a diplomatic breakthrough under UN Resolution 242, entrenching a permanent diplomatic stalemate and convincing Israeli leaders to maintain permanent military control over the occupied territories.",
    sources: [newSourceE]
  };

  // Update standalone sources[4] on lesson
  l7.sources[4] = newSourceE;

  // Update Quiz in Lesson 7
  if (Array.isArray(l7.quiz)) {
    const qIdx = l7.quiz.findIndex(q => q.question && q.question.includes('Allon'));
    if (qIdx !== -1) {
      l7.quiz[qIdx] = {
        question: "According to Source E, what historic resolution was adopted by Arab leaders at the Khartoum Summit in September 1967?",
        options: [
          "The 'Three Nos' (no peace, no recognition, no negotiations)",
          "The Camp David Accords",
          "UN Resolution 242",
          "The Madrid Peace Framework"
        ],
        answer: "The 'Three Nos' (no peace, no recognition, no negotiations)",
        explanation: "Source E captures the Arab League Summit in Khartoum where leaders adopted the 'Three Nos', rejecting peace, recognition, and negotiations with Israel."
      };
    }
  }

  // Update Flashcards in Lesson 7
  if (Array.isArray(l7.flashcards)) {
    const fcIdx = l7.flashcards.findIndex(f => f.front && f.front.includes('Allon'));
    if (fcIdx !== -1) {
      l7.flashcards[fcIdx] = {
        front: "What was the 'Three Nos' policy declared at the 1967 Khartoum Summit?",
        back: "No peace with Israel, no recognition of Israel, and no negotiations with Israel."
      };
    }
  }

  // Update Video viewing task in Lesson 7
  if (l7.video) {
    l7.video.teacher_guidance = "Balanced historical breakdown tracing the diplomatic deadlock after the Six-Day War, the Khartoum Summit, and the entrenchment of the 'Three Nos'. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Diplomatic Consequences & Stalemate.";
    l7.video.viewing_task = "<ol><li><strong>[01:45] Recall:</strong> What famous resolution was issued by Arab leaders at the Khartoum Summit in September 1967 in response to their defeat in the Six-Day War?</li><li><strong>[03:30] Explain:</strong> How did the Arab League's 'Three Nos' (no peace, no recognition, no negotiations) directly conflict with the 'land for peace' framework of UN Resolution 242?</li><li><strong>[05:10] Challenge:</strong> Evaluate why the combination of the Khartoum Resolution and Israeli territorial occupation created a permanent diplomatic stalemate between 1967 and 1973.</li></ol>";
    l7.video.model_answer = "<ol><li><strong>Recall:</strong> The Khartoum Resolution, famous for the 'Three Nos' (no peace, no recognition, and no negotiations with Israel).</li><li><strong>Explain:</strong> While UN Resolution 242 proposed that Israel withdraw from occupied territories in exchange for Arab recognition and peace treaties, the 'Three Nos' completely barred Arab leaders from recognizing or negotiating with Israel. This made any peaceful territorial exchange impossible.</li><li><strong>Challenge:</strong> Because Arab leaders could not negotiate without violating the Khartoum pact, and Israeli leaders refused to withdraw without peace treaties, diplomacy broke down entirely. This stalemate convinced Egypt and Syria that only renewed military action could recover their lost lands, directly causing the War of Attrition and the 1973 Yom Kippur War.</li></ol>";
  }

  // Systemic Pruning of Distractors & Off-spec references across all lessons
  data.lessons.forEach(l => {
    // In quiz options
    if (Array.isArray(l.quiz)) {
      l.quiz.forEach(q => {
        if (Array.isArray(q.options)) {
          q.options = q.options.map(opt => {
            if (opt === 'The Allon Line') return 'The Green Line';
            if (opt === "'Allon Doctrine'") return "'Land for Peace' formula";
            if (opt.includes('Gush Emunim')) return 'The election resulted in a right-wing Likud government led by Menachem Begin.';
            return opt;
          });
        }
      });
    }

    // In flashcards
    if (Array.isArray(l.flashcards)) {
      l.flashcards.forEach(fc => {
        if (fc.front && fc.front.includes('Allon')) {
          fc.front = "What was the 'Three Nos' policy declared at the 1967 Khartoum Summit?";
          fc.back = "No peace with Israel, no recognition of Israel, and no negotiations with Israel.";
        }
      });
    }

    // In exam practice
    if (l.exam_practice && l.exam_practice.model) {
      l.exam_practice.model = l.exam_practice.model.replace(
        /outposts like Gush Emunim across the West Bank and Gaza/g,
        'military outposts and settlements across the West Bank and Gaza'
      );
    }
  });

  const outputJs = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, outputJs, 'utf8');
  console.log('Successfully saved pruned data to:', filePath);
}

processFile('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
processFile('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

