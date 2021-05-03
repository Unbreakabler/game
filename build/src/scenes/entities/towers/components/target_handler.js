function findFirstEnemyInRange(parent, td_scene, range = 0, ignore_list = []) {
    const enemies = td_scene.wave_manager.enemies;
    let first_enemy;
    let first_distance = Number.MIN_VALUE;
    for (const e of enemies.getMatching('targettable', true)) {
        if (ignore_list.indexOf(e) !== -1)
            continue;
        const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
        if (d < range) {
            if (e.follower.t > first_distance) {
                first_distance = e.follower.t;
                first_enemy = e;
            }
        }
    }
    return first_enemy;
}
function findClosestEnemyInRange(parent, td_scene, range = 0, ignore_list = []) {
    const enemies = td_scene.wave_manager.enemies;
    let closest_enemy;
    let closest_distance = Number.MAX_VALUE;
    for (const e of enemies.getMatching('targettable', true)) {
        if (ignore_list.indexOf(e) !== -1)
            continue;
        const d = Phaser.Math.Distance.Squared(parent.x, parent.y, e.x, e.y);
        if (d < (range) * (range)) {
            if (d < closest_distance) {
                closest_distance = d;
                closest_enemy = e;
            }
        }
    }
    return closest_enemy;
}
function findLastEnemyInRange(parent, td_scene, range = 0, ignore_list = []) {
    const enemies = td_scene.wave_manager.enemies;
    let furthest_enemy;
    let furthest_distance = Number.MAX_VALUE;
    for (const e of enemies.getMatching('targettable', true)) {
        if (ignore_list.indexOf(e) !== -1)
            continue;
        const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
        if (d < range) {
            if (e.follower.t < furthest_distance) {
                furthest_distance = e.follower.t;
                furthest_enemy = e;
            }
        }
    }
    return furthest_enemy;
}
function findStrongestEnemyInRange(parent, td_scene, range = 0, ignore_list = []) {
    const enemies = td_scene.wave_manager.enemies;
    let strongest_enemy;
    let heightest_hp = Number.MIN_VALUE;
    for (const e of enemies.getMatching('targettable', true)) {
        if (ignore_list.indexOf(e) !== -1)
            continue;
        const d = Phaser.Math.Distance.Between(parent.x, parent.y, e.x, e.y);
        if (d < range) {
            if (e.health_points > heightest_hp) {
                heightest_hp = e.health_points;
                strongest_enemy = e;
            }
        }
    }
    return strongest_enemy;
}
var target_handler = (tower) => {
    return {
        type: 'target_handler',
        onUpdate: (parent, time, delta) => {
            let e;
            if (tower.status.targeting_mode === 'first')
                e = findFirstEnemyInRange(parent, parent.td_scene, tower.attributes.range);
            if (tower.status.targeting_mode === 'closest')
                e = findClosestEnemyInRange(parent, parent.td_scene, tower.attributes.range);
            if (tower.status.targeting_mode === 'last')
                e = findLastEnemyInRange(parent, parent.td_scene, tower.attributes.range);
            if (tower.status.targeting_mode === 'strongest')
                e = findStrongestEnemyInRange(parent, parent.td_scene, tower.attributes.range);
            parent.target_angle = Phaser.Math.Angle.Between(parent.x, parent.y, e?.x || parent.target?.x || 0, e?.y || parent.target?.y || 0);
            parent.target = e;
        }
    };
};

export default target_handler;
export { findClosestEnemyInRange, findFirstEnemyInRange, findLastEnemyInRange, findStrongestEnemyInRange };
//# sourceMappingURL=target_handler.js.map
