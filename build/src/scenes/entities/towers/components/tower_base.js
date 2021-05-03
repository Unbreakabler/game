const BASE_DIMENSIONS = {
    'tower_base_1': {
        scale: 0.7,
        width: 128,
        height: 128,
    },
    'tower_base_2': {
        scale: 0.7,
        width: 128,
        height: 128,
    },
    'tower_base_3': {
        scale: 0.7,
        width: 128,
        height: 128,
    },
    'tower_base_4': {
        scale: 0.7,
        width: 128,
        height: 128,
    }
};
var tower_base = (base_type = 'tower_base_1') => {
    const tower_component = {
        type: 'rotating_turret',
        onInit: (parent, td_scene, x, y) => {
            // Setup sprites
            if (!parent.static_sprites) {
                parent.static_sprites = new Phaser.GameObjects.Container(td_scene, x, y);
                parent.static_sprites.name = `${parent.tower_id}_static_sprites`; // randomly generate this name?
                parent.static_sprites.depth = 0;
                td_scene.add.existing(parent.static_sprites);
                parent.static_sprites.scale = BASE_DIMENSIONS[base_type].scale;
                parent.width = BASE_DIMENSIONS[base_type].width;
                parent.height = BASE_DIMENSIONS[base_type].height;
            }
            const base = new Phaser.GameObjects.Sprite(td_scene, 0, 0, base_type);
            parent.static_sprites.add(base);
        }
    };
    return tower_component;
};

export default tower_base;
//# sourceMappingURL=tower_base.js.map
