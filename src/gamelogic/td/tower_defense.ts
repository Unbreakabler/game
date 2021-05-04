import { Exclude } from "class-transformer";
import { v4 as uuidv4 } from 'uuid';

import { EnemyWave, generateWave } from './enemy_wave_generator'
import { getTowerAttributes, TowerCalculatedAttributes } from "./stats_base_towers";
import { AttributeModifierIds, applyTowerAttributeModifiers } from "./stats_tower_modifiers";

type BASIC_TOWER_IDS = 'basic_1'
type MACHINE_GUN_IDS = 'machine_gun_1'

export type TowerId = BASIC_TOWER_IDS | MACHINE_GUN_IDS
export type TowerBaseType = 'tower_base_1' | 'tower_base_2' | 'tower_base_3' | 'tower_base_4'
export type TargetingMode = 'first' | 'last' | 'strongest' | 'closest'
export type ProjectileType = 'small_bullet'


export interface TowerInfo {
  status: TowerStatus,
  attributes: TowerCalculatedAttributes,
}


export interface TowerStatus {
  id: TowerId,
  tier: integer,
  // do frames get exp? modifiers? hmm.
  // I think I would like towers to both "level" and be "upgraded", essentially having two levels.
  // should the exp levels carry between runs? What should carry between runs?
  exp_level?: integer,
  current_exp?: integer,
  exp_for_next_tier?: CallableFunction, 
  type: TowerType,
  projectile_type: ProjectileType,
  x: number,
  y: number,
  is_placed: boolean,
  is_selected: boolean,
  targeting_mode: TargetingMode
}

const BasicTowerStatusDefaults: TowerStatus = {
  id: 'basic_1',
  tier: 0,
  type: 'basic',
  projectile_type: 'small_bullet',
  x: 0,
  y: 0,
  is_placed: false,
  is_selected: false,
  targeting_mode: 'closest',
}

const MachineGunTowerStatusDefaults: TowerStatus = {
  id: 'machine_gun_1',
  tier: 1,
  type: 'machine_gun',
  projectile_type: 'small_bullet',
  x: 0,
  y: 0,
  is_placed: false,
  is_selected: false,
  targeting_mode: 'closest',
}

interface Stats {
  [tower_id: string] : TowerRecordedStats
}

interface TowerRecordedStats { 
  kills: { lifetime: number, prestige: number, [enemy_name: string]: number },
  damage: {
    lifetime: number,
    prestige: number
  }
}

interface WaveInfo {
  total: number,
  spawned: number,
  alive: number,
  killed: number,
  leaked: number,
  lives: number,
  level: number,
}

export type TowerType = 'basic' | 'machine_gun'

export type SelectionCursor = 'hovered' | 'selected'

export class TowerDefense {
  @Exclude() public selection: { type: TowerType, id: TowerId, cursor: SelectionCursor } | null = null;

  // Need to expose below but it breaks
  private tower_map: { [id in TowerId]: TowerStatus };

  private slot_tower_attribute_modifier_map: { [id in TowerId]: {id: AttributeModifierIds, level: integer}[]};

  public slots: Array<TowerId | null>
  public stats: Stats = {}
  public waves: EnemyWave[] = [];

  public current_wave_info: WaveInfo = { total: 0, spawned: 0, alive: 0, killed: 0, leaked: 0, lives: 0, level: 0 };
  public current_wave_difficulty: number = 100;
  public time_multiplier: number = 1;
  public first_tower_is_placed: boolean = false;

  public inventory = [
    { type: 'tower', item_id: 'basic_1', id: uuidv4() },
    { type: 'tower', item_id: 'machine_gun_1', id: uuidv4()},
    { type: 'modifier', item_id: 'physical_1', id: uuidv4()},
    { type: 'modifier', item_id: 'physical_1', id: uuidv4()},
    { type: 'modifier', item_id: 'chain_1', id: uuidv4()},
    { type: 'modifier', item_id: 'chain_1', id: uuidv4()},
  ]

  public constructor() {
    this.tower_map = get_default_tower_map();
    this.slot_tower_attribute_modifier_map = get_default_slot_tower_attribute_modifiers();
    this.slots = ['basic_1', 'machine_gun_1', null, null, null]
    this.slots.forEach(tower_id => {
      if (tower_id) this.stats[tower_id] = generate_default_stats()
    }); 

    for (let i = 0; i < 10; i++) {
      // Generate the first 10 waves
      this.generateEnemyWave()
    }
  }

