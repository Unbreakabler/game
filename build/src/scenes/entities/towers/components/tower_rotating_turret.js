var rotating_turret = (turret_type = 'basic') => {
    const tower_component = {
        type: 'rotating_turret',
        onInit: (parent, td_scene, x, y) => {
            // Setup sprites
            if (!parent.rotating_sprites) {
                parent.rotating_sprites = new Phaser.GameObjects.Container(td_scene, x, y);
                parent.rotating_sprites.name = `${parent.tower_id}_rotating_sprites`; // randomly generate this name?
                parent.rotating_sprites.depth = 1;
                parent.rotating_sprites.scale = 0.5;
                td_scene.add.existing(parent.rotating_sprites);
            }
            const turret = new Phaser.GameObjects.Sprite(td_scene, 0, 0, turret_type);
            parent.rotating_sprites.add(turret);
        },
        onUpdate: (parent, time, delta) => {
            if (!parent.active)
                return;
            if (parent.target && parent.rotating_sprites) {
                parent.rotating_sprites.rotation = Phaser.Math.Angle.Between(parent.x, parent.y, parent.target.x, parent.target.y) + Math.PI / 2;
            }
        }
    };
    return tower_component;
};

export default rotating_turret;
//# sourceMappingURL=tower_rotating_turret.js.map
