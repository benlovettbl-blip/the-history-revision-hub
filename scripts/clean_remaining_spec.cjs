const fs = require('fs');

function cleanRemaining(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Vox video tasks in extra_videos[1]
  content = content.replace(
    'Balanced journalistic breakdown tracing the Allon Plan, early agricultural buffer settlements, and the rise of Gush Emunim religious nationalism. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Source Analysis & Spatial Evidence. Tone Alert: Balanced visual journalism tracing how settlement patterns evolved from security outposts into deeply ideological suburban cities.',
    'Balanced journalistic breakdown tracing the development of Israeli settlements across the West Bank and Gaza. Recommended Watch Window: 01:00–06:15 • Lesson Phase: Spatial Evidence & Territorial Control.'
  );

  content = content.replace(
    '<ol><li><strong>[01:45] Recall:</strong> What strategic plan was proposed by Israeli Deputy Prime Minister Yigal Allon in 1967, recommending defensive settlements along the Jordan Valley while returning densely populated Arab hilltops?</li><li><strong>[03:30] Explain:</strong> How did the historic election of Menachem Begin\'s right-wing Likud government in 1977 transform settlement policy from peripheral security outposts to ideological colonization deep across the West Bank?</li><li><strong>[05:10] Challenge:</strong> Evaluate how the construction of settlements, bypass roads, and military zones established \'irreversible facts on the ground\', making a viable, contiguous two-state solution extraordinarily difficult to implement.</li></ol>',
    '<ol><li><strong>[01:45] Recall:</strong> Where did the Israeli government initially establish its first military and agricultural security outposts following the 1967 Six-Day War?</li><li><strong>[03:30] Explain:</strong> How did the historic election of Menachem Begin\'s right-wing Likud government in 1977 transform settlement policy from peripheral security outposts to permanent civilian towns across the West Bank?</li><li><strong>[05:10] Challenge:</strong> Evaluate how the construction of settlements, bypass roads, and military zones established physical \'facts on the ground\', making territorial compromise under UN Resolution 242 increasingly difficult.</li></ol>'
  );

  content = content.replace(
    '<ol><li><strong>Recall:</strong> The Allon Plan (1967).</li><li><strong>Explain:</strong> The Labor Party had built settlements primarily for security along border perimeters. Likud and its religious-nationalist allies (such as *Gush Emunim*) viewed the West Bank as Judea and Samaria—the biblical and historic heartland of the Jewish people—where Jews held a divine and national right to settle anywhere. Likud provided massive state subsidies, infrastructure, and military protection to build towns throughout the Palestinian interior.</li><li><strong>Challenge:</strong> Settlements were strategically placed on hilltops overlooking Palestinian towns and linked by bypass roads that local Palestinians were barred from using. By fragmenting the West Bank into disconnected cantons and populating it with hundreds of thousands of Israeli citizens, the settlement enterprise created legal, physical, and political barriers that fundamentally complicated any future territorial withdrawal.</li></ol>',
    '<ol><li><strong>Recall:</strong> Along the Jordan Valley, the Golan Heights, and the Sinai border perimeter.</li><li><strong>Explain:</strong> The early Labor governments built settlements primarily as military security buffers along border perimeters. However, Menachem Begin\'s Likud government, elected in 1977, viewed the West Bank as historic Judea and Samaria. Likud provided massive state subsidies, infrastructure, and military protection to build permanent civilian towns throughout the interior.</li><li><strong>Challenge:</strong> Settlements were strategically built on hilltops overlooking Palestinian towns and linked by bypass roads that local Palestinians could not use. By fragmenting the West Bank and populating it with hundreds of thousands of Israeli citizens, the settlement enterprise created physical and political barriers that made returning occupied land under UN Resolution 242 extraordinarily difficult.</li></ol>'
  );

  // Line 9864 in exam practice model
  content = content.replace(
    'Specifically, Israel established agricultural and religious outposts like Gush Emunim across the West Bank and Gaza.',
    'Specifically, Israel established military outposts and civilian settlements across the West Bank and Gaza.'
  );

  // Line 14196 in distractor
  content = content.replace(
    'The election resulted in a coalition government led by the religious-nationalist Gush Emunim movement.',
    'The election resulted in a right-wing Likud government led by Menachem Begin.'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned remaining items in:', filePath);
}

cleanRemaining('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
cleanRemaining('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

