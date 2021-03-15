import type Enemy from "./enemies/enemy";

import seedrandom from 'seedrandom'


type EnemyType = 'green_knight'

type EnemyModifer = null

const MODIFIER_DEFAULT_DIFFICULTY_THRESHOLD = 10; // 10 difficulty pts always remain after modifier selection
const DEFAULT_SEED = 'babies'
// set `Math.random()` to be a PRNG seeded with DEFAULT_SEED
seedrandom(DEFAULT_SEED, {global: true });


function weightedRandom(items: WeightedMod[]) {
  let i;

  let weights: any[] = []

  for (i = 0; i < weights.length; i++) {
    weights[i] = items[i].weight + (weights[i - 1] || 0);
  }
  
  const random = Math.random() * weights[weights.length - 1];
  
  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) break;
  }
  
  return items[i];
}


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

export const generateWave = (max_difficulty: number): Enemy[] => {
  if (max_difficulty < 1) return [];
  let current_difficulty = 0

  const {enemy_type, enemy_type_difficulty} = chooseEnemyType(max_difficulty);

  current_difficulty += enemy_type_difficulty

  const {modifiers, modifier_difficulty} = chooseEnemyModifiers(enemy_type, current_difficulty, max_difficulty);

  current_difficulty += modifier_difficulty

  const { enemies } = generateEnemyList(enemy_type, modifiers, current_difficulty);

  return enemies
}

 /** 
  * Enemy Type:
  * An emeny type is the base class of an enemy; Think a goblin, or skeleton from any basic arpg.
  * Our initial games enemy type is "green_knight".
  */
const chooseEnemyType = (max_difficulty: number) => {
  /* 
  - Different enemy types are gated behind a minimum difficulty number. 
    Think of a skeleton king that spawns as a boss at first at some threshold, and then a normal mob later in the game.
  - Even at very high difficulties, the most basic enemy type can be selected. It will then have mods added to match the difficulty of the level.
  - Certain enemy types are more likely to spawn in certain difficulty ranges. Think of Act 1/2/3/4 enemies are exclusive to their act, and then late game all enemies appear in "maps".
  */

  const enemy_type: EnemyType = 'green_knight'
  const enemy_type_difficulty = 1;

  return { enemy_type, enemy_type_difficulty};
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
 * 
 * - Fragility and Resistance Tiers:
 *    - Significant
 *    - Substantial
 *    - Ample
 *    - Minimal
 *    - Trivial
 */
const chooseEnemyModifiers = (enemy_type: EnemyType, current_difficulty: number, max_difficulty: number) => {

  const modifiers: EnemyModifer[] = []
  let modifier_difficulty = current_difficulty;

  const modifier_pool = getAvailableModifiers(enemy_type, modifier_difficulty, max_difficulty);
  
  while (max_difficulty - modifier_difficulty > MODIFIER_DEFAULT_DIFFICULTY_THRESHOLD) {
    const selected_mod_weight = weightedRandom(modifier_pool);
    const mod_class_pool = ENEMY_MODIFIERS[selected_mod_weight.class]
    if (selected_mod_weight.id in mod_class_pool) {
      const selected_mod = mod_class_pool[selected_mod_weight.id]
    }
    // need to subtract from difficulty
    let difficulty_with_modifier = modifier_difficulty * selected_mod.difficulty_multiplier
    const difficulty_threshold = max_difficulty - MODIFIER_DEFAULT_DIFFICULTY_THRESHOLD
    if (difficulty_with_modifier > difficulty_threshold) break;
    modifier_difficulty = difficulty_with_modifier
    modifiers.push(selected_mod);
  }

  return { modifiers, modifier_difficulty}
}





/**
 * - Enemy types are divided into "tiers", starting at tier 0, incrementing as required.
 * - Enemy modifiers are divide into "tiers", starting at tier 0, incrementing as required in each category.
 * - Each "tier" of enemy types has an associated list enemy modifiers tiers and their "unlock" level.
 * 
 * @param enemy_type 
 * @param difficulty 
 * @returns 
 */
const getAvailableModifiers = (enemy_type: EnemyType, current_difficulty: number, max_difficulty: number) => {

  const enemy_tier = getEnemyTypeTier(enemy_type);

  // This should take current and max difficulty.
  // only return modifiers that when used would leave more then 10 difficulty points in the remaining difficulty

  const max_difficulty_multiplier = max_difficulty - current_difficulty / current_difficulty

  const modifiers = getEnemyTierModifiers(enemy_type, enemy_tier);

  console.log('modifiers', modifiers)

  // Randomly choose modifiers from pool

  return modifiers
}

const getEnemyTypeTier = (enemy_type: EnemyType): ModTier => {
  if (enemy_type === 'green_knight') return 0;
  return 0;
}

type ModTier = 0 | 1 | 2

type ModList = {
  [enemy_type in EnemyType]: {
    [tier in ModTier]?: WeightedMod[]
  }
}

interface WeightedMod {
  id: string,
  class: EneyModifierCategoryIds,
  weight: integer,
}

type EneyModifierCategoryIds = 'size' | 'group' | 'movement'
type EnemySizeModifierIds = 'size_0' | 'size_1'
type EnemyGroupModifierIds = 'group_0'
type EnemyMovementModifierIds = 'movement_0'

interface EnemyModifier {
  name: string,
  stat_multipliers?: {
    health_points?: number,
    movment_speed?: number,
    group_size?: number,
  }
  visual_modifiers?: {
    width?: number,
    height?: number,
  },
  difficulty_multiplier: number;
}


type EnemyModifierLibrary = {
  size: {
    [mod_id in EnemySizeModifierIds]?: EnemyModifier
  },
  group: {
    [mod_id in EnemyGroupModifierIds]?: EnemyModifier
  },
  movement: {
    [mod_id in EnemyMovementModifierIds]?: EnemyModifier
  }
}

const ENEMY_MODIFIERS: EnemyModifierLibrary = {
  size: {
    'size_0': {
      name: 'Huge',
      stat_multipliers: {
        health_points: 1.25,
      },
      visual_modifiers: {
        width: 1.5,
        height: 1.5,
      },
      difficulty_multiplier: 1.25,
    },
  },
  group: {
    'group_0': {
      name: 'Mob',
      stat_multipliers: {
        group_size: 2,
      },
      difficulty_multiplier: 2,
    },
  },
  movement: {
    'movement_0': {
      name: 'Accelerated',
      stat_multipliers: {
        movment_speed: 1.5,
      },
      difficulty_multiplier: 2,
    },
  }
}

const ENEMY_TIER_MODIFIERS_WEIGHTS: ModList = {
  green_knight: {
    0: [
      { id: 'size_0', class: 'size', weight: 1000 },
      { id: 'group_0', class: 'group', weight: 1000 },
      { id: 'movement_0', class: 'movement', weight: 1000 },
    ]
  }
}

/**
 * Desclenatingly iterate through the enemy tiers , adding add modifiers and their weights to the return result
 * @param enemy_type 
 * @param tier 
 * @returns 
 */
const getEnemyTierModifiers = (enemy_type: EnemyType, tier: ModTier) => {
  let modifiers: WeightedMod[] = []
  while (tier >= 0) {
    let weighted_mod_ids = ENEMY_TIER_MODIFIERS_WEIGHTS[enemy_type][tier]
    if (weighted_mod_ids && weighted_mod_ids.length) modifiers = modifiers.concat(weighted_mod_ids)
    tier--
  }
  return modifiers;
}


const generateEnemyList = (enemy_type: EnemyType, modifiers: EnemyModifer[], difficulty: number) => {
  let enemies: Enemy[] = [];
  return { enemies }
}


