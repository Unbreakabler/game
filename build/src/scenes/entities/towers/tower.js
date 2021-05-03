import rotating_turret from './components/tower_rotating_turret.js';
import tower_base from './components/tower_base.js';
import target_handler from './components/target_handler.js';
import target_indicator from './components/target_indicator.js';
import range_indicator from './components/range_indicator.js';
import projectile_handler from './components/projectile_handler.js';
import placement_handler from './placement_handler.js';
import selection_handler from './components/selection_handler.js';

/**
 * Second attempt a writing a tower class. The goal of the rewrite is to add a component system to towers that can used for extension.
 * I also want an easier way to manage multiple sprites related to a single tower, and manage post processing effects on any set of those sprites.
 */
class Tower extends Phaser.GameObjects.GameObject {
    constructor(td_scene, tower, components = (tower) => ([tower_base(), rotating_turret(tower.status.type)]), targeting_components = (tower) => ([target_handler(tower), target_indicator()]), projectile_components = (tower) => ([projectile_handler()]), placement_components = (tower) => ([placement_handler(), range_indicator(), selection_handler()]), range = 300) {
        super(td_scene, 'tower');
        this.is_placed = false;
        this.is_placeable = true;
        this.targeting_mode = 'first';
        this.target_angle = 0;
        this.attack_speed = 100;
        this.time_elapsed = 0;
        this.time_to_fire_next_shot = 0;
        td_scene.add.existing(this);
        this.td_scene = td_scene;
        this.x = tower.status.x;
        this.y = tower.status.y;
        this.range = range;
        // use tower_id to fetch attributes
        // calculate attributes with modifiers
        this.tower_id = tower.status.id;
        this.tower_info = tower;
        // fetch linked components? For now components are hardcoded in td.ts
        this.components = components(this.tower_info);
        this.targeting_components = targeting_components(this.tower_info);
        this.projectile_components = projectile_components(this.tower_info);
        this.placement_components = placement_components(this.tower_info);
        // call component initializers
        this.components.forEach(c => {
            if (c.onInit)
                c.onInit(this, td_scene, this.x, this.y);
        });
        this.targeting_components.forEach(c => {
            if (c.onInit)
                c.onInit(this, td_scene, this.x, this.y);
        });
        this.projectile_components.forEach(c => {
            if (c.onInit)
                c.onInit(this, td_scene, this.x, this.y);
        });
        this.placement_components.forEach(c => {
            if (c.onInit)
                c.onInit(this, td_scene, this.x, this.y);
        });
        this.setVisible(false);
        this.targeting_indicator?.setVisible(false);
        this.selection = undefined;
    }
    place(x, y) {
        this.x = x;
        this.y = y;
        this.is_placed = true;
        this.is_placeable = false;
        this.setActive(true);
        this.setVisible(true);
    }
    setVisible(flag = true) {
        this.rotating_sprites?.setVisible(flag);
        this.static_sprites?.setVisible(flag);
        this.range_indicator?.setVisible(flag);
    }
    setPosition(x, y) {
        this.rotating_sprites?.setPosition(x, y);
        this.static_sprites?.setPosition(x, y);
        this.range_indicator?.setPosition(x, y);
    }
    update(time, delta) {
        this.placement_components.forEach(c => {
            if (typeof c?.onUpdate == 'function')
                c.onUpdate(this, time, delta);
        });
        if (!this.is_placed)
            return;
        this.components.forEach(c => {
            if (typeof c?.onUpdate == 'function')
                c.onUpdate(this, time, delta);
        });
        this.targeting_components.forEach(c => {
            if (typeof c?.onUpdate == 'function')
                c.onUpdate(this, time, delta);
        });
        this.projectile_components.forEach(c => {
            if (typeof c?.onUpdate == 'function')
                c.onUpdate(this, time, delta);
        });
    }
}

export default Tower;
//# sourceMappingURL=tower.js.map
