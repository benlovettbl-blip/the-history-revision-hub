/**
 * scripts/recalibrate_eee_features.cjs
 * Recalibrates all 24 2-mark feature questions in Early Elizabethan England
 * to the crisp, punchy Edexcel standard: "A fact and a little bit of support!" (2/2)
 */

const fs = require('fs');
const path = require('path');

const RECALIBRATED_FEATURES = {
  lesson_1_1: {
    q1: {
      feature: "The Privy Council was a core group of approximately 19 trusted noble advisers led by William Cecil.",
      detail: "They met almost daily to manage national finance, military defence, and law enforcement, advising the Queen on royal policy.",
      vague: "One feature was that they were a group of nobles who advised Queen Elizabeth on running the country.",
      scholar: "The Privy Council functioned as the conciliar executive of the Tudor state. By streamlining membership from 50 down to 19 trusted advisers, Elizabeth created a cohesive administrative engine to execute crown policy and manage parliamentary affairs."
    },
    q2: {
      feature: "Elizabeth inherited a crippling Crown debt of £300,000 from Mary I.",
      detail: "Much of this debt was owed to foreign bankers on the Antwerp Exchange at high interest rates of up to 14%.",
      vague: "One feature was that the Crown was heavily in debt and did not have enough money to pay for wars.",
      scholar: "Tudor crown finances faced severe structural vulnerability in 1558. Heavy liabilities on the Antwerp money market forced Cecil and Gresham to prioritize fiscal retrenchment and recoinage before undertaking foreign military expenditure."
    }
  },

  lesson_1_2: {
    q1: {
      feature: "The Act made Elizabeth 'Supreme Governor' of the Church of England rather than 'Supreme Head'.",
      detail: "All clergy and royal officials had to swear an Oath of Supremacy accepting her authority or forfeit their positions.",
      vague: "One feature was that Elizabeth made herself the head of the church instead of the Pope.",
      scholar: "The title 'Supreme Governor' engineered an Erastian compromise. It established royal ecclesiastical supremacy while placating Catholics who held that only the Pope could be head of the Church, and Puritans who opposed female clerical leadership."
    },
    q2: {
      feature: "The Injunctions were 57 practical instructions issued by William Cecil to enforce the religious settlement across all parishes.",
      detail: "For example, every parish church was ordered to possess an English Bible and clergy were required to wear the surplice.",
      vague: "One feature was that they gave instructions to priests on how church services should be run.",
      scholar: "The Royal Injunctions established bureaucratic surveillance over parish worship. They enforced Protestant liturgical conformity through the Great Bible while preserving traditional vestments to maintain social tranquility."
    }
  },

  lesson_1_3: {
    q1: {
      feature: "One key feature was the Vestiarian Controversy of 1566 over clerical dress.",
      detail: "Thirty-seven London priests were dismissed for refusing to wear the white linen surplice, which they condemned as 'popish rags'.",
      vague: "One feature was that Puritans did not like the vestments that priests had to wear.",
      scholar: "The Vestiarian Controversy exposed fundamental puritan resistance to adiaphora. Rejecting royal authority over indifferent ceremonies, non-conforming ministers prioritised scriptural purity over crown uniformity, precipitating the Lambeth deprivations."
    },
    q2: {
      feature: "Pope Pius V issued the Papal Bull *Regnans in Excelsis* in 1570, excommunicating Queen Elizabeth as a heretic.",
      detail: "It released English Catholics from their allegiance to Elizabeth and commanded them to disobey her laws under pain of excommunication.",
      vague: "One feature was that Pope Pius V excommunicated Queen Elizabeth from the Catholic Church.",
      scholar: "The 1570 Papal Bull represented an overt deployment of papal plenitudo potestatis. By absolving Catholics of their civic allegiance, Rome effectively transformed practicing English Catholics into suspected traitors in the eyes of the Tudor state."
    }
  },

  lesson_1_4: {
    q1: {
      feature: "Mary was the great-granddaughter of Henry VII through his eldest daughter, Margaret Tudor.",
      detail: "Because Catholics viewed Elizabeth as illegitimate, they believed Mary was the rightful, legitimate Catholic heir to the English throne.",
      vague: "One feature was that Mary was Elizabeth's Catholic cousin who wanted to be queen.",
      scholar: "Mary Stuart's dynastic claim was rooted in unimpeachable legitimate descent and primogeniture. Under Catholic canon law, Mary possessed a superior hereditary title to the English throne, presenting an enduring constitutional threat to Elizabeth."
    },
    q2: {
      feature: "The Casket Letters were eight love letters and sonnets presented by Scottish lords to prove Mary conspired to murder her husband, Lord Darnley.",
      detail: "An English commission investigated the letters at York and Westminster, using the inconclusive verdict to justify keeping Mary under indefinite house arrest.",
      vague: "One feature was that letters were investigated to see if Mary helped kill her husband Lord Darnley.",
      scholar: "The Casket Letters inquiry was a calculated instrument of diplomatic containment. By maintaining an unresolved verdict on Mary's complicity in Darnley's regicide, Cecil created a legal pretext to intern an anointed foreign sovereign indefinitely."
    }
  },

  lesson_2_1: {
    q1: {
      feature: "The Earls of Northumberland and Westmorland led 4,600 Catholic rebels to seize Durham Cathedral in November 1569.",
      detail: "They destroyed the English Bible, restored the traditional Latin Mass, and planned to free Mary, Queen of Scots.",
      vague: "One feature was that Catholic nobles in the North rebelled against Queen Elizabeth.",
      scholar: "The Northern Rebellion was the final armed stand of northern bastard feudalism against Tudor administrative centralisation, demonstrating the fragility of the religious settlement in conservative aristocratic regions."
    },
    q2: {
      feature: "Anthony Babington communicated with the imprisoned Mary using coded letters smuggled inside beer barrels.",
      detail: "Sir Francis Walsingham’s spy network intercepted and decoded the letters, securing written proof that Mary approved Elizabeth's assassination.",
      vague: "One feature was that it was a plot to kill Elizabeth and put Mary on the throne.",
      scholar: "The Babington conspiracy functioned as an operational triumph of Walsingham's counter-espionage network. Intercepting Mary's explicit endorsement of regicide provided the definitive legal evidence required to execute an anointed monarch under the 1585 Act."
    }
  },

  lesson_2_2: {
    q1: {
      feature: "English captains like Francis Drake operated under royal licenses (letters of marque) to raid Spanish ports and treasure ships in the Americas.",
      detail: "In 1579, Drake captured the Spanish galleon *Cacafuego*, seizing over £400,000 in silver and gold, of which Elizabeth took a massive half-share.",
      vague: "One feature was that English sailors attacked Spanish ships and stole gold.",
      scholar: "Privateering served as crown-licensed mercantilist proxy warfare. By sanctioning attacks on Philip II's Atlantic bullion route, Elizabeth inflicted severe fiscal disruption on the Spanish empire while subsidising her own peacetime crown revenues."
    },
    q2: {
      feature: "Drake launched a pre-emptive naval raid into Cadiz harbour in April 1587, known as the 'Singeing of the King of Spain's Beard'.",
      detail: "He destroyed 30 Spanish ships and burned large stockpiles of seasoned oak barrel staves, delaying the Armada by an entire year.",
      vague: "One feature was that Drake sailed into a Spanish port and burned ships.",
      scholar: "The Cadiz raid was a masterclass in pre-emptive logistical interdiction. Destroying 1,700 tons of seasoned barrel staves compromised the Armada's food and water storage in 1588, creating severe operational friction during the campaign."
    }
  },

  lesson_2_3: {
    q1: {
      feature: "Elizabeth signed the treaty in August 1585 to send 7,300 English soldiers under Robert Dudley to aid the Dutch Protestant rebels against Spain.",
      detail: "In return, England was handed the cautionary deep-water ports of Brill and Flushing as security for her military costs.",
      vague: "One feature was that Elizabeth agreed to send an army to help the Dutch rebels.",
      scholar: "The Treaty of Nonsuch ended Elizabeth's policy of non-intervention, establishing an open military protectorate over the Netherlands and creating a de facto state of war between England and the Spanish Habsburgs."
    },
    q2: {
      feature: "Dudley angered Elizabeth by accepting the political title of 'Governor-General of the United Provinces' without her permission.",
      detail: "His military campaign struggled because troops were unpaid and poorly supplied, and English commanders betrayed key garrisons at Zutphen and Deventer to Spain.",
      vague: "One feature was that Dudley went to the Netherlands but had arguments with the Dutch and lost battles.",
      scholar: "Leicester's campaign suffered from severe strategic divergence. While Dudley pursued an expansive Calvinist alliance, Elizabeth demanded limited, low-cost defensive containment, leaving the expedition chronically underfunded and politically compromised."
    }
  },

  lesson_2_4: {
    q1: {
      feature: "The Armada sailed in a tightly coordinated curved formation stretching up to two miles wide.",
      detail: "Heavy galleons protected the outer flanks while vulnerable supply ships were shielded in the center, preventing English ships from boarding or breaking the line.",
      vague: "One feature was that the Spanish ships sailed in a curved line that was difficult to attack.",
      scholar: "The crescent formation (media luna) maximized mutual defensive fire. Positioned on the exterior wings, heavily armed galleons prevented English ships from isolating transports until disrupted by fireships at Calais."
    },
    q2: {
      feature: "The English sent eight pitch-soaked fireships into the anchored Armada at Calais on the night of 7 August 1588.",
      detail: "This caused mass panic, forcing Spanish captains to cut their anchor cables and scattering the protective crescent formation.",
      vague: "One feature was that English ships used long-range cannons and sent in fireships.",
      scholar: "The fireship assault off Calais shattered the tactical cohesion of the Spanish fleet. Deprived of anchors and scattered into the North Sea, the Armada was exposed to close-range English artillery broadsides at the Battle of Gravelines."
    }
  },

  lesson_3_1: {
    q1: {
      feature: "Grammar schools were fee-paying secondary schools for boys from middle-class families (sons of gentry and wealthy merchants) aged 7 to 14.",
      detail: "They had long 10-hour school days focusing heavily on Latin grammar, Greek, classical Roman writers like Cicero, and religious education.",
      vague: "One feature was that they were schools where boys went to learn Latin.",
      scholar: "Grammar schools functioned as humanist training grounds for the emergent Tudor administrative and commercial elite, cultivating rhetorical eloquence and civic responsibility required for statecraft and commerce."
    },
    q2: {
      feature: "Theatres like The Globe and The Rose were purpose-built circular open-air wooden amphitheatres erected outside the City of London walls to avoid Puritan bans.",
      detail: "They held up to 3,000 spectators, with poorer 'groundlings' paying 1d to stand in the yard and wealthy nobles paying up to 6d for covered gallery seats.",
      vague: "One feature was that they were open-air buildings where large crowds watched plays.",
      scholar: "The Elizabethan commercial theatre created a shared secular public sphere in suburban liberties, democratizing cultural consumption across social strata while operating beyond municipal puritan jurisdiction."
    }
  },

  lesson_3_2: {
    q1: {
      feature: "The Act introduced harsh physical punishments for the 'idle poor', including public whipping and burning through the ear gristle with a hot iron.",
      detail: "However, it also introduced a compulsory local poor rate to collect money to house and feed the elderly and sick ('impotent poor').",
      vague: "One feature was that it punished beggars who wandered around the country.",
      scholar: "The 1572 Act institutionalized statutory division between the 'deserving' and 'undeserving' poor, combining punitive corporal discipline for mobile vagrants with municipal taxation for local parish relief."
    },
    q2: {
      feature: "Towns and Justices of the Peace were required to provide raw materials (such as wool, hemp, and flax) so the able-bodied poor could work for wages.",
      detail: "It also ordered Houses of Correction (Bridewells) to be built to punish and force anyone who refused to work to do hard labour.",
      vague: "One feature was that it tried to help poor people who were able to work.",
      scholar: "The 1576 Act shifted social policy from mere penal repression to state-sponsored employment creation, attempting to absorb surplus agricultural labor through municipal raw material stocks and Bridewells."
    }
  },

  lesson_3_3: {
    q1: {
      feature: "Navigators adopted precision instruments like the astrolabe and quadrant to calculate their exact latitude using the sun or the North Star.",
      detail: "This was aided by the 1569 Mercator map projection, which allowed sailors to plot straight compass courses across open oceans without distorting direction.",
      vague: "One feature was that sailors used compasses and better instruments to navigate oceans.",
      scholar: "Navigational advancements transformed trans-oceanic voyaging from perilous coastal pilotage into mathematical oceanography, enabling English captains to establish reliable oceanic routes across the Atlantic and Pacific."
    },
    q2: {
      feature: "Drake became the first Englishman to sail around the world between 1577 and 1580 in his flagship, the *Golden Hind*.",
      detail: "He raided Spanish ports along the Pacific coast of South America and returned with £400,000 of Spanish silver, earning a knighthood from the Queen.",
      vague: "One feature was that Drake sailed all the way around the world in his ship.",
      scholar: "Drake’s circumnavigation demonstrated global maritime reach and shattered Iberian *mare clausum* doctrine, combining lucrative privateering plunder with territorial claim-staking in 'Nova Albion'."
    }
  },

  lesson_3_4: {
    q1: {
      feature: "Raleigh received a royal patent from Elizabeth in 1584 to establish a permanent colony on Roanoke Island to produce cash crops like tobacco and sugar.",
      detail: "The colony was also planned as a naval base for English privateers to raid the Spanish treasure fleets sailing home from the Caribbean.",
      vague: "One feature was that Raleigh sent English settlers to North America to build a colony called Virginia.",
      scholar: "Raleigh's Virginia project integrated mercantilist commodity extraction with forward naval projection, conceiving Roanoke as an agrarian plantation and a strategic privateering bastion against the Spanish West Indies."
    },
    q2: {
      feature: "The expedition’s flagship, the *Tiger*, ran aground on arrival, destroying almost all the settlers' seed corn and food supplies.",
      detail: "The colonists lacked farming skills and relations with the local Secotan tribe broke down, forcing them to abandon the settlement aboard Drake’s fleet in 1586.",
      vague: "One feature was that the settlers ran out of food and had fights with Native Americans.",
      scholar: "The 1585 Roanoke colony collapsed due to maritime logistical failure compounded by demographic dysfunction—gentlemen unwilling to farm and military escalation that alienated indigenous food supplies."
    }
  }
};

console.log('--- Recalibrating 24 Features in units/eee/data.js and public/units/eee/data.js ---');

const eeeFiles = [
  'C:/Projects/the-history-revision-hub/units/eee/data.js',
  'C:/Projects/the-history-revision-hub/public/units/eee/data.js'
];

for (const fPath of eeeFiles) {
  if (!fs.existsSync(fPath)) continue;
  const raw = fs.readFileSync(fPath, 'utf8');
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext('unitData = ' + raw.replace(/^export\s+default\s+/, ''), sandbox);
  const unitData = sandbox.unitData;

  let count = 0;
  unitData.lessons.forEach(l => {
    const rf = RECALIBRATED_FEATURES[l.id];
    if (!rf) return;
    const qs = l.exam_practice?.questions || [];

    // Q1
    if (qs[0] && rf.q1) {
      const q1Model = `Feature: ${rf.q1.feature}\nDetail: ${rf.q1.detail}`;
      qs[0].model = q1Model;
      qs[0].model_tiers = {
        tier_1m: {
          title: "1/2 Vague Feature",
          score: "1 / 2 Marks",
          level: "Level 1 Bottom (Assertion)",
          text: `<p>${rf.q1.vague}</p>`,
          verdict: "AO1 (1 mark). Identifies a valid general feature, but lacks specific supporting historical detail or evidence."
        },
        tier_2m: {
          title: "2/2 Pearson Benchmark ★",
          score: "2 / 2 Marks",
          level: "Level 1 Top (Full Marks)",
          badge: "Edexcel Benchmark",
          text: `<p><strong>Feature:</strong> ${rf.q1.feature}<br><strong>Detail:</strong> ${rf.q1.detail}</p>`,
          verdict: "AO1 (2 marks). Maximum marks awarded. Accurately identifies a key feature (1 mark) and provides specific supporting detail (1 mark)."
        },
        tier_10m: {
          title: "Level 10 Scholar 🚀",
          score: "Level 10",
          level: "Academic Distinction (Scholar)",
          badge: "A* Masterclass",
          text: `<p>${rf.q1.scholar}</p>`,
          verdict: "Scholar Distinction. Precise conceptual analysis evaluating the constitutional and political significance of the feature."
        }
      };
      count++;
    }

    // Q2
    if (qs[1] && rf.q2) {
      const q2Model = `Feature: ${rf.q2.feature}\nDetail: ${rf.q2.detail}`;
      qs[1].model = q2Model;
      qs[1].model_tiers = {
        tier_1m: {
          title: "1/2 Vague Feature",
          score: "1 / 2 Marks",
          level: "Level 1 Bottom (Assertion)",
          text: `<p>${rf.q2.vague}</p>`,
          verdict: "AO1 (1 mark). Identifies a valid general feature, but lacks specific supporting historical detail or evidence."
        },
        tier_2m: {
          title: "2/2 Pearson Benchmark ★",
          score: "2 / 2 Marks",
          level: "Level 1 Top (Full Marks)",
          badge: "Edexcel Benchmark",
          text: `<p><strong>Feature:</strong> ${rf.q2.feature}<br><strong>Detail:</strong> ${rf.q2.detail}</p>`,
          verdict: "AO1 (2 marks). Maximum marks awarded. Accurately identifies a key feature (1 mark) and provides specific supporting detail (1 mark)."
        },
        tier_10m: {
          title: "Level 10 Scholar 🚀",
          score: "Level 10",
          level: "Academic Distinction (Scholar)",
          badge: "A* Masterclass",
          text: `<p>${rf.q2.scholar}</p>`,
          verdict: "Scholar Distinction. Precise conceptual analysis evaluating the constitutional and political significance of the feature."
        }
      };
      count++;
    }
  });

  const updatedRaw = 'export default ' + JSON.stringify(unitData, null, 2) + ';\n';
  fs.writeFileSync(fPath, updatedRaw, 'utf8');
  console.log(`Recalibrated ${count} features in ${path.basename(fPath)}`);
}

