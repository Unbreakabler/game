const BASE_TOWER_ATTRIBUTES = {
    basic: {
        range: 200,
        damage: (tier) => 50 + tier * 55,
        attack_speed: (tier) => Math.max(1000 - tier * 10, 25),
        projectiles: (tier) => 1 + Math.floor(tier / 10),
        spread_angle: 0,
        area_of_effect_radius: 0,
    },
    machine_gun: {
        range: 150,
        damage: (tier) => 3 + tier * 3,
        attack_speed: 100,
        projectiles: 1,
        spread_angle: Math.PI / 12,
        area_of_effect_radius: 0,
    }
};
/**
 *
 * @param tower_status
 * @returns TowerAttributes Calculated attributes for a given tower type/tier
 */
const getTowerAttributes = (tower_status) => {
    const base_attributes = BASE_TOWER_ATTRIBUTES[tower_status.type];
    let res = {};
    for (const [key, val] of Object.entries(base_attributes)) {
        res[key] = typeof val === 'function' ? val(tower_status.tier) : val;
    }
    // console.log('getTowerAttributes', res)
    return res;
};

export { getTowerAttributes };
//# sourceMappingURL=stats_base_towers.js.map
