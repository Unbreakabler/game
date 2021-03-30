import type { EnemyType } from './enemy_wave_generator'

interface EnemyStats {
  health_points: number,
  speed: number,
  experience: number,
  money: number,
}

type StatLibrary = {
  [k in EnemyType]: EnemyStats
}

const ENEMY_BASE_STATS: StatLibrary = {
  green_knight: {
    health_points: 100,
    speed: 1/10,
    experience: 1,
    money: 1,
  }
}

export default ENEMY_BASE_STATS