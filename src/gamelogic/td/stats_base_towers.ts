import type { TowerStatus, TowerType } from './tower_defense'

export interface TowerAttributes {
  damage: CallableFunction | number,
  range: CallableFunction | number,
  attack_speed: CallableFunction | number,
  projectiles: CallableFunction | number, // NOT YET IMPLEMENTED
  area_of_effect_radius: CallableFunction | number, // NOT YET IMPLEMENTED
  spread_angle: CallableFunction | number, // NOT YET IMPLEMENTED
}

export interface TowerCalculatedAttributes { 
  damage: number,
  range: number,
  attack_speed: number,
  projectiles: number, // NOT YET IMPLEMENTED
  projectile_speed: number, // NOT YET IMPLEMENTED
  area_of_effect_radius: number, // NOT YET IMPLEMENTED
  spread_angle: number, // NOT YET IMPLEMENTED
}

type BaseTowerAttributes = {
  [k in TowerType]: TowerAttributes
}


const BASE_TOWER_ATTRIBUTES: BaseTowerAttributes = {
  basic: {
    range: 200,
    damage: (tier: number) => 50 + tier*55,
    attack_speed: (tier: number) => Math.max(1000 - tier*10, 25),
    projectiles: (tier: number) => 1 + Math.floor(tier/10),
    spread_angle: 0,
    area_of_effect_radius: 0,
  },
  machine_gun: {
    range: 150,
    damage: (tier: number) => 3 + tier*3, 
    attack_speed: 100,
    projectiles: 1,
    spread_angle: Math.PI/12, // 15 degree spread (not currently used)
    area_of_effect_radius: 0,
  }
}

/**
 * 
 * @param tower_status 
 * @returns TowerAttributes Calculated attributes for a given tower type/tier
 */
export const getTowerAttributes = (tower_status: TowerStatus): TowerCalculatedAttributes => {
  const base_attributes = BASE_TOWER_ATTRIBUTES[tower_status.type]
  let res: any = {}
  for (const [key, val] of Object.entries(base_attributes)) {
    res[key] = typeof val === 'function' ? val(tower_status.tier) : val
  }
  // console.log('getTowerAttributes', res)
  return res as TowerCalculatedAttributes
}