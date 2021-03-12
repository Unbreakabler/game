import type Enemy from "./enemies/enemy";

import seedrandom from 'seedrandom'

type EnemyType = 'green_knight'

type EnemyModifer = null

const DEFAULT_SEED = 'babies'
// set `Math.random()` to be a PRNG seeded with DEFAULT_SEED
seedrandom(DEFAULT_SEED, {global: true });


/**
 * Design thoughts:
 * 
 * - Do we want multiple types of enemies in a single wave?
 * Pros:
 * - More unique wave combinations
 * - More interesting wave mechanics. You'll have fast and slow creeps. Large groups of weak mobs, and strong single mobs.
 * 
 * Cons:
 * - Harder to visually and mentally parse the enemy wave if it's composed of many different enemy types.
 */

const generateWave = (difficulty: number): Enemy[] => {
  var {enemy_type, remaining_difficulty} = chooseEnemyType(difficulty);

  var {modifiers, remaining_difficulty} = chooseEnemyModifiers(enemy_type, remaining_difficulty);

  const { enemies } = generateEnemyList(enemy_type, modifiers, remaining_difficulty);

  return enemies
}

 /** 
  * Enemy Type:
  * An emeny type is the base class of an enemy; Think a goblin, or skeleton from any basic arpg.
  * Our initial games enemy type is "green_knight".
  */
const chooseEnemyType = (difficulty: number) => {
  /* 
  - Different enemy types are gated behind a minimum difficulty number. 
    Think of a skeleton king that spawns as a boss at first at some threshold, and then a normal mob later in the game.
  - Even at very high difficulties, the most basic enemy type can be selected. It will then have mods added to match the difficulty of the level.
  - Certain enemy types are more likely to spawn in certain difficulty ranges. Think of Act 1/2/3/4 enemies are exclusive to their act, and then late game all enemies appear in "maps".
  */

  const enemy_type: EnemyType = 'green_knight'
  const enemy_type_difficulty = 1;

  const remaining_difficulty = difficulty - enemy_type_difficulty

  return { enemy_type, remaining_difficulty};
}

/**
 * Enemy Modifiers:
 * 
 * IMPLEMENTED:
 * - 
 * 
 * CAN BE IMPLEMENTED:
 * 
 * Size/HP modifiers:
 * - Colossal (5x hp, size, diff, exp)
 * - Gargantuan (4x hp, size, diff, exp)
 * - Enormonous (3x hp, size, diff, exp)
 * - Giant (2x hp, size, diff, exp)
 * - Massive (1.5x hp, size, diff, exp)
 * 
 * Group size modifiers:
 * - Swarm (6x group size, diff, exp)
 * - Horde (5x group size, diff, exp)
 * - Multitude (4x group size, diff, exp)
 * - Throng (3x group size, diff, exp)
 * - Mob (2x group size, diff, exp)
 * 
 * Movement speed modifiers:
 * - Turbo ( 2.5x movement, diff, exp )
 * - Nimble ( 2x movement, diff, exp )
 * - Accelerated ( 1.5x movement, diff, exp )
 * - Lagging (0.9x movement, diff, exp)
 * - Lumbering (0.8x movement, diff, exp)
 * - Plodding (0.7x movement, diff, exp)
 * - Stiff (0.6x movement, diff, exp)
 * - Labored (0.5x movement, diff, exp)
 * 
 *  NOT YET IMPLEMENTALABLE:
 * 
 * Misc modifiers:
 * - Health Linked (4x group size, 2x diff, exp; all enemies spawn quickly, they all share damage equally distributed)
 * - 
 * 
 * Resistance modifiers:
 * - Resistant (fire/cold/lightning)
 *    - Fire (burning dmg) - Reduces burning damage taken by 25%, 1.5x diff, exp
 *    - Cold (slow) - Reduces slowing effect by 25%, 1.5x diff, exp
 *    - Lightning (crit chance/damage) - Reduces critical damage taken from critical hits by 25%, 1.5x diff, exp
 * 
 * - Fragile (fire/cold/lightning)
 *    - Fire - Incraeses burning damage taken by 25%, 0.9x diff, exp
 *    - Cold - Increases slowing effect by X%, 0.9x diff, exp
 *    - Lightning - Increase cirtical damage taken from critical hits by X%, 0.9x diff, exp
 */
const chooseEnemyModifiers = (enemy_type: EnemyType, difficulty: number) => {

  const modifiers: EnemyModifer[] = []
  const modifier_difficulty = 0;

  const remaining_difficulty = difficulty- modifier_difficulty

  return { modifiers, remaining_difficulty}
}

const generateEnemyList = (enemy_type: EnemyType, modifiers: EnemyModifer[], difficulty: number) => {
  let enemies: Enemy[] = [];
  return { enemies }
}






let difficulty = 1;
const wave = generateWave(difficulty)

console.log('test wave', wave)