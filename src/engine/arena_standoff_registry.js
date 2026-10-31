/**
 * ARENA STANDOFF REGISTRY
 * Dedicated Master Registry of Historical Shoulder-Partner Duels & Historiographical Debates.
 * 
 * 100% Hand-Curated Across All 18 Units (159 Lessons) in The History Revision Hub.
 * 
 * DESIGN PRINCIPLES:
 * 1. 100% Curated Historical Opposing Factions - Eliminates nonsensical pairings.
 * 2. Strict Pedagogical Ethics Guardrail for Sensitive Topics (e.g. The Shoah, The Kindertransport, Windermere):
 *    - Pupils NEVER roleplay perpetrators defending atrocities or debate victims.
 *    - Instead, automatically pivots to a "Historiographical Duel" between competing historical schools.
 * 3. Exam Specification Grounding:
 *    - Targets Edexcel GCSE Paper 1, Paper 2, Paper 3, and KS2/KS3 disciplinary enquiry questions.
 *    - Provides high-yield terminology, authentic historical objectives, and sharp oral sentence starters.
 */

import { CME_NEW_STANDOFFS } from './arena_standoffs/cme_new.js';
import { THE_SHOAH_STANDOFFS } from './arena_standoffs/the_shoah.js';
import { COLD_WAR_STANDOFFS } from './arena_standoffs/cold_war.js';
import { WEIMAR_NAZI_GERMANY_STANDOFFS } from './arena_standoffs/weimar_nazi_germany.js';
import { EEE_STANDOFFS } from './arena_standoffs/eee.js';
import { USA_STANDOFFS } from './arena_standoffs/usa.js';
import { EDEXCEL_MEDICINE_STANDOFFS } from './arena_standoffs/edexcel_medicine.js';
import { MEDIEVAL_ENGLAND_STANDOFFS } from './arena_standoffs/medieval_england.js';
import { MONARCHY_RELIGION_POWER_STANDOFFS } from './arena_standoffs/monarchy_religion_power.js';
import { INDUSTRIALISATION_AND_EMPIRE_STANDOFFS } from './arena_standoffs/industrialisation_and_empire.js';
import { GREAT_WAR_STANDOFFS } from './arena_standoffs/great_war.js';
import { GREAT_WAR_PART2_STANDOFFS } from './arena_standoffs/great_war_part2.js';
import { FIRST_BRITISH_EMPIRE_STANDOFFS } from './arena_standoffs/first_british_empire.js';
import { SECOND_BRITISH_EMPIRE_STANDOFFS } from './arena_standoffs/second_british_empire.js';
import { POST_WAR_BRITAIN_STANDOFFS } from './arena_standoffs/post_war_britain.js';
import { WATER_AND_SANITATION_STANDOFFS } from './arena_standoffs/water_and_sanitation.js';
import { AUSTRALIA_STANDOFFS } from './arena_standoffs/australia.js';
import { KS2_WW2_STANDOFFS } from './arena_standoffs/ks2_ww2.js';

export const ARENA_STANDOFF_REGISTRY = {
  cme_new: CME_NEW_STANDOFFS,
  the_shoah: THE_SHOAH_STANDOFFS,
  cold_war: COLD_WAR_STANDOFFS,
  weimar_nazi_germany: WEIMAR_NAZI_GERMANY_STANDOFFS,
  eee: EEE_STANDOFFS,
  usa: USA_STANDOFFS,
  edexcel_medicine: EDEXCEL_MEDICINE_STANDOFFS,
  medieval_england: MEDIEVAL_ENGLAND_STANDOFFS,
  monarchy_religion_power: MONARCHY_RELIGION_POWER_STANDOFFS,
  industrialisation_and_empire: INDUSTRIALISATION_AND_EMPIRE_STANDOFFS,
  great_war: GREAT_WAR_STANDOFFS,
  great_war_part2: GREAT_WAR_PART2_STANDOFFS,
  first_british_empire: FIRST_BRITISH_EMPIRE_STANDOFFS,
  second_british_empire: SECOND_BRITISH_EMPIRE_STANDOFFS,
  post_war_britain: POST_WAR_BRITAIN_STANDOFFS,
  water_and_sanitation: WATER_AND_SANITATION_STANDOFFS,
  australia: AUSTRALIA_STANDOFFS,
  ks2_ww2: KS2_WW2_STANDOFFS,
};

