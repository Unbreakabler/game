// import { EnemyType } from './enemy_wave_generator'

import type { ModifierId } from "./stats_enemy_modifiers";
import { ENEMY_MODIFIERS} from "./stats_enemy_modifiers";
import { EnemyType } from "./stats_enemy_modifiers";


const SPEED_FACTOR = 10;
const HEALTH_POINT_FACTOR = 100;

interface EnemyStats {
  health_points: number,
  speed: number,
  experience: number,
  money: number,
  sprite_link: string,
}

type StatLibrary = {
  [k in EnemyType]: EnemyStats
}

const ENEMY_BASE_STATS: StatLibrary = {
  [EnemyType.green_knight]: {
  health_points: 200,
    speed: Phaser.Math.GetSpeed(50, 1),
    experience: 2,
    money: 2,
    sprite_link: 'static/green_knight.png'
  }, 
  [EnemyType.bug]: {
    health_points: 100,
    speed: Phaser.Math.GetSpeed(75, 1),
    experience: 1,
    money: 1,
    sprite_link: 'static/bug.png'
  },
  [EnemyType.blue_dragon]: {
    health_points: 500,
    speed: Phaser.Math.GetSpeed(50, 1),
    experience: 10,
    money: 10,
    sprite_link: 'static/blue_dragon.png'
  }
}

console.log('ENEMY_BASE_STATS', ENEMY_BASE_STATS)

/**
 * Caluclate enemy mob difficulty based on base stats (speed and health).
 * @param enemy_stats 
 * @returns 
 */
export const calculateEnemyDifficulty = (enemy_stats: EnemyStats) => {
  let difficulty = 0;

  difficulty += (enemy_stats.health_points/HEALTH_POINT_FACTOR) // "1" diff for each 100 hp
  difficulty += (enemy_stats.speed/1)*SPEED_FACTOR // normalize speed and scale by constant factor

  return difficulty
}

export const applyEnemyModifiers = (enemy_stats: EnemyStats, modifier_ids: ModifierId[]) => {
  let modified_stats = { ...enemy_stats }

  for (let i = 0; i < modifier_ids.length; i ++) {
    const mod = ENEMY_MODIFIERS[modifier_ids[i]]
    if (!mod) continue
    // group mods have already affected group size, skip, should be removed from list.
    if (mod.mod_type === 'group') continue;

    if (mod.stat_multipliers?.health_points) {
      modified_stats.health_points *= mod.stat_multipliers.health_points
    }

    if (mod.stat_multipliers?.movement_speed) {
      modified_stats.speed *= mod.stat_multipliers.movement_speed
    }  
  }

  return modified_stats
}

export default ENEMY_BASE_STATS