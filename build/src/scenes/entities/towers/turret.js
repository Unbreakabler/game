import Bullet from '../tower_bullet.js';

const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;
const PLACEABLE_MIN_DISTANCE_FROM_PATH = 50;
class Turret extends Phaser.GameObjects.Image {
    constructor(td_scene, x = 0, y = 0, sprite_name = "turret", range = DEFAULT_RANGE, attack_speed = DEFAULT_ATTACK_SPEED, damage = DEFAULT_DAMAGE) {
        super(td_scene, 0, 0, sprite_name);
        this.next_tick = 0;
        this.range = DEFAULT_RANGE;
        this.attack_speed = DEFAULT_ATTACK_SPEED;
        this.damage = DEFAULT_DAMAGE;
        this.td_scene = td_scene;
        this.range = range;
        this.attack_speed = attack_speed;
        this.damage = damage;
        this.projectiles = this.td_scene.add.group({ classType: Bullet, active: true, runChildUpdate: true });
    }
    isPlaceable(place_x, place_y, width, height, turrets, path) {
        const min_dist = path.getPoints(path.getLength() / 20).reduce((acc, point) => {
            return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
        }, 1000);
        if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
            // console.error('Can not place turret next to path')
            return false;
        }
        for (const t of turrets.children.entries) {
            if (t == this.td_scene.selection)
                continue; // current turret on cursor
            let min_x = t.x - t.width / 2;
            let max_x = t.x + t.width / 2;
            let min_y = t.y - t.height / 2;
            let max_y = t.y + t.height / 2;
            let new_min_x = place_x - width / 2;
            let new_max_x = place_x + width / 2;
            let new_min_y = place_y - height / 2;
            let new_max_y = place_y + height / 2;
            const x_overlap = Math.max(0, Math.min(max_x, new_max_x) - Math.max(min_x, new_min_x));
            const y_overlap = Math.max(0, Math.min(max_y, new_max_y) - Math.max(min_y, new_min_y));
            if (x_overlap * y_overlap > 0) {
                // console.error('Can not place a turret overlapping another turret')
                return false;
            }
        }
        return true;
    }
    place(place_x, place_y, width, height) {
        if (this.isPlaceable(place_x, place_y, width, height, this.td_scene.turrets, this.td_scene.path)) {
            this.x = place_x;
            this.y = place_y;
            this.setActive(true);
            this.setVisible(true);
            this.setInteractive();
            console.log(`placing turret @ x:${place_x}, y:${place_y}`);
            return true;
        }
        else {
            console.error(`Error placing turret @ x:${place_x}, y:${place_y}`);
            return false;
        }
    }
    update(time, delta) {
        //Look at near enemies
        const e = this.findClosestEnemyInRange(20);
        if (e) {
            this.targetEnemy(e);
        }
        else {
            this.angle = 90;
        }
        // time to shoot
        if (time > this.next_tick) {
            //If fired at enemy, start cooldown
            if (this.attemptToFire())
                this.next_tick = time + this.attack_speed;
        }
    }
    attemptToFire() {
        //Enemy Found
        const e = this.findClosestEnemyInRange();
        if (e) {
            //Add bullet
            this.fireBullet(this.x, this.y, this.getAngleToEnemy(e));
            //Update where turret is pointing
            this.targetEnemy(e);
            return true;
        }
        return false;
    }
    findClosestEnemyInRange(range_bonus = 0) {
        const enemies = this.td_scene.enemies;
        let closest_enemy;
        let closest_distance = Number.MAX_VALUE;
        for (const e of enemies.getChildren()) {
            const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
            if (d < this.range + range_bonus) {
                if (d < closest_distance) {
                    closest_distance = d;
                    closest_enemy = e;
                }
            }
        }
        return closest_enemy;
    }
    getAngleToEnemy(enemy) {
        return Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
    }
    targetEnemy(enemy) {
        this.rotation = this.getAngleToEnemy(enemy) + Math.PI / 2;
    }
    fireBullet(x, y, angle) {
        const b = new Bullet(this.scene);
        this.projectiles.add(b);
        //TODO - Make bullets smart so they follow units and delete selves when enemy is dead
        b.fire(x, y, angle, this.range, this.damage);
    }
    enableBulletCollisions(enemies) {
        this.scene.physics.add.overlap(enemies, this.projectiles, this.td_scene.damageEnemy);
    }
}

export default Turret;
//# sourceMappingURL=turret.js.map
