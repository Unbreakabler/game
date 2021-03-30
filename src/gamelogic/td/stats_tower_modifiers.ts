import type { TowerCalculatedAttributes } from "./stats_base_towers"

export interface IIndexable<T = any> { [key: string]: T }

export type AttributeModifierIds = 'physical_1' | 'chain_1'

export interface SlotAttributeModifier {
  damage_type?: string, // physical, elemental (specific elements?), chaos
  damage?: CallableFunction,
  range?: CallableFunction,
  attack_speed?: CallableFunction,
  projectiles?: CallableFunction, // NOT YET IMPLEMENTED
  projectile_speed?: CallableFunction, // NOT YET IMPLEMENTED
  area_of_effect_radius?: CallableFunction, // NOT YET IMPLEMENTED
  spread_angle?: CallableFunction, // NOT YET IMPLEMENTED
  // Maybe some graphical stuff? change the size of the projectile, etc?
  projectile_modifiers?: CallableFunction | SlotProjectileModifier[],
}

export interface SlotProjectileModifier {
  chains?: integer, // Number of enemies a projectile will bounce between
  aoe?: AoeRange[], // A list of Aoe Ranges, this allows a tower do 100% damage in the inner 100 yards, and 50% in the next 100, etc.
  // status effects?
  slow?: SlowStatusEffect,
  stun_duration?: integer, // duration that an enemies speed is set to 0 + a stun indicator
}

// Might be easier to indicate two ranges. The maximum range that deals maximum damage, and the range where the aoe does 0 damge.
// Then we can taper from 100% to 0% between that range.
interface AoeRange {
  radius: number,
  damage_multiplier: number, // 0 to 1
}

interface SlowStatusEffect {
  speed_multiplier: number, // 0 (not moving)  to 1 (normal speed)
  duration: integer,
}

const PhysicalDamageModifier: SlotAttributeModifier = {
  damage: (current_damage: number, attribute_level: integer) => Math.floor(current_damage * (1 + attribute_level * 0.1)),
}

const ChainProjectileModifier: SlotAttributeModifier = {
  projectile_modifiers: (attribute_level: integer) => { return [{ chains: 1 + Math.floor(attribute_level/10) }] }
}

export const SLOT_ATTRIBUTE_LIBRARY: { [k in AttributeModifierIds]: SlotAttributeModifier } = {
  physical_1: PhysicalDamageModifier,
  chain_1: ChainProjectileModifier
}

export const applyTowerAttributeModifiers = (attributes: TowerCalculatedAttributes, attribute_modifier_ids: {id: AttributeModifierIds, level: integer}[]) => {
  const modifiers = attribute_modifier_ids.map(attr => {
    return {
      mod: SLOT_ATTRIBUTE_LIBRARY[attr.id],
      level: attr.level,
    }
  })

  modifiers.forEach(({ mod, level }) => {
    for (const [key, val] of Object.entries(mod)) {
      let attr = (attributes as IIndexable)[key]
      if (attr) (attributes as IIndexable)[key] = typeof val === 'function' ? val(attr, level) : attr

      if (key === 'projectile_modifiers') {
        attributes[key] = typeof val === 'function' ? val(level) : val
      }
    }
  })

  return attributes
}

