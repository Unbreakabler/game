// import { EnemyType } from './enemy_wave_generator'

export enum EnemyType {
  green_knight,
  bug,
  blue_dragon,
}

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
    speed: 1/10,
    experience: 2,
    money: 2,
    sprite_link: 'static/green_knight.png'
  }, 
  [EnemyType.bug]: {
    health_points: 100,
    speed: 1/8,
    experience: 1,
    money: 1,
    sprite_link: 'static/bug.png'
  },
  [EnemyType.blue_dragon]: {
    health_points: 1000,
    speed: 1/10,
    experience: 10,
    money: 10,
    sprite_link: 'static/blue_dragon.png'
  }
}

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

export default ENEMY_BASE_STATS