// Update src/engine/mock_exam_bank_data.js
console.log('--- Recalibrating 24 Features in src/engine/mock_exam_bank_data.js ---');
const mebdPath = 'C:/Projects/the-history-revision-hub/src/engine/mock_exam_bank_data.js';
let mebdContent = fs.readFileSync(mebdPath, 'utf8');

Object.keys(RECALIBRATED_FEATURES).forEach(lessonId => {
  const rf = RECALIBRATED_FEATURES[lessonId];
  if (!rf) return;

  // Build Q1 Container
  const q1Container = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q1 Feature Drill [2 Marks])</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1 Mark:</strong> Identifies a valid feature (fact).<br><strong>2 Marks:</strong> Feature identified (1 mark) AND supported by a specific piece of evidence/detail (1 mark).</p>
  </div>
  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-circle-exclamation"></i> 1/2 Vague Feature (Level 1 Bottom)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1/2 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      ${rf.q1.vague}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> AO1 (1 mark). Identifies a valid general feature, but provides no specific supporting detail.
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-award"></i> 2/2 Pearson Benchmark (Full Marks ★)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.55;">
      <strong>Feature:</strong> ${rf.q1.feature}<br>
      <strong>Detail:</strong> ${rf.q1.detail}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> AO1 (2 marks). Maximum marks awarded. Identifies a valid feature (1 mark) and provides specific supporting detail (1 mark).
    </div>
  </div>
</div>`;

  // Build Q2 Container
  const q2Container = `<div class="tiered-model-container">
  <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 0.85rem; color: #1e293b;">
    <strong style="color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;"><i class="fa-solid fa-clipboard-check"></i> Official Edexcel Mark Scheme Rules (Q1 Feature Drill [2 Marks])</strong>
    <p style="margin: 4px 0 0 0; line-height: 1.45;"><strong>1 Mark:</strong> Identifies a valid feature (fact).<br><strong>2 Marks:</strong> Feature identified (1 mark) AND supported by a specific piece of evidence/detail (1 mark).</p>
  </div>
  <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #b45309; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-circle-exclamation"></i> 1/2 Vague Feature (Level 1 Bottom)</span>
      <span style="background: #fef3c7; color: #92400e; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">1/2 Marks</span>
    </div>
    <div style="font-size: 0.9rem; color: #1e293b; line-height: 1.5; font-style: italic;">
      ${rf.q2.vague}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #78350f; border-top: 1px dashed #fde68a; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> AO1 (1 mark). Identifies a valid general feature, but provides no specific supporting detail.
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 12px 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 800; color: #15803d; text-transform: uppercase; font-size: 0.78rem;"><i class="fa-solid fa-award"></i> 2/2 Pearson Benchmark (Full Marks ★)</span>
      <span style="background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">Full Marks (2/2)</span>
    </div>
    <div style="font-size: 0.92rem; color: #1e293b; line-height: 1.55;">
      <strong>Feature:</strong> ${rf.q2.feature}<br>
      <strong>Detail:</strong> ${rf.q2.detail}
    </div>
    <div style="margin-top: 6px; font-size: 0.78rem; color: #166534; border-top: 1px dashed #86efac; padding-top: 4px;">
      <strong>Examiner Verdict:</strong> AO1 (2 marks). Maximum marks awarded. Identifies a valid feature (1 mark) and provides specific supporting detail (1 mark).
    </div>
  </div>
</div>`;

  const q1Reg = new RegExp(`("id":\\s*"${lessonId}_q1"[\\s\\S]*?"modelAnswer":\\s*")[\\s\\S]*?(",\\s*"pdfUrl")`);
  if (q1Reg.test(mebdContent)) {
    mebdContent = mebdContent.replace(q1Reg, (m, p1, p2) => `${p1}${JSON.stringify(q1Container).slice(1, -1)}${p2}`);
  }

  const q2Reg = new RegExp(`("id":\\s*"${lessonId}_q2"[\\s\\S]*?"modelAnswer":\\s*")[\\s\\S]*?(",\\s*"pdfUrl")`);
  if (q2Reg.test(mebdContent)) {
    mebdContent = mebdContent.replace(q2Reg, (m, p1, p2) => `${p1}${JSON.stringify(q2Container).slice(1, -1)}${p2}`);
  }
});

fs.writeFileSync(mebdPath, mebdContent, 'utf8');
console.log('Successfully updated features in src/engine/mock_exam_bank_data.js');
console.log('--- Feature Recalibration Complete ---');

