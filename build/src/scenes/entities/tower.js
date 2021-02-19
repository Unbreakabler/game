import './tower_bullet.js';

class Turret extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, 0, 0, 'turret');
        this.next_tick = 0;
        this.projectiles = null;
        this.range = 150;
        this.attack_speed = 1000;
        this.damage = 50;
        // this.projectiles = this.scene.add.group({ classType: Bullet, runChildUpdate: true });
    }
    place(place_y, place_x, height, width, turrets, path, bullets) {
        this.projectiles = bullets;
        try {
            // Get 50 random samples along the path, find the closest point to the tower.
            // This will need to be scaled depending on the total length of the path.
            const min_dist = path.getPoints(50).reduce((acc, point) => {
                return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
            }, 1000);
            if (min_dist < 50) {
                throw 'Can not place turret next to path';
            }
            turrets.children.entries.forEach((t) => {
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
                    throw 'Can not place a turret over another another turret';
                }
            });
            this.y = place_y;
            this.x = place_x;
            this.setActive(true);
            this.setVisible(true);
        }
        catch (e) {
            console.error(`Error placing turret @ x:${place_x}, y:${place_y}`, e);
            this.setActive(false);
            this.setVisible(false);
        }
    }
    update(time, delta) {
        // time to shoot
        if (time > this.next_tick) {
            this.fire();
            this.next_tick = time + this.attack_speed;
        }
    }
    fire() {
        const enemy = this.scene.getEnemy(this.x, this.y, this.range);
        if (enemy) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.addBullet(this.x, this.y, angle);
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        }
    }
    addBullet(x, y, angle) {
        if (this.projectiles) {
            const bullet = this.projectiles.get();
            if (bullet) {
                bullet.fire(x, y, angle, this.range, this.damage);
            }
        }
    }
}

export default Turret;
//# sourceMappingURL=tower.js.map
