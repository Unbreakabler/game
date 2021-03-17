// TODO(jon): FIX THIS
// Loading module from “http://localhost:8000/public/build/_virtual/__node-resolve:empty.js_commonjs-proxy”
// was blocked because of a disallowed MIME type (“application/octet-stream”).

// import seedrandom from 'seedrandom'

// const DEFAULT_SEED = 'babies'
// // set `Math.random()` to be a PRNG seeded with DEFAULT_SEED
// seedrandom(DEFAULT_SEED, {global: true });

type EnemyType = 'green_knight'

type ModTier = 0 | 1 | 2

type ModList = {
  [enemy_type in EnemyType]: {
    [tier in ModTier]?: WeightedMod[]
  }
}

interface WeightedMod {
  id: string,
  weight: integer,
}

type ModifierId = EnemyMovementModifierIds | EnemySizeModifierIds | EnemyGroupModifierIds
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
  [mod_id in ModifierId]?: EnemyModifier
}

const ENEMY_MODIFIERS: EnemyModifierLibrary = {
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
  'group_0': {
    name: 'Mob',
    stat_multipliers: {
      group_size: 2,
    },
    difficulty_multiplier: 2,
  },
  'movement_0': {
    name: 'Accelerated',
    stat_multipliers: {
      movment_speed: 1.5,
    },
    difficulty_multiplier: 2,
  },
}

const ENEMY_TIER_MODIFIERS_WEIGHTS: ModList = {
  green_knight: {
    0: [
      { id: 'size_0', weight: 1000 },
      { id: 'group_0', weight: 1000 },
      { id: 'movement_0', weight: 1000 },
    ]
  }
}

/**
 * Takes a list of objects with weights and selects a random object from the weighted list.
 * TODO generic type with weight property?
 * @param items object containting a number "weight" field on each object
 * @returns items[i]
 */
function weightedRandom<T>(items: T[], pop?: boolean): T {
  let i;

  let weights: any[] = []

  for (i = 0; i < items.length; i++) {
    if (typeof (items[i] as any).weight !== undefined) {
      weights[i] = (items[i] as any).weight + (weights[i - 1] || 0);
    }
  }
  
  const random = Math.random() * weights[weights.length - 1];
  
  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) break;
  }
  const ret_val = items.splice(i, 1)
  return ret_val[0];
}

export interface EnemyWave { 
  wave_type: string, 
  enemy_type: EnemyType, 
  modifiers: EnemyModifier[],
  mob_count: integer,
  mob_difficulty: number,
  wave_difficulty: number,
  enemy_spawn_delta: number,
}


/**
 * Design thoughts:
 * 
 * - Do we want multiple types of enemies in a single wave? GOING WITH NO CURRENTLY
 * Pros:
 * - More unique wave combinations
 * - More interesting wave mechanics. You'll have fast and slow creeps. Large groups of weak mobs, and strong single mobs.
 * 
 * Cons:
 * - Harder to visually and mentally parse the enemy wave if it's composed of many different enemy types.
 * 
 * Algorithm:
 * 1. Select "wave type" (normal, magic, rare)
 * 2. Calculate max individual mob difficulty, 10% of max for normal, 30% for magic, 50%-100% for rare.
 * 3. Select modifiers at random until difficulty threshold is reach for individual mob
 * 4. apply modifiers to difficulty, add mobs until wave difficulty reaches max_difficulty
 */
export const generateWave = (max_difficulty: number): EnemyWave => {
  const { wave_type, max_modifiers } = chooseWaveType(max_difficulty);

  const max_mob_difficulty = calculateMaxMobDifficulty(wave_type, max_difficulty);

  const { enemy_type, enemy_type_difficulty } = chooseEnemyType(max_mob_difficulty);

  const { modifiers, mob_with_modifier_difficulty } = chooseEnemyModifiers(enemy_type, enemy_type_difficulty, max_mob_difficulty, max_modifiers);

  const { mob_count, mob_difficulty } = generateEnemyList(mob_with_modifier_difficulty, modifiers, max_difficulty);

  const wave_difficulty = mob_count * mob_difficulty

  return { wave_type, enemy_type, modifiers, mob_count, mob_difficulty, wave_difficulty, enemy_spawn_delta: 2000}
}

