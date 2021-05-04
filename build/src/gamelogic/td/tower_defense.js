import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { generateWave } from './enemy_wave_generator.js';
import { getTowerAttributes } from './stats_base_towers.js';
import { applyTowerAttributeModifiers } from './stats_tower_modifiers.js';
import v4 from '../../../node_modules/uuid/dist/esm-browser/v4.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

const BasicTowerStatusDefaults = {
    id: 'basic_1',
    tier: 0,
    type: 'basic',
    projectile_type: 'small_bullet',
    x: 0,
    y: 0,
    is_placed: false,
    is_selected: false,
    targeting_mode: 'closest',
};
const MachineGunTowerStatusDefaults = {
    id: 'machine_gun_1',
    tier: 1,
    type: 'machine_gun',
    projectile_type: 'small_bullet',
    x: 0,
    y: 0,
    is_placed: false,
    is_selected: false,
    targeting_mode: 'closest',
};
class TowerDefense {
    constructor() {
        this.selection = null;
        this.stats = {};
        this.waves = [];
        this.current_wave_info = { total: 0, spawned: 0, alive: 0, killed: 0, leaked: 0, lives: 0, level: 0 };
        this.current_wave_difficulty = 100;
        this.time_multiplier = 1;
        this.first_tower_is_placed = false;
        this.inventory = [
            { type: 'tower', item_id: 'basic_1', id: v4() },
            { type: 'tower', item_id: 'machine_gun_1', id: v4() },
            { type: 'modifier', item_id: 'physical_1', id: v4() },
            { type: 'modifier', item_id: 'physical_1', id: v4() },
            { type: 'modifier', item_id: 'chain_1', id: v4() },
            { type: 'modifier', item_id: 'chain_1', id: v4() },
        ];
        this.tower_map = get_default_tower_map();
        this.slot_tower_attribute_modifier_map = get_default_slot_tower_attribute_modifiers();
        this.slots = ['basic_1', 'machine_gun_1', null, null, null];
        this.slots.forEach(tower_id => {
            if (tower_id)
                this.stats[tower_id] = generate_default_stats();
        });
        for (let i = 0; i < 10; i++) {
            // Generate the first 10 waves
            this.generateEnemyWave();
        }
    }
    getTower(id) {
        if (!id)
            return null;
        const status = this.tower_map[id];
        if (!status)
            return null;
        const attributes = getTowerAttributes(status);
        // Apply modifiers to the attributes, these would mods that increase attack speed, projectiles, etc.
        const attribute_modifier_ids = this.slot_tower_attribute_modifier_map[id];
        // Lookup modifiers by id and pass tower attributes through the modifier functions.
        const modified_attributes = applyTowerAttributeModifiers(attributes, attribute_modifier_ids);
        return { status, attributes: modified_attributes };
    }
    getTowerStats(id) {
        const tower_stats = this.stats[id];
        if (tower_stats)
            return this.stats[id];
        this.stats[id] = generate_default_stats();
        return this.stats[id];
    }
    setSelection(id, cursor = 'selected') {
        if (!id) {
            this.selection = null;
            return;
        }
        for (const [name, tower] of Object.entries(this.tower_map)) {
            if (tower.id !== id) {
                tower.is_selected = false;
            }
            else {
                const type = tower.type;
                tower.is_selected = true;
                this.selection = { type, id, cursor };
            }
        }
    }
    placeTower(id, x, y) {
        const tower = this.tower_map[id];
        if (!tower)
            return;
        this.first_tower_is_placed = true;
        tower.x = x;
        tower.y = y;
        tower.is_placed = true;
        tower.is_selected = false;
    }
    recordTowerDamage(tower_id, damage) {
        const tower = this.getTower(tower_id);
        if (!tower)
            return;
        const tower_stats = this.getTowerStats(tower_id);
        tower_stats.damage.prestige += damage;
        // TODO(jon): track tower accuracy, projectiles fired, etc etc
    }
    recordTowerKill(tower_id, enemy_name) {
        const tower = this.getTower(tower_id);
        if (!tower)
            return;
        const tower_stats = this.getTowerStats(tower_id);
        if (!tower_stats.kills)
            tower_stats.kills = { lifetime: 0, prestige: 0 };
        if (!tower_stats.kills[enemy_name])
            tower_stats.kills[enemy_name] = 0;
        tower_stats.kills.prestige++;
        tower_stats.kills[enemy_name]++;
        this.current_wave_info.alive--;
        this.current_wave_info.killed++;
    }
    recordEnemyLeak(enemy) {
        // record leak count per wave?
        // TODO(jon): more, better stats. How many enemies were leaked? Current lives? etc.
        this.current_wave_info.alive--;
        this.current_wave_info.leaked++;
    }
    generateEnemyWave() {
        this.waves.push(generateWave(this.current_wave_difficulty));
        // TODO(jon): Figure out how to increase difficulty over time, 
        // a linear increase wont match item/drop/upgrade power spikes.
        this.current_wave_difficulty += 1;
    }
    spawnNextWave() {
        this.generateEnemyWave();
        this.current_wave_info.level++;
        this.waves.shift();
    }
    getCurrentWave() {
        return this.waves[0];
    }
}
__decorate([
    Exclude()
], TowerDefense.prototype, "selection", void 0);
const get_default_tower_map = () => {
    return {
        'basic_1': BasicTowerStatusDefaults,
        'machine_gun_1': MachineGunTowerStatusDefaults
    };
};
const get_default_slot_tower_attribute_modifiers = () => {
    return {
        'basic_1': [{ id: 'physical_1', level: 10 }, { id: 'chain_1', level: 10000 }],
        'machine_gun_1': [{ id: 'physical_1', level: 10 }, { id: 'chain_1', level: 20 }],
    };
};
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
    };
};
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

export { TowerDefense };
//# sourceMappingURL=tower_defense.js.map
