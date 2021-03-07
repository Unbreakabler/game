import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

const BasicTowerInfoDefaults = {
    tier: 0,
    type: 'basic',
    range: 200,
    damage: 50,
    attack_speed: 1000,
    projectiles: 1,
    spread_angle: 0,
    area_of_effect_radius: 0,
    x: 0,
    y: 0,
    is_placed: false,
    is_selected: false,
};
const MachineGunTowerInfoDefaults = {
    tier: 0,
    type: 'machine_gun',
    range: 100,
    damage: 2,
    attack_speed: 100,
    projectiles: 1,
    spread_angle: 0,
    area_of_effect_radius: 0,
    x: 0,
    y: 0,
    is_placed: false,
    is_selected: false,
};
const BASIC_TOWER_DEFAULT_ID = 'basic_1';
const MACHINE_GUN_TOWER_DEFAULT_ID = 'machine_gun_1';
class TowerDefense {
    constructor() {
        this.selection = null;
        this.towers = get_default_towers();
        this.tower_map = get_default_tower_map();
        this.slots = [BASIC_TOWER_DEFAULT_ID, MACHINE_GUN_TOWER_DEFAULT_ID, null, null, null];
    }
    getTower(id) {
        return this.tower_map[id];
    }
    setSelection(id, cursor = 'selected') {
        if (id in this.tower_map) {
            const type = this.tower_map[id].type;
            this.selection = { type, id, cursor };
        }
    }
    selectHighestTierForPlacement(tower_type) {
        // Should I check if there is a "selectable" tower of this type available first?
        const tower_list = this.towers[tower_type];
        if (!tower_list)
            return;
        // iterate backwards through list until we find an unplaced tower of this type
        const highest_tier_available_tower_list = tower_list.slice().reverse().flat();
        const highest_tier_available_tower_id = highest_tier_available_tower_list.find(tower_id => {
            const tower = this.getTower(tower_id);
            if (!tower)
                return;
            return !tower.is_placed;
        });
        if (!highest_tier_available_tower_id)
            return;
        this.setSelection(highest_tier_available_tower_id);
    }
    placeTower(id, x, y) {
        const tower = this.tower_map[id];
        if (!tower)
            return;
        tower.x = x;
        tower.y = y;
        tower.is_placed = true;
        tower.is_selected = false;
    }
}
__decorate([
    Exclude()
], TowerDefense.prototype, "selection", void 0);
// By default you have a single "basic" tower and a single "machine_gun" tower.
const get_default_towers = () => {
    return {
        'basic': [[BASIC_TOWER_DEFAULT_ID]],
        'machine_gun': [[MACHINE_GUN_TOWER_DEFAULT_ID]]
    };
};
const get_default_tower_map = () => {
    return {
        [BASIC_TOWER_DEFAULT_ID]: BasicTowerInfoDefaults,
        [MACHINE_GUN_TOWER_DEFAULT_ID]: MachineGunTowerInfoDefaults
    };
};
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

export { TowerDefense };
//# sourceMappingURL=tower_defense.js.map