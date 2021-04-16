class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, 0, 0, "small_bullet");
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 1000;
        this.speed = 400;
        this.damage = 0;
        this.range = 600;
        this.chains = 0;
        this.original_lifespan = 1000;
        this.td_scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(25, 25); // set physics body collision size
        this.setActive(false);
        this.setVisible(false);
    }
    fire(tower_id, x, y, angle, range, damage, projectile_modifiers) {
        this.tower_id = tower_id;
        this.setActive(true);
        this.setVisible(true);
        if (!this.mods)
            this.initialize_mods(projectile_modifiers);
        this.setPosition(x, y);
        this.setRotation(angle - Math.PI / 2); // FIXME(jon): not necessary if proj is round
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        this.body.setVelocity(dx * this.speed, dy * this.speed);
        this.damage = damage;
        this.range = range;
    }
    update(time, delta) {
        this.lifespan -= delta;
        if (this.lifespan <= 0) {
            console.log('BULLET LIFESPAN EXPIRED');
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
    /**
     * Returns damage done by hit.
     *
     * Retargets and refires projectile for certain modifiers (chain).
     */
    hit(enemy) {
        if (enemy === this.last_enemy_hit)
            return null;
        let still_alive = false;
        if (this.chains > 0) {
            this.lifespan = this.original_lifespan;
            const e = this.findClosestEnemyInRange(this.range, enemy);
            if (e) {
                this.last_enemy_hit = enemy;
                still_alive = true;
                this.chains--;
                const angle = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y);
                const dx = Math.cos(angle);
                const dy = Math.sin(angle);
                this.body.setVelocity(dx * this.speed, dy * this.speed);
            }
            else {
                console.log('NO ENEMY IN CHAIN RANGE');
                this.chains = 0;
                this.lifespan = 0;
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
            if (e === current_target || e === this.last_enemy_hit)
                continue;
            const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
            if (d < range * range && d < closest_distance) {
                closest_distance = d;
                closest_enemy = e;
            }
        }
        return closest_enemy;
    }
}

export default Bullet;
//# sourceMappingURL=tower_bullet.js.map
