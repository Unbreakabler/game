class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, 0, 0, "small_bullet");
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = 0;
        this.damage = 0;
        this.range = 0;
        this.chains = 0;
        this.td_scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    }
    fire(tower_id, x, y, angle, range, damage, projectile_modifiers) {
        this.tower_id = tower_id;
        if (!this.mods)
            this.initialize_mods(projectile_modifiers);
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setRotation(angle - Phaser.Math.PI2 / 4); // FIXME(jon): not necessary if proj is round
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        this.lifespan = range * 1.3;
        this.damage = damage;
        this.range = range;
    }
    update(time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    // returns damage
    // This is where a "chain" or "aoe" caluclation would take place if present on the projectile.
    hit(enemy) {
        if (enemy === this.last_enemy_hit)
            return null;
        let still_alive = false;
        if (this.chains > 0) {
            // target new enemy
            // set chain range
            // "fire" bullet in new direction
            const e = this.findClosestEnemyInRange(this.range, enemy);
            if (e) {
                this.last_enemy_hit = enemy;
                still_alive = true;
                this.chains--;
                const angle = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y);
                this.fire(this.tower_id, this.x, this.y, angle, this.range, this.damage, this.mods);
            }
            else {
                this.chains = 0;
            }
        }
        if (!still_alive)
            this.destroy();
        return this.damage;
    }
    initialize_mods(projectile_modifiers = []) {
        this.mods = projectile_modifiers;
        this.mods.forEach(mod => {
            if (mod.chains)
                this.chains += mod.chains;
        });
    }
    findClosestEnemyInRange(range = 0, current_target) {
        const enemies = this.td_scene.wave_manager.enemies;
        let closest_enemy;
        let closest_distance = Number.MAX_VALUE;
        for (const e of enemies.getChildren()) {
            if (e === current_target)
                continue;
            if (e === this.last_enemy_hit) {
                continue;
            }
            const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            if (d < range && d < closest_distance) {
                closest_distance = d;
                closest_enemy = e;
            }
        }
        return closest_enemy;
    }
}

export default Bullet;
//# sourceMappingURL=tower_bullet.js.map
