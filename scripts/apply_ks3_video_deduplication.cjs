const fs = require('fs');
const path = require('path');

const replacements = {
  australia: [
    {
      lessonIdx: 0, // Lesson 1
      videoIdx: 2,  // Video [2]
      newVideo: {
        type: "youtube",
        id: "m_0UNKVKZOM",
        url: "https://www.youtube.com/watch?v=m_0UNKVKZOM",
        title: "Ten Canoes (2006) | Official Trailer (Rolf de Heer & Peter Djigirr)",
        duration: "1 mins 57 secs",
        pathway: "Cinematic",
        teacher_guidance: "Recommended Watch Window: 00:00–01:57 | Lesson Phase: First Nations Continuity | Tone Alert: Poetic, authentic portrayal of Arnhem Land Aboriginal society prior to European arrival, spoken in Yolngu Matha.",
        viewing_task: "[00:50] Cultural Continuity: How does the storytelling tradition shown in the film demonstrate that Aboriginal cultures were highly structured, deeply spiritual societies rather than an 'empty land' (terra nullius)?",
        model_answer: "The film illustrates that First Nations communities possessed rich, thousands-of-years-old oral histories, kinship laws, and sacred relationships with country, directly disproving European claims of terra nullius."
      }
    },
    {
      lessonIdx: 2, // Lesson 3
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "5hmPmjUzPTA",
        url: "https://www.youtube.com/watch?v=5hmPmjUzPTA",
        title: "The Australian Wars (2022) | Official Series Trailer (SBS / Rachel Perkins)",
        duration: "1 mins 15 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 00:00–01:15 | Lesson Phase: Frontier Warfare Investigation | Tone Alert: Gripping, serious examination of the armed conflicts between British colonisers and First Nations warriors like Pemulwuy.",
        viewing_task: "[00:30] Conflict Dynamics: What evidence does filmmaker Rachel Perkins emphasize to show that the colonisation of Australia was an active, prolonged military war rather than a peaceful settlement?",
        model_answer: "Perkins highlights the deployment of British military regiments, coordinated frontier militias, fortified homesteads, and recorded casualty rates on both sides, confirming an organized, multi-decade frontier war."
      }
    },
    {
      lessonIdx: 3, // Lesson 4
      videoIdx: 2,  // Video [2]
      newVideo: {
        type: "youtube",
        id: "YuP8g_GQIgI",
        url: "https://www.youtube.com/watch?v=YuP8g_GQIgI",
        title: "The Nightingale (2018) | Official Trailer (Jennifer Kent)",
        duration: "2 mins 33 secs",
        pathway: "Cinematic",
        teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Van Diemen's Land Frontier | Tone Alert: Gritty, harrowing depiction of British military occupation, convict servitude, and Aboriginal dispossession in 1820s Tasmania.",
        viewing_task: "[01:10] Frontier Reality: How does the trailer convey the extreme brutality and lawlessness of the colonial frontier during the Tasmanian Black War?",
        model_answer: "It depicts British soldiers and penal authorities operating with absolute, unchecked violence in remote wilderness outposts, reflecting the systemic terror and martial law unleashed against Tasmanian Palawa people."
      }
    },
    {
      lessonIdx: 3, // Lesson 4
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "sD22ZkWu8Bs",
        url: "https://www.youtube.com/watch?v=sD22ZkWu8Bs",
        title: "First Australians: Her Will To Survive (Episode 2) | SBS / Rachel Perkins",
        duration: "52 mins 49 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 02:00–12:30 | Lesson Phase: The Black War in Van Diemen's Land | Tone Alert: Definitive archival documentary detailing Governor Arthur's martial law, the Black Line, and Truganini's survival.",
        viewing_task: "[06:45] The Black Line (1830): What was Governor Arthur's objective in mobilizing 2,200 armed colonists in a human cordon across Tasmania?",
        model_answer: "Governor Arthur intended to drive all remaining Aboriginal Tasmanians out of settled districts and corral them onto the Tasman Peninsula, an operation that failed militarily but demonstrated the colonial government's total commitment to clearing the land."
      }
    },
    {
      lessonIdx: 4, // Lesson 5
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "Nov-XPaTYB4",
        url: "https://www.youtube.com/watch?v=Nov-XPaTYB4",
        title: "First Australians: Freedom For Our Lifetime (Episode 3) | SBS Documentary",
        duration: "61 mins 20 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 05:00–16:00 | Lesson Phase: State Control & Protection Acts | Tone Alert: Insightful documentary analyzing Victorian Aboriginal reserves (Coranderrk), state paternalism, and the precursors to the Stolen Generations.",
        viewing_task: "[10:15] Protection Acts: How did colonial 'Aborigines Protection Acts' give government boards total control over Indigenous families, wages, and children?",
        model_answer: "The acts granted state protectors legal guardianship over Aboriginal children, strictly controlled where First Nations people could live and work, withheld their earned wages in government trusts, and laid the bureaucratic groundwork for forced child removals."
      }
    }
  ],

  industrialisation_and_empire: [
    {
      lessonIdx: 0, // Lesson 1
      videoIdx: 2,  // Video [2]
      newVideo: {
        type: "youtube",
        id: "YacizJRW4WI",
        url: "https://www.youtube.com/watch?v=YacizJRW4WI",
        title: "The Mill (2013) | Official Series Trailer (Channel 4)",
        duration: "1 mins 01 secs",
        pathway: "Cinematic",
        teacher_guidance: "Recommended Watch Window: 00:00–01:01 | Lesson Phase: Factory Life & Child Apprentices | Tone Alert: Gritty historical drama based on real records of pauper apprentice children working at Quarry Bank Mill in Cheshire.",
        viewing_task: "[00:30] Factory Realities: What hazards and working conditions faced young pauper apprentices working 14-hour shifts in early mechanized cotton mills?",
        model_answer: "Apprentices endured relentless machine pace, deafening noise, airborne cotton fibres causing lung disease, and severe physical danger of limbs being crushed under unguarded spinning mules."
      }
    },
    {
      lessonIdx: 2, // Lesson 3
      videoIdx: 2,  // Video [2]
      newVideo: {
        type: "youtube",
        id: "W5kiXT9aaXU",
        url: "https://www.youtube.com/watch?v=W5kiXT9aaXU",
        title: "Victorian Slum House: Sweated Labour & Tailoring | PBS",
        duration: "1 mins 21 secs",
        pathway: "Cinematic",
        teacher_guidance: "Recommended Watch Window: 00:00–01:21 | Lesson Phase: Urban Poverty & Sweated Trades | Tone Alert: Living history reenactment demonstrating piece-rate home working and grinding tenement poverty in Victorian cities.",
        viewing_task: "[00:45] Economic Insecurity: Why was piece-work tailoring in tenement slums so devastating for families trying to avoid the workhouse?",
        model_answer: "Workers were paid mere pennies per finished garment, forcing entire families, including children, to sew for 16 hours a day in damp, unventilated rooms just to pay landlord rent."
      }
    }
  ],

  first_british_empire: [
    {
      lessonIdx: 4, // Lesson 5
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "ZFkq9oXcX48",
        url: "https://www.youtube.com/watch?v=ZFkq9oXcX48",
        title: "Liberty! Episode 2: Blows Must Decide (1774–1776) | PBS Documentary",
        duration: "58 mins 32 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 03:00–14:00 | Lesson Phase: Road to Independence | Tone Alert: Definitive PBS documentary dramatizing the First Continental Congress, Lexington and Concord, and the drafting of the 1776 Declaration.",
        viewing_task: "[08:15] Escalation to War: Why did King George III declare that the American colonies were in 'open rebellion' following the Olive Branch Petition?",
        model_answer: "King George III rejected any compromise with the colonists after Bunker Hill, declaring all colonial leaders traitors and ordering full military force to crush resistance, making full independence inevitable."
      }
    }
  ],

  second_british_empire: [
    {
      lessonIdx: 3, // Lesson 4
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "JG3uCJGlhZo",
        url: "https://www.youtube.com/watch?v=JG3uCJGlhZo",
        title: "Empire: Playing the Game (Episode 3) | BBC / Jeremy Paxman",
        duration: "58 mins 53 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 02:00–14:00 | Lesson Phase: Imperial Conquest & The Scramble for Africa | Tone Alert: Authoritative BBC documentary analyzing Cecil Rhodes, the Maxim gun, and the partition of Africa.",
        viewing_task: "[06:20] Technological Superiority: How did the invention of the Maxim machine gun decisively shift power to British forces during the Scramble for Africa?",
        model_answer: "The Maxim gun enabled small contingents of British and colonial troops to devastate vastly larger African armies, turning imperial battles into one-sided slaughter and facilitating rapid territorial annexation."
      }
    },
    {
      lessonIdx: 4, // Lesson 5
      videoIdx: 3,  // Video [3]
      newVideo: {
        type: "youtube",
        id: "hSxu58TT6M4",
        url: "https://www.youtube.com/watch?v=hSxu58TT6M4",
        title: "Empire: Doing Good (Episode 5) | BBC / Jeremy Paxman",
        duration: "59 mins 01 secs",
        pathway: "Documentary Depth",
        teacher_guidance: "Recommended Watch Window: 04:00–15:30 | Lesson Phase: The Moral Balance Sheet of Empire | Tone Alert: Thought-provoking historical evaluation weighing imperial infrastructure (railways, law) against famine, racism, and colonial violence.",
        viewing_task: "[09:30] Historical Verdict: How does Paxman evaluate the claim that the British Empire was an unselfish 'civilizing mission'?",
        model_answer: "Paxman argues that while Britain built railways, legal systems, and schools, these were primarily engineered to extract wealth, enforce military control, and maintain racial hierarchies, disproving the Victorian myth of purely benevolent rule."
      }
    }
  ]
};

async function applyAll() {
  for (const [unitId, items] of Object.entries(replacements)) {
    console.log(`\nApplying deduplication fixes to ${unitId}...`);
    const paths = [
      path.join(__dirname, '..', 'units', unitId, 'data.js'),
      path.join(__dirname, '..', 'public', 'units', unitId, 'data.js')
    ];

    for (const p of paths) {
      if (!fs.existsSync(p)) continue;
      const fileUrl = 'file:///' + p.replace(/\\/g, '/');
      const mod = (await import(fileUrl)).default;

      items.forEach(rep => {
        const lesson = mod.lessons[rep.lessonIdx];
        if (!lesson) {
          console.warn(`Lesson index ${rep.lessonIdx} not found in ${unitId}!`);
          return;
        }
        if (!lesson.video) lesson.video = [];
        const oldVid = lesson.video[rep.videoIdx];
        console.log(`  Replacing [${rep.lessonIdx}][${rep.videoIdx}] ${oldVid?.id || 'new'} -> ${rep.newVideo.id} in ${path.basename(p)}`);
        lesson.video[rep.videoIdx] = rep.newVideo;
      });

      fs.writeFileSync(p, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
      console.log(`✅ Saved ${p}`);
    }
  }
}

applyAll().catch(console.error);

