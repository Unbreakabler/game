var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["green_knight"] = 0] = "green_knight";
    EnemyType[EnemyType["bug"] = 1] = "bug";
    EnemyType[EnemyType["blue_dragon"] = 2] = "blue_dragon";
})(EnemyType || (EnemyType = {}));
const ENEMY_MODIFIERS = {
    'size_0': {
        id: 'size_0',
        name: 'Huge',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 1.25,
        },
        visual_modifiers: {
            width: 1.25,
            height: 1.25,
        },
        difficulty_multiplier: 1.25,
    },
    'size_1': {
        id: 'size_1',
        name: 'Massive',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 1.5,
        },
        visual_modifiers: {
            width: 1.5,
            height: 1.5,
        },
        difficulty_multiplier: 1.5,
    },
    'size_2': {
        id: 'size_2',
        name: 'Giant',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 1.75,
        },
        visual_modifiers: {
            width: 1.75,
            height: 1.75,
        },
        difficulty_multiplier: 1.75,
    },
    'size_3': {
        id: 'size_3',
        name: 'Enormous',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 2,
        },
        visual_modifiers: {
            width: 2,
            height: 2,
        },
        difficulty_multiplier: 2,
    },
    'size_4': {
        id: 'size_4',
        name: 'Gargantuan',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 2.5,
        },
        visual_modifiers: {
            width: 2.5,
            height: 2.5,
        },
        difficulty_multiplier: 2.5,
    },
    'size_5': {
        id: 'size_5',
        name: 'Colossal',
        mod_type: 'size',
        mod_tier: 0,
        stat_multipliers: {
            health_points: 3,
        },
        visual_modifiers: {
            width: 3,
            height: 3,
        },
        difficulty_multiplier: 3,
    },
    'group_0': {
        id: 'group_0',
        name: 'Mob',
        mod_type: 'group',
        mod_tier: 0,
        stat_multipliers: {
            group_size: 1.25,
        },
        difficulty_multiplier: 2,
    },
    'group_1': {
        id: 'group_1',
        name: 'Throng',
        mod_type: 'group',
        mod_tier: 0,
        stat_multipliers: {
            group_size: 1.5,
        },
        difficulty_multiplier: 3,
    },
    'group_2': {
        id: 'group_2',
        name: 'Multitude',
        mod_type: 'group',
        mod_tier: 0,
        stat_multipliers: {
            group_size: 1.75,
        },
        difficulty_multiplier: 4,
    },
    'group_3': {
        id: 'group_3',
        name: 'Horde',
        mod_type: 'group',
        mod_tier: 0,
        stat_multipliers: {
            group_size: 2,
        },
        difficulty_multiplier: 5,
    },
    'group_4': {
        id: 'group_4',
        name: 'Swarm',
        mod_type: 'group',
        mod_tier: 0,
        stat_multipliers: {
            group_size: 2.25,
        },
        difficulty_multiplier: 6,
    },
    'movement_0': {
        id: 'movement_0',
        name: 'Accelerated',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 1.5,
        },
        difficulty_multiplier: 2,
    },
    'movement_1': {
        id: 'movement_1',
        name: 'Nimble',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 2,
        },
        difficulty_multiplier: 2.5,
    },
    'movement_2': {
        id: 'movement_2',
        name: 'Turbo',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 2.5,
        },
        difficulty_multiplier: 3,
    },
    'movement_3': {
        id: 'movement_3',
        name: 'Lagging',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 0.9,
        },
        difficulty_multiplier: 0.9,
    },
    'movement_4': {
        id: 'movement_4',
        name: 'Lumbering',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 0.8,
        },
        difficulty_multiplier: 0.8,
    },
    'movement_5': {
        id: 'movement_5',
        name: 'Plodding',
        mod_type: 'movement',
        mod_tier: 0,
        stat_multipliers: {
            movement_speed: 0.7,
        },
        difficulty_multiplier: 0.7,
    },
};
const TIER_MODIFIER_WEIGHTS = {
    0: [
        { id: 'size_0', weight: 1000 },
        { id: 'group_0', weight: 1000 },
        { id: 'movement_0', weight: 1000 },
    ],
    1: [
        { id: 'size_1', weight: 1000 },
        { id: 'group_1', weight: 1000 },
        { id: 'movement_1', weight: 1000 },
    ],
    2: [
        { id: 'size_2', weight: 1000 },
        { id: 'group_2', weight: 1000 },
        { id: 'movement_2', weight: 1000 },
    ],
    3: [
        { id: 'size_3', weight: 1000 },
        { id: 'group_3', weight: 1000 },
        { id: 'movement_3', weight: 1000 },
    ],
    4: [
        { id: 'size_4', weight: 1000 },
        { id: 'group_4', weight: 1000 },
        { id: 'movement_4', weight: 1000 },
    ],
};
({
    [EnemyType.green_knight]: {
        0: [
            { id: 'size_0', weight: 1000 },
            { id: 'group_0', weight: 1000 },
            { id: 'movement_0', weight: 1000 },
        ]
    },
    [EnemyType.bug]: {
        0: [
            { id: 'size_0', weight: 100 },
            { id: 'group_0', weight: 1000 },
            { id: 'movement_0', weight: 1000 },
        ]
    },
    [EnemyType.blue_dragon]: {
        0: [
            { id: 'size_0', weight: 1000 },
            { id: 'group_0', weight: 500 },
            { id: 'movement_0', weight: 500 },
        ]
    }
});

export { ENEMY_MODIFIERS, EnemyType, TIER_MODIFIER_WEIGHTS };
//# sourceMappingURL=stats_enemy_modifiers.js.map
