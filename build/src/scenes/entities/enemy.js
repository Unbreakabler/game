const DEFAULT_ENEMY_SPEED = 1 / 10000;
class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'green-knight');
        this.path = null;
        this.speed = DEFAULT_ENEMY_SPEED;
        this.health_points = 100;
        this.anims.play('green-knight-idle');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    startOnPath(path) {
        this.path = path;
        // set the t parameter at the start of the path
        this.follower.t = 0;
        // get x and y of the given t point            
        this.path.getPoint(this.follower.t, this.follower.vec);
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }
    update(time, delta) {
        // move the t point along the path, 0 is the start and 0 is the end
        if (!this.path) {
            return; // skip updates if path has not be set by startOnPath
        }
        this.follower.t += this.speed * delta;
        // get the new x and y coordinates in vec
        this.path.getPoint(this.follower.t, this.follower.vec);
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    receiveDamage(damage) {
        this.health_points -= damage;
        if (this.health_points < 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export default Enemy;
//# sourceMappingURL=enemy.js.map
