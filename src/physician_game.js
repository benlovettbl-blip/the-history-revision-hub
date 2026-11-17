/**
 * Legacy Physician Game Adapter -> Upgrades inline Medicine lessons directly
 * to "Quacks & Cures: 800 Years on Call" (5-Shift Illustrated Doctor & RAMC Simulation).
 */

import './arcade/arcade_styles.css';
import { mountQuacksAndCures } from './arcade/games/quacks_and_cures.js';

export async function initPhysicianGame(container) {
  if (!container) return;
  container.innerHTML = `<div class="arcade-stage-panel"></div>`;
  const stage = container.querySelector('.arcade-stage-panel');
  mountQuacksAndCures(stage, {}, { unitId: 'edexcel_medicine', scope: 'all' });
}
