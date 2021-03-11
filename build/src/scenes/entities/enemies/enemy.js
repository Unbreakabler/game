import { CombatText } from '../combat_text.js';
import { HealthBar } from '../health_bar.js';

const DEFAULT_ENEMY_SPEED = 1 / 10;
const DEFAULT_ENEMY_HP = 100;
// TODO(jon): show health bar when hp is below 100%
// TODO(jon): show floating combat text when an enemy takes damage.
// potentially also show the combat text on the tower? probably at least show the log when you select the tower.
class Enemy extends Phaser.GameObjects.Sprite {
    constructor(td_scene, x = 0, y = 0, sprite_name, speed = DEFAULT_ENEMY_SPEED, health_points = DEFAULT_ENEMY_HP) {
        super(td_scene, x, y, sprite_name);
        this.path = null;
        this.speed = DEFAULT_ENEMY_SPEED;
        this.health_points = DEFAULT_ENEMY_HP;
        this.prev_ang = 0;
        td_scene.physics.add.existing(this);
        this.td_scene = td_scene;
        this.sprite_name = sprite_name;
        this.name = this.sprite_name; // Likely the enemy name and sprite_name will differ in future
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.speed = speed;
        this.health_points = health_points;
        this.original_health_points = this.health_points; // health_points will need to be set for each enemy
        this.setActive(true);
        this.setVisible(true);
        this.health_bar = new HealthBar(td_scene, x, y - this.height, this.width, this.health_points);
    }
    // Allows reuse of enemy sprites
    resetEnemy() {
        if (!this.path)
            return;
        // set the t parameter at the start of the path
        this.follower.t = 0;
        // get x and y of the given t point
        this.path.getPoint(this.follower.t, this.follower.vec);
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.health_points = this.original_health_points;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    startOnPath(path) {
        this.path = path;
        this.resetEnemy();
    }
    update(time, delta) {
        // move the t point along the path, 0 is the start and 0 is the end
        if (!this.path)
            return; // skip updates if path has not be set by startOnPath
        this.health_bar.setCurrentHp(this.health_points);
        this.health_bar.setPosition(this.x, this.y - this.height);
        this.follower.t += (this.speed / this.path.getLength()) * delta;
        // get the new x and y coordinates in vec
        this.path.getPoint(this.follower.t, this.follower.vec);
        // angle between 0 and 2*PI
        const ang = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y) + Math.PI;
        if (ang != this.prev_ang) {
            if (ang < 1 / 4 * Math.PI || ang >= 7 / 4 * Math.PI) {
                // right
                this.anims.play(`${this.sprite_name}-walking-left`);
            }
            else if (ang < 7 / 4 * Math.PI && ang >= 5 / 4 * Math.PI) {
                // down
                this.anims.play(`${this.sprite_name}-walking-down`);
            }
            else if (ang < 5 / 4 * Math.PI && ang >= 3 / 4 * Math.PI) {
                // left
                this.anims.play(`${this.sprite_name}-walking-right`);
            }
            else if (ang < 3 / 4 * Math.PI && ang >= 1 / 4 * Math.PI) {
                // up
                this.anims.play(`${this.sprite_name}-walking-up`);
            }
        }
        this.prev_ang = ang;
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
            console.log("Enemy reached end.");
        }
    }
    preDestroy() {
        this.health_bar.destroy();
    }
    receiveDamage(damage) {
        this.health_points -= damage;
        // combat text is self managed and destroys itself from the scene after it's lifespan (default 250ms) has expired.
        // Generates a new floating combat text instance for each instance of damage
        new CombatText(this.td_scene, this.x, this.y - this.height, `${damage}`);
        if (this.health_points > 0)
            return true;
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
        return false;
    }
}

export default Enemy;
//# sourceMappingURL=enemy.js.map
