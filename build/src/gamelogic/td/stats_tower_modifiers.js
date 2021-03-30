const PhysicalDamageModifier = {
    damage: (current_damage, attribute_level) => Math.floor(current_damage * (1 + attribute_level * 0.1)),
};
const ChainProjectileModifier = {
    projectile_modifiers: (attribute_level) => { return [{ chains: 1 + Math.floor(attribute_level / 10) }]; }
};
const SLOT_ATTRIBUTE_LIBRARY = {
    physical_1: PhysicalDamageModifier,
    chain_1: ChainProjectileModifier
};
const applyTowerAttributeModifiers = (attributes, attribute_modifier_ids) => {
    const modifiers = attribute_modifier_ids.map(attr => {
        return {
            mod: SLOT_ATTRIBUTE_LIBRARY[attr.id],
            level: attr.level,
        };
    });
    modifiers.forEach(({ mod, level }) => {
        for (const [key, val] of Object.entries(mod)) {
            let attr = attributes[key];
            if (attr)
                attributes[key] = typeof val === 'function' ? val(attr, level) : attr;
            if (key === 'projectile_modifiers') {
                attributes[key] = typeof val === 'function' ? val(level) : val;
            }
        }
    });
    return attributes;
};

export { SLOT_ATTRIBUTE_LIBRARY, applyTowerAttributeModifiers };
//# sourceMappingURL=stats_tower_modifiers.js.map