  public getTower(id: TowerId | undefined): TowerInfo | null {
    if (!id) return null;
    const status = this.tower_map[id]
    if (!status) return null;
    const attributes = getTowerAttributes(status)
    // Apply modifiers to the attributes, these would mods that increase attack speed, projectiles, etc.
    const attribute_modifier_ids = this.slot_tower_attribute_modifier_map[id]

    // Lookup modifiers by id and pass tower attributes through the modifier functions.
    const modified_attributes = applyTowerAttributeModifiers(attributes, attribute_modifier_ids)

    return { status, attributes: modified_attributes }
  }

  public getTowerStats(id: TowerId): TowerRecordedStats {
    const tower_stats = this.stats[id]
    if (tower_stats) return this.stats[id]
    this.stats[id] = generate_default_stats()
    return this.stats[id]
  }

  public setSelection(id: TowerId | null, cursor: SelectionCursor = 'selected') {
    if (!id) {
      this.selection = null; 
      return;
    }
    for (const [name, tower] of Object.entries(this.tower_map)) {
      if (tower.id !== id) {
        tower.is_selected = false;
      } else {
        const type = tower.type
        tower.is_selected = true;
        this.selection = { type, id, cursor }
      }
    }
  }

  public placeTower(id: TowerId, x: number, y: number) {
    const tower = this.tower_map[id]
    if (!tower) return

    this.first_tower_is_placed = true;
    tower.x = x;
    tower.y = y;
    tower.is_placed = true;
    tower.is_selected = false;
  }

  public recordTowerDamage(tower_id: string, damage: number) {
    const tower = this.getTower(tower_id as TowerId)
    if (!tower) return

    const tower_stats = this.getTowerStats(tower_id as TowerId)
    tower_stats.damage.prestige += damage;

    // TODO(jon): track tower accuracy, projectiles fired, etc etc
  }

  public recordTowerKill(tower_id: string, enemy_name: string) {
    const tower = this.getTower(tower_id as TowerId)
    if (!tower) return

    const tower_stats = this.getTowerStats(tower_id as TowerId)
    if (!tower_stats.kills) tower_stats.kills = { lifetime: 0, prestige: 0 }
    if (!tower_stats.kills[enemy_name]) tower_stats.kills[enemy_name] = 0;
    tower_stats.kills.prestige++;
    tower_stats.kills[enemy_name]++;
    this.current_wave_info.alive--;
    this.current_wave_info.killed++;
  }

  public recordEnemyLeak(enemy: string) {
    // record leak count per wave?
    // TODO(jon): more, better stats. How many enemies were leaked? Current lives? etc.
    this.current_wave_info.alive--;
    this.current_wave_info.leaked++;
  }

  public generateEnemyWave() {
    this.waves.push(generateWave(this.current_wave_difficulty));
    // TODO(jon): Figure out how to increase difficulty over time, 
    // a linear increase wont match item/drop/upgrade power spikes.
    this.current_wave_difficulty += 1;
  }
  
  public spawnNextWave() {
    this.generateEnemyWave();
    this.current_wave_info.level++;
    this.waves.shift()!;
  }

  public getCurrentWave() {
    return this.waves[0];
  }
}

const get_default_tower_map = () => {
  return {
    'basic_1': BasicTowerStatusDefaults,
    'machine_gun_1': MachineGunTowerStatusDefaults
  }
}

const get_default_slot_tower_attribute_modifiers = (): { [id in TowerId]: {id: AttributeModifierIds, level: integer}[]} => {
  return {
    'basic_1': [{ id: 'physical_1', level: 10 }, { id: 'chain_1', level: 10000 }],
    'machine_gun_1': [{ id: 'physical_1', level: 10 }, { id: 'chain_1', level: 20}],
  }
}

const generate_default_stats = () => {
  return {
    kills: {
      lifetime: 0,
      prestige: 0,
    },
    damage: {
      lifetime: 0,
      prestige: 0,
    }
  }
}


/**
 * 
 * slots = []; // ordered array, index 0 = slot 1, index 1 = slot 2, etc.
 * slot = {
 *  tower_id: 'basic_1',
 *  modifier_ids: ['chain_1']
 * }
 * 
 * slots = [
 * { tower_id: 'basic_1', modifier_ids: ['chain_1']}
 * ]
 * 
 * What makes up a slot?
 * 1. Position on the bar
 * 2. Modifiers bound to slot
 * 3. Tower (tower parts) bound to slot
 * 
 */