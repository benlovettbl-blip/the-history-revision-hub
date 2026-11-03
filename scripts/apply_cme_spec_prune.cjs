const fs = require('fs');

function applyPrune(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace Lesson 7 Stage 5 Narrative Block
  const oldBlock5 = `          {
            "title": "The Beginning of Israeli Settlements",
            "paragraphs": [
              "<span class=\\"para-ref\\">[5.1]</span> In the immediate aftermath of the Six-Day War, Israeli Deputy Prime Minister **Yigal Allon** presented a strategic blueprint known as the **Allon Plan**. It proposed retaining a permanent security perimeter along the Jordan River valley and the Judaean Desert to serve as a military buffer against eastern invasion, while returning densely populated Arab hill country to Jordanian administrative control in exchange for peace.",
              "<span class=\\"para-ref\\">[5.2]</span> Under the Allon framework, the Israeli government established strategic agricultural outposts (**Nahal**) along the Jordan Valley and Golan Heights. Concurrently, ideological and religious Zionists—later organized as **Gush Emunim** (\\"Bloc of the Faithful\\")—began establishing unauthorized outposts in the biblical heartlands of Judea and Samaria, such as Kfar Etzion and Hebron. These early settlements transformed over time from temporary security garrisons into permanent suburban townships, severely complicating future territorial compromise."
            ],
            "act": 5,
            "act_title": "Stage 5: The Beginning of Israeli Settlements — How did permanent Israeli settlements transform the occupied territories?",
            "theme_heading": "The Beginning of Israeli Settlements",
            "text": "<span class=\\"para-ref\\">[5.1]</span> In the immediate aftermath of the Six-Day War, Israeli Deputy Prime Minister **Yigal Allon** presented a strategic blueprint known as the **Allon Plan**. It proposed retaining a permanent security perimeter along the Jordan River valley and the Judaean Desert to serve as a military buffer against eastern invasion, while returning densely populated Arab hill country to Jordanian administrative control in exchange for peace.\\n\\n<span class=\\"para-ref\\">[5.2]</span> Under the Allon framework, the Israeli government established strategic agricultural outposts (**Nahal**) along the Jordan Valley and Golan Heights. Concurrently, ideological and religious Zionists—later organized as **Gush Emunim** (\\"Bloc of the Faithful\\")—began establishing unauthorized outposts in the biblical heartlands of Judea and Samaria, such as Kfar Etzion and Hebron. These early settlements transformed over time from temporary security garrisons into permanent suburban townships, severely complicating future territorial compromise.",
            "sources": [
              {
                "id": "cme_l7_source_e",
                "letter": "E",
                "title": "Source E: Strategic Cartographic Map of the Allon Plan (1967–1968)",
                "src": "/images/cme_allon_plan_1967_map.jpg",
                "image": "/images/cme_allon_plan_1967_map.jpg",
                "source": "/images/cme_allon_plan_1967_map.jpg",
                "caption": "Historical map illustrating Labor Minister Yigal Allon's settlement strategy: annexing a 10–15km defensive perimeter along the Jordan River (blue) while returning Arab population centres (green) to Jordanian civil administration.",
                "desc": "Policy diagram of Israel's early settlement and border defense doctrine.",
                "provenance": "Israel Labor Party Archives, Beit Berl (Allon Papers), July 1968.",
                "citation": "Beit Berl Archives / Yigal Allon Collection.",
                "hinge_question": "Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?",
                "source_context": "Yigal Allon argued that Israel needed the Jordan Valley as a permanent military barrier against eastern invasion, but warned that annexing the heavily populated hill country of Judea and Samaria would destroy Israel's Jewish demographic majority. **Hinge Question:** Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?",
                "context": "Yigal Allon proposed establishing agricultural settlements along the Jordan Valley as a strategic security barrier.",
                "question_badge": "Historical Utility",
                "question_type": "Historical Utility",
                "enquiry_question": "How useful is Source E for an enquiry into Israel's early settlement plans after the 1967 war?",
                "model_answer": "Source E is useful because it shows that the Israeli government initially planned to build settlements along the Jordan Valley as a military defensive barrier, while leaving Arab population centres under Jordanian control.",
                "provenance_clues": {
                  "author": "Yigal Allon, Deputy Prime Minister and former Palmach commander.",
                  "audience": "Prime Minister Levi Eshkol and the Ministerial Committee on Defense.",
                  "motive": "To establish a defensible eastern border while avoiding the incorporation of hundreds of thousands of Arab non-citizens.",
                  "hinge_question": "Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?"
                },
                "teacher_notes": {
                  "source_context": "Yigal Allon argued that Israel needed the Jordan Valley as a permanent military barrier against eastern invasion, but warned that annexing the heavily populated Arab spine would create a bi-national state and destroy Israel's Jewish demographic majority. Although never officially adopted by the Cabinet, it served as the practical blueprint for early Labor settlement construction. **Hinge Question:** Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?"
                }
              }
            ]
          }`;

  const newBlock5 = `          {
            "title": "The Khartoum Conference & The 'Three Nos'",
            "paragraphs": [
              "<span class=\\"para-ref\\">[5.1]</span> In August and September 1967, leaders from eight Arab states gathered in Sudan for the **Khartoum Summit** to formulate a unified response to their catastrophic defeat in the Six-Day War. Determined to prove to their domestic populations that military loss did not mean political surrender, Arab leaders refused to negotiate with the victorious Israeli state.",
              "<span class=\\"para-ref\\">[5.2]</span> On **1 September 1967**, the summit issued the famous **Khartoum Resolution**, which laid down the defiant policy known as the **'Three Nos'**: **no peace with Israel, no recognition of Israel, and no negotiations with Israel**. This total rejection of compromise destroyed early hopes for a diplomatic breakthrough under UN Resolution 242, entrenching a permanent diplomatic stalemate and convincing Israeli leaders to maintain permanent military control over the occupied territories."
            ],
            "act": 5,
            "act_title": "Stage 5: The Khartoum Conference & The 'Three Nos' — Why did the Arab states reject territorial compromise with Israel?",
            "theme_heading": "The Khartoum Conference & The 'Three Nos'",
            "text": "<span class=\\"para-ref\\">[5.1]</span> In August and September 1967, leaders from eight Arab states gathered in Sudan for the **Khartoum Summit** to formulate a unified response to their catastrophic defeat in the Six-Day War. Determined to prove to their domestic populations that military loss did not mean political surrender, Arab leaders refused to negotiate with the victorious Israeli state.\\n\\n<span class=\\"para-ref\\">[5.2]</span> On **1 September 1967**, the summit issued the famous **Khartoum Resolution**, which laid down the defiant policy known as the **'Three Nos'**: **no peace with Israel, no recognition of Israel, and no negotiations with Israel**. This total rejection of compromise destroyed early hopes for a diplomatic breakthrough under UN Resolution 242, entrenching a permanent diplomatic stalemate and convincing Israeli leaders to maintain permanent military control over the occupied territories.",
            "sources": [
              {
                "id": "cme_l7_source_e",
                "letter": "E",
                "title": "Source E: The Khartoum Resolution and the 'Three Nos' (1 September 1967)",
                "src": "/images/cme_khartoum_summit_1967.jpg",
                "image": "/images/cme_khartoum_summit_1967.jpg",
                "source": "/images/cme_khartoum_summit_1967.jpg",
                "caption": "Arab heads of state at the Khartoum Summit in Sudan, where the Arab League adopted the famous 'Three Nos' resolution on 1 September 1967.",
                "desc": "Archival photograph of Arab leaders at the Khartoum Summit formulating the 'Three Nos' resolution (1967).",
                "provenance": "Arab League Summit Records / Sudanese Ministry of Information Archives, Khartoum, September 1967.",
                "citation": "Khartoum Summit Declaration, Arab League Official Gazette, 1 September 1967.",
                "hinge_question": "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
                "source_context": "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
                "context": "Arab leaders issued the 'Three Nos' at Khartoum, rejecting all peace, recognition, and negotiation with Israel.",
                "question_badge": "Author’s Purpose",
                "question_type": "Author’s Purpose",
                "enquiry_question": "What was the primary purpose of the Arab League issuing the 'Three Nos' in Source E?",
                "model_answer": "The purpose was to restore Arab pride after the humiliating 1967 defeat and demonstrate to the Arab public that leaders like Nasser would never surrender Palestinian land or accept Israel’s existence.",
                "provenance_clues": {
                  "author": "Arab heads of state including Gamal Abdel Nasser of Egypt and King Faisal of Saudi Arabia.",
                  "audience": "The Arab public and the international community.",
                  "motive": "To prevent any individual Arab nation from breaking ranks to sign a separate peace treaty with Israel.",
                  "hinge_question": "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
                },
                "teacher_notes": {
                  "source_context": "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
                }
              }
            ]
          }`;

  if (!content.includes(oldBlock5)) {
    console.error('oldBlock5 not found in ' + filePath);
    process.exit(1);
  }
  content = content.replace(oldBlock5, newBlock5);

  // 2. Also replace standalone Source E in Lesson 7 sources array
  const oldSourceEStandalone = `          {
            "id": "cme_l7_source_e",
            "letter": "E",
            "title": "Source E: The Allon Plan Settlement Strategy Blueprint (1967–1968)",
            "src": "/images/cme_allon_plan_1967_map.jpg",
            "image": "/images/cme_allon_plan_1967_map.jpg",
            "source": "/images/cme_allon_plan_1967_map.jpg",
            "caption": "Strategic cartographic map of the Allon Plan proposed by Labor Minister Yigal Allon: annexing a 10–15km security strip along the Jordan River while returning densely populated Arab highland enclaves to Jordanian civil control.",
            "desc": "Policy diagram of Israel's early settlement and border defense doctrine.",
            "provenance": "Israel Labor Party Archives, Beit Berl (Allon Papers), July 1968.",
            "citation": "Beit Berl Archives / Yigal Allon Collection.",
            "hinge_question": "Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?",
            "source_context": "Yigal Allon argued that Israel needed the Jordan Valley as a permanent military barrier against eastern invasion, but warned that annexing the heavily populated hill country of Judea and Samaria would destroy Israel's Jewish demographic majority. **Hinge Question:** Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?",
            "context": "Yigal Allon proposed establishing agricultural settlements along the Jordan Valley as a strategic security barrier.",
            "question_badge": "Historical Utility",
            "question_type": "Historical Utility",
            "enquiry_question": "How useful is Source E for an enquiry into Israel's early settlement plans after the 1967 war?",
            "model_answer": "Source E is useful because it shows that the Israeli government initially planned to build settlements along the Jordan Valley as a military defensive barrier, while leaving Arab population centres under Jordanian control.",
            "provenance_clues": {
              "author": "Yigal Allon, Deputy Prime Minister and former Palmach commander.",
              "audience": "Prime Minister Levi Eshkol and the Ministerial Committee on Defense.",
              "motive": "To establish a defensible eastern border while avoiding the incorporation of hundreds of thousands of Arab non-citizens.",
              "hinge_question": "Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?"
            },
            "teacher_notes": {
              "source_context": "Yigal Allon argued that Israel needed the Jordan Valley as a permanent military barrier against eastern invasion, but warned that annexing the heavily populated Arab spine would create a bi-national state and destroy Israel's Jewish demographic majority. Although never officially adopted by the Cabinet, it served as the practical blueprint for early Labor settlement construction. **Hinge Question:** Why did the Israeli government choose to create 'facts on the ground' through settlements rather than formally annexing the West Bank?"
            }
          }`;

  const newSourceEStandalone = `          {
            "id": "cme_l7_source_e",
            "letter": "E",
            "title": "Source E: The Khartoum Resolution and the 'Three Nos' (1 September 1967)",
            "src": "/images/cme_khartoum_summit_1967.jpg",
            "image": "/images/cme_khartoum_summit_1967.jpg",
            "source": "/images/cme_khartoum_summit_1967.jpg",
            "caption": "Arab heads of state at the Khartoum Summit in Sudan, where the Arab League adopted the famous 'Three Nos' resolution on 1 September 1967.",
            "desc": "Archival photograph of Arab leaders at the Khartoum Summit formulating the 'Three Nos' resolution (1967).",
            "provenance": "Arab League Summit Records / Sudanese Ministry of Information Archives, Khartoum, September 1967.",
            "citation": "Khartoum Summit Declaration, Arab League Official Gazette, 1 September 1967.",
            "hinge_question": "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
            "source_context": "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
            "context": "Arab leaders issued the 'Three Nos' at Khartoum, rejecting all peace, recognition, and negotiation with Israel.",
            "question_badge": "Author’s Purpose",
            "question_type": "Author’s Purpose",
            "enquiry_question": "What was the primary purpose of the Arab League issuing the 'Three Nos' in Source E?",
            "model_answer": "The purpose was to restore Arab pride after the humiliating 1967 defeat and demonstrate to the Arab public that leaders like Nasser would never surrender Palestinian land or accept Israel’s existence.",
            "provenance_clues": {
              "author": "Arab heads of state including Gamal Abdel Nasser of Egypt and King Faisal of Saudi Arabia.",
              "audience": "The Arab public and the international community.",
              "motive": "To prevent any individual Arab nation from breaking ranks to sign a separate peace treaty with Israel.",
              "hinge_question": "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
            },
            "teacher_notes": {
              "source_context": "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
            }
          }`;

  if (!content.includes(oldSourceEStandalone)) {
    console.error('oldSourceEStandalone not found in ' + filePath);
    process.exit(1);
  }
  content = content.replace(oldSourceEStandalone, newSourceEStandalone);

  // 3. Replace Quiz Question in Lesson 7
  const oldQuizQ = `            {
              "question": "According to Source E, what settlement strategy blueprint was proposed by Labor Minister Yigal Allon in 1967–1968?",
              "options": [
                "The Allon Plan",
                "The Sharon Corridor",
                "The Dayan Plan",
                "The Sinai Disengagement"
              ],
              "answer": "The Allon Plan",
              "explanation": "Source E is the strategic cartographic map of the Allon Plan proposed by Labor Minister Yigal Allon."
            }`;

  const newQuizQ = `            {
              "question": "According to Source E, what historic resolution was adopted by Arab leaders at the Khartoum Summit in September 1967?",
              "options": [
                "The 'Three Nos' (no peace, no recognition, no negotiations)",
                "The Camp David Accords",
                "UN Resolution 242",
                "The Madrid Peace Framework"
              ],
              "answer": "The 'Three Nos' (no peace, no recognition, no negotiations)",
              "explanation": "Source E captures the Arab League Summit in Khartoum where leaders adopted the 'Three Nos', rejecting peace, recognition, and negotiations with Israel."
            }`;

  content = content.replace(oldQuizQ, newQuizQ);

  // 4. Replace Flashcard in Lesson 7
  const oldFlashcard = `            {
              "front": "What was the Allon Plan?",
              "back": "A 1967 Israeli proposal to retain the Jordan Valley as a military buffer while returning populated Arab areas to Jordan."
            }`;
  const newFlashcard = `            {
              "front": "What was the 'Three Nos' policy declared at the 1967 Khartoum Summit?",
              "back": "No peace with Israel, no recognition of Israel, and no negotiations with Israel."
            }`;
  content = content.replace(oldFlashcard, newFlashcard);

  // 5. Replace Video viewing task in Lesson 7
  const oldVideoTask = `"teacher_guidance": "Balanced journalistic breakdown tracing the Allon Plan, early agricultural buffer settlements, and the rise of Gush Emunim religious nationalism. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Source Analysis & Spatial Evidence. Tone Alert: Balanced visual journalism tracing how settlement patterns evolved from security outposts into deeply ideological suburban cities.",
            "viewing_task": "<ol><li><strong>[01:45] Recall:</strong> What strategic plan was proposed by Israeli Deputy Prime Minister Yigal Allon in 1967, recommending defensive settlements along the Jordan Valley while returning densely populated Arab hilltops?</li><li><strong>[03:30] Explain:</strong> How did the historic election of Menachem Begin's right-wing Likud government in 1977 transform settlement policy from peripheral security outposts to ideological colonization deep across the West Bank?</li><li><strong>[05:10] Challenge:</strong> Evaluate how the construction of settlements, bypass roads, and military zones established 'irreversible facts on the ground', making a viable, contiguous two-state solution extraordinarily difficult to implement.</li></ol>",
            "model_answer": "<ol><li><strong>Recall:</strong> The Allon Plan (1967).</li><li><strong>Explain:</strong> The Labor Party had built settlements primarily for security along border perimeters. Likud and its religious-nationalist allies (such as *Gush Emunim*) viewed the West Bank as Judea and Samaria—the biblical and historic heartland of the Jewish people—where Jews held a divine and national right to settle anywhere. Likud provided massive state subsidies, infrastructure, and military protection to build towns throughout the Palestinian interior.</li><li><strong>Challenge:</strong> Settlements were strategically placed on hilltops overlooking Palestinian towns and linked by bypass roads that local Palestinians were barred from using. By fragmenting the West Bank into disconnected cantons and populating it with hundreds of thousands of Israeli citizens, the settlement enterprise created legal, physical, and political barriers that fundamentally complicated any future territorial withdrawal.</li></ol>"`;

  const newVideoTask = `"teacher_guidance": "Balanced historical breakdown tracing the diplomatic deadlock after the Six-Day War, the Khartoum Summit, and the entrenchment of the 'Three Nos'. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Diplomatic Consequences & Stalemate.",
            "viewing_task": "<ol><li><strong>[01:45] Recall:</strong> What famous resolution was issued by Arab leaders at the Khartoum Summit in September 1967 in response to their defeat in the Six-Day War?</li><li><strong>[03:30] Explain:</strong> How did the Arab League's 'Three Nos' (no peace, no recognition, no negotiations) directly conflict with the 'land for peace' framework of UN Resolution 242?</li><li><strong>[05:10] Challenge:</strong> Evaluate why the combination of the Khartoum Resolution and Israeli territorial occupation created a permanent diplomatic stalemate between 1967 and 1973.</li></ol>",
            "model_answer": "<ol><li><strong>Recall:</strong> The Khartoum Resolution, famous for the 'Three Nos' (no peace, no recognition, and no negotiations with Israel).</li><li><strong>Explain:</strong> While UN Resolution 242 proposed that Israel withdraw from occupied territories in exchange for Arab recognition and peace treaties, the 'Three Nos' completely barred Arab leaders from recognizing or negotiating with Israel. This made any peaceful territorial exchange impossible.</li><li><strong>Challenge:</strong> Because Arab leaders could not negotiate without violating the Khartoum pact, and Israeli leaders refused to withdraw without peace treaties, diplomacy broke down entirely. This stalemate convinced Egypt and Syria that only renewed military action could recover their lost lands, directly causing the War of Attrition and the 1973 Yom Kippur War.</li></ol>"`;

  content = content.replace(oldVideoTask, newVideoTask);

  // 6. Cleanse distractors
  content = content.replace(/"The Allon Line",/g, '"The Green Line",');
  content = content.replace(/"The Allon Line"/g, '"The Green Line"');
  content = content.replace(/'Allon Doctrine'/g, "'Land for Peace' formula");
  content = content.replace(/"The election resulted in a coalition government led by the religious-nationalist Gush Emunim movement."/g, '"The election resulted in a right-wing Likud government led by Menachem Begin."');
  content = content.replace(/outposts like Gush Emunim across the West Bank and Gaza/g, 'military outposts and settlements across the West Bank and Gaza');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully pruned and updated: ' + filePath);
}

applyPrune('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
applyPrune('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