/**
 * Retrieves the curated Standoff duel pair for a given unit and lesson.
 * Falls back to an academically rigorous Causal / Historiographical debate if uncurated.
 */
export function getArenaStandoffPair(unitId, lessonId, lesson) {
  const normUnit = (unitId || '').toLowerCase().trim();
  const normLesson = (lessonId || '').toLowerCase().trim();

  // 1. Direct registry lookup
  const unitRegistry = ARENA_STANDOFF_REGISTRY[normUnit];
  if (unitRegistry) {
    if (unitRegistry[normLesson]) {
      return unitRegistry[normLesson];
    }
    // Try matching numeric index (e.g. lesson_1 from 1)
    const numMatch = normLesson.match(/\d+/);
    if (numMatch) {
      const numKey = 'lesson_' + numMatch[0];
      if (unitRegistry[numKey]) return unitRegistry[numKey];
    }
    // Try matching formatted key e.g. lesson_1_1
    const ktMatch = normLesson.match(/\d+[\._]\d+/);
    if (ktMatch) {
      const formattedKt = 'lesson_' + ktMatch[0].replace('.', '_');
      if (unitRegistry[formattedKt]) return unitRegistry[formattedKt];
    }
  }

  // 2. Specialized Historiographical Ethics Fallback for sensitive units
  const isHolocaustTopic = normUnit.includes('shoah') || 
                           normUnit.includes('holocaust') || 
                           (lesson && lesson.title && lesson.title.toLowerCase().includes('shoah'));

  if (isHolocaustTopic) {
    return {
      category: 'historiographical',
      title: 'Historical Enquiry: Competing Historical Perspectives',
      subtitle: lesson?.title || 'Historical Interpretations Duel',
      roleA: {
        name: 'Historian of Structural Radicalisation & Context',
        title: 'Interpretation 1: Structural Pressures & Cumulative Process',
        objective: 'Argue that historical events developed through cumulative institutional pressures, bureaucratic actions, and escalating wartime circumstances.',
        starter: '&ldquo;The archival evidence demonstrates that this development emerged primarily from structural pressures and wartime radicalisation because...&rdquo;',
        keyTerms: ['Historical Context', 'Structural Radicalisation', 'Documentary Evidence', 'Institutional Action']
      },
      roleB: {
        name: 'Historian of Ideological Intent & Moral Agency',
        title: 'Interpretation 2: Central Ideological Intent & Human Decisions',
        objective: 'Argue that specific decisions by key individuals and unyielding ideological intent were the decisive drivers of the outcome.',
        starter: '&ldquo;That perspective overlooks the central role of ideological intent and conscious individual choices, because leaders consistently...&rdquo;',
        keyTerms: ['Ideological Driver', 'Human Agency', 'Primary Evidence', 'Intentional Decisions']
      }
    };
  }

  // 3. Robust Disciplinary Fallback (Long-Term Structural Drivers vs Short-Term Triggers)
  const lessonTitle = lesson?.title || 'Historical Turning Point';
  const cleanTitle = lessonTitle.replace(/^kt\s*\d+(\.\d+)?[:\-]?\s*/i, '').replace(/^enquiry\s*\d+[:\-]?\s*/i, '');

  return {
    title: 'Disciplinary Debate: Causal Significance',
    subtitle: cleanTitle,
    roleA: {
      name: 'Perspective 1: Long-Term Structural Drivers',
      title: 'Economic, Social & Ideological Foundations',
      objective: 'Argue that deep-rooted structural forces (economic pressures, ideological divisions, and long-term policies) made this historical outcome inevitable.',
      starter: '&ldquo;The evidence proves that long-term structural forces were the primary and decisive factor because...&rdquo;',
      keyTerms: ['Long-Term Causes', 'Economic Pressures', 'Structural Framework', 'Inevitability']
    },
    roleB: {
      name: 'Perspective 2: Short-Term Catalysts & Key Individuals',
      title: 'Crisis Turning Points & Decisive Human Agency',
      objective: 'Argue that this outcome was not inevitable, and that specific trigger crises, tactical mistakes, or decisions by individual leaders directly determined what happened.',
      starter: '&ldquo;That argument ignores the decisive turning points of human agency, because without specific decisions and trigger events...&rdquo;',
      keyTerms: ['Trigger Event', 'Decisive Individuals', 'Turning Point', 'Human Agency']
    }
  };
}
