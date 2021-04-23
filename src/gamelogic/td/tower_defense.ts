import { Exclude } from "class-transformer";
import { v4 as uuidv4 } from 'uuid';

import { EnemyWave, generateWave } from './enemy_wave_generator'
import { getTowerAttributes, TowerCalculatedAttributes } from "./stats_base_towers";
import { AttributeModifierIds, applyTowerAttributeModifiers } from "./stats_tower_modifiers";

type BASIC_TOWER_IDS = 'basic_1'
type MACHINE_GUN_IDS = 'machine_gun_1'

export type TowerId = BASIC_TOWER_IDS | MACHINE_GUN_IDS
export type TargetingMode = 'first' | 'last' | 'strongest' | 'closest'


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
    prestige: number,
    types?: {
      fire?: number,
      ice?: number,
      //etc
    }
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

export type SelectionCursor = 'placement' | 'selected'

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

  public getTower(id: TowerId): TowerInfo | null {
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
    if (id in this.tower_map) {
      const type = this.tower_map[id].type
      this.selection = { type, id, cursor }
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
    this.current_wave_difficulty++;
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

// Tower data structure.
// Requirements:
// 1. Track multiple towers of multiple "tiers".
// 2. Merge multiple towers of the same tier into higher tiers.
// 3. Track counts of towers owned at each tier.
// 4. Automatically upgrade towers to the highest, or specific, tier (upgrade).

// IDEAS:
/*
Array of arrays; The index of the out array corresponds to tower tier,
ie: towers[0] = list of all owned tier 1 tower ids, towers[1] = tier 2, etc.

Merging can be accomplished by iterating through the list a single time,
if any of the nested lists have len >= 2 they can be upgraded to the nex tier.

When a new tower is added, a new ID is generated. When two towers are merged
a new tower is generated with a new ID, the old towers/ids are deleted.
The new tower will be roughly 2.1x as strong as the previous version making
it always worthwhile to upgrade.

towers = [
  [id1, id2, id4, id5],
  []
  [id3]
]

This only works for a single tower type, to manage multiple tower types
we either need to store more information in the inner lists (and then check this on iteration).
Or we need to store each tower type as its own array of arrays.

2.0 idea:

towers = {
  'basic': [
    [id1, id2],
  ],
  'machine_gun': [
    [id3, id4],
    [id5]
  ]
}

// Hashmap to lookup all towers in O(1) time, this allows us to easily pull up tower
// stats when selecting a tower
tower_map = {
  id1: {
    type: 'basic', 
    tier: 0,
  },
  id3: {
    type: 'machine_gun',
    tier: 0,
  },
  id5: {
    type: 'machine_gun',
    tier: 1, 
  }
}

tower_slots = [
  {
    modifiers: [burning_effect, freezing_effect]
  }
]

modifier_map = {
  burning_effect: {
    // Applies a visual burning effect
    // deals X% of damage over X seconds
  },
  freezing_effect: {
    // applies a cold effect
    // causes enemies effected to move X% slower for X seconds
  },
}

Each tower type is stored as an array of arrays.
Towers are infinitely upgradeable, the upgrade stats will follow a forumla.

Questions:

How would you place multiple basic towers? How would you tell if you
were placing a tier 1 or a tier 2? 
Do we need a visual indicator on the hover placement? (I think yes)

If you have the 'basic' tower in 'slot_1', and you place two of them,
the first tower will be the highest level, the next tower placed will be
the next highest level available (which could be a jump from tier 10000 to tier 1.)

Tower formula:

basic:

range = 200
damage = 50 + tier*55
projectiles = 1 + Math.floor(tier/100) // additional proj every 100 tiers
attack_speed = Math.max(1000 - tier, 250) // first once a second, increase attack speed for first 750 levels.


machine_gun:

range: 50,
damage: 2 + level*3,
projectiles: 100,
spread_arc: PI/12 // 15 degree spread arc


TODO:
1. Store tower state in svelte store and serialize/deserialize tower position.
  - Place towers in the correct position when refreshing the game.
2. Track the amount of enemies that have been leaked through the TD.
3. Use a factory to generate new turrets and add them to turret lists/map

*/