const chooseWaveType = (max_difficulty: number) => {
  const wave_types = [
    { wave_type: 'normal', max_modifiers: 1, weight: 1000 },
  ]
  if (max_difficulty > 30) {
    wave_types.push({ wave_type: 'magic', max_modifiers: 3, weight: 1000 })
  }
  if (max_difficulty > 60) {
    wave_types.push({ wave_type: 'rare', max_modifiers: 6, weight: 1000 })
  }
  const choice = weightedRandom(wave_types)
  return { wave_type: choice.wave_type, max_modifiers: choice.max_modifiers }
}

const calculateMaxMobDifficulty = (wave_type: string, max_difficulty: number) => {
  let divisor = 10;
  if (wave_type === 'magic') divisor = 4
  if (wave_type === 'rare') divisor = 2
  return Math.floor(max_difficulty/divisor)
}

 /** 
  * Enemy Type:
  * An emeny type is the base class of an enemy; Think a goblin, or skeleton from any basic arpg.
  * Our initial games enemy type is "green_knight".
  */
const chooseEnemyType = (max_difficulty: number): { enemy_type: EnemyType, enemy_type_difficulty: integer } => {
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
const chooseEnemyModifiers = (enemy_type: EnemyType, enemy_type_difficulty: number, max_mob_difficulty: number, max_mods: number) => {

  const modifiers: EnemyModifier[] = []
  let mob_with_modifier_difficulty = enemy_type_difficulty;

  const modifier_pool = getAvailableModifiers(enemy_type);

  // console.log('mob_with_modifier_difficulty', mob_with_modifier_difficulty, max_mob_difficulty)
  while (mob_with_modifier_difficulty < max_mob_difficulty && modifier_pool.length) {
    const selected_mod_weight = weightedRandom(modifier_pool, true);
    // console.log('selected_mod_weight', selected_mod_weight, modifier_pool)
    const selected_mod = ENEMY_MODIFIERS[selected_mod_weight.id as ModifierId]
    if (selected_mod) {
      let difficulty_with_modifier = mob_with_modifier_difficulty * selected_mod.difficulty_multiplier
      if (difficulty_with_modifier > max_mob_difficulty) break;
      mob_with_modifier_difficulty = difficulty_with_modifier
      modifiers.push(selected_mod);
      if (modifiers.length >= max_mods) break;
    }
  }

  return { modifiers, mob_with_modifier_difficulty}
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
const getAvailableModifiers = (enemy_type: EnemyType) => {
  const enemy_tier = getEnemyTypeTier(enemy_type);
  return getEnemyTierModifiers(enemy_type, enemy_tier);
}

/**
 * Enemy tier is currently determined by type alone.
 * There will likely be additional tiers for each tier depending on difficulty.
 * eg: after difficulty 1_000_000 green_knight will always be a tier 1 unit or something similar.
 * @param enemy_type 
 * @returns 
 */
const getEnemyTypeTier = (enemy_type: EnemyType): ModTier => {
  if (enemy_type === 'green_knight') return 0;
  return 0;
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


const generateEnemyList = (mob_with_mods_difficulty: number, 
                           modifiers: EnemyModifier[],
                           max_difficulty: number
): { mob_count: number, mob_difficulty: number } => {
  
  // Iterate through modifiers, if there are any "group" modifiers, remove the difficulty form the mob difficulty
  // and increase the mob_count
  
  let mob_difficulty = mob_with_mods_difficulty;
  let mob_count_multiplier = 1;

  // Multiply the mob count by any "group" stat modifiers which increase mob count.
  // this could happen in the wave manager instead;
  modifiers.forEach(mod => {
    if (mod.name.startsWith('group_')) {
      mob_difficulty = mob_difficulty / mod.difficulty_multiplier;
      if (mod.stat_multipliers?.group_size) {
        mob_count_multiplier *= mod.stat_multipliers.group_size
      }
    }
  })

  const mob_count = Math.floor((max_difficulty/mob_difficulty) * mob_count_multiplier)

  return { mob_count, mob_difficulty }
}


