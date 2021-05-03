import { findFirstEnemyInRange } from './target_handler.js';

// projectiles can proc:
// on shooting
// X seconds after shooting
// on hitting an enemy
// X seconds after hitting
// on enemy death
// X seconds after enemy death
class Projectile extends Phaser.GameObjects.Image {
    constructor(scene, bullet_type = 'small_bullet') {
        super(scene, 0, 0, bullet_type);
        this.damage = 0;
        this.range = 0;
        this.speed = 0;
        this.dx = 0;
        this.dy = 0;
        this.target_angle = 0;
        this.chains = 0;
        this.lifespan = 0;
        this.initial_lifespan = 0;
        this.targeting_mode = 'first';
        this.td_scene = this.scene;
    }
    fire(tower, bullet_type, lifespan = 1000) {
        this.target = tower.target;
        this.target_angle = tower.target_angle;
        this.tower_id = tower.tower_id;
        this.lifespan = lifespan;
        this.speed = tower.tower_info.attributes.projectile_speed;
        this.damage = tower.tower_info.attributes.damage;
        this.range = tower.tower_info.attributes.range;
        tower.tower_info.attributes.projectile_modifiers?.forEach(mod => {
            if (mod.chains)
                this.chains += mod.chains;
        });
        this.initial_lifespan = this.lifespan;
        this.last_enemy_hit = undefined;
        this.dx = Math.cos(this.target_angle);
        this.dy = Math.sin(this.target_angle);
        this.setPosition(tower.x, tower.y);
        this.setRotation(this.target_angle - Math.PI / 2);
        this.setTexture(bullet_type);
        this.body.setEnable(true);
        this.body.reset(tower.x, tower.y);
        this.body.setVelocity(this.dx * this.speed, this.dy * this.speed);
        this.setActive(true);
        this.setVisible(true);
    }
    update(time, delta) {
        this.lifespan -= delta;
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.body.setEnable(false);
        }
    }
    hit(enemy) {
        let still_alive = false;
        if (this.chains > 0) {
            this.chains--;
            const targets = this.target ? [this.target] : [];
            const new_target = findFirstEnemyInRange(this, this.td_scene, this.range, targets);
            if (new_target) {
                still_alive = true;
                this.target = new_target;
                this.lifespan = this.initial_lifespan;
                this.target_angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
                this.dx = Math.cos(this.target_angle);
                this.dy = Math.sin(this.target_angle);
                this.setRotation(this.target_angle - Math.PI / 2);
                this.body.reset(this.x, this.y);
                this.body.setVelocity(this.dx * this.speed, this.dy * this.speed);
            }
        }
        if (!still_alive) {
            this.setActive(false);
            this.setVisible(false);
            this.body.setEnable(false);
            this.lifespan = 0;
        }
        return this.damage;
    }
}

export default Projectile;
//# sourceMappingURL=projectile.js.map
