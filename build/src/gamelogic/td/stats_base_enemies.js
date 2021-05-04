import { EnemyType, ENEMY_MODIFIERS } from './stats_enemy_modifiers.js';

// import { EnemyType } from './enemy_wave_generator'
const SPEED_FACTOR = 10;
const HEALTH_POINT_FACTOR = 100;
const ENEMY_BASE_STATS = {
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
};
console.log('ENEMY_BASE_STATS', ENEMY_BASE_STATS);
/**
 * Caluclate enemy mob difficulty based on base stats (speed and health).
 * @param enemy_stats
 * @returns
 */
const calculateEnemyDifficulty = (enemy_stats) => {
    let difficulty = 0;
    difficulty += (enemy_stats.health_points / HEALTH_POINT_FACTOR); // "1" diff for each 100 hp
    difficulty += (enemy_stats.speed / 1) * SPEED_FACTOR; // normalize speed and scale by constant factor
    return difficulty;
};
const applyEnemyModifiers = (enemy_stats, modifier_ids) => {
    let modified_stats = { ...enemy_stats };
    for (let i = 0; i < modifier_ids.length; i++) {
        const mod = ENEMY_MODIFIERS[modifier_ids[i]];
        if (!mod)
            continue;
        // group mods have already affected group size, skip, should be removed from list.
        if (mod.mod_type === 'group')
            continue;
        if (mod.stat_multipliers?.health_points) {
            modified_stats.health_points *= mod.stat_multipliers.health_points;
        }
        if (mod.stat_multipliers?.movement_speed) {
            modified_stats.speed *= mod.stat_multipliers.movement_speed;
        }
    }
    return modified_stats;
};

export default ENEMY_BASE_STATS;
export { applyEnemyModifiers, calculateEnemyDifficulty };
//# sourceMappingURL=stats_base_enemies.js.map
