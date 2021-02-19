import '../../node_modules/phaser/dist/phaser.js';
import Enemy from './entities/enemy.js';
import Turret from './entities/tower.js';
import Bullet from './entities/tower_bullet.js';

class TD extends Phaser.Scene {
    constructor() {
        super({ key: 'td', active: true });
        this.path = null;
        this.nextEnemy = 0;
        this.enemies = null;
        this.turrets = null;
        this.bullets = null;
    }
    preload() {
        this.load.image('turret', 'static/shotgun.png');
        this.load.image('small_bullet', 'static/small_bullet.png');
        // this.load.image('shotgun')
        this.load.spritesheet('green-knight', 'static/green_knight.png', {
            frameWidth: 20,
            frameHeight: 29,
        });
    }
    create() {
        const graphics = this.add.graphics();
        // the path for our enemies
        // parameters are the start x and y of our path
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 164);
        this.path.lineTo(500, 164);
        this.path.lineTo(500, 644);
        graphics.lineStyle(3, 0xffffff, 1);
        // visualize the path
        this.path.draw(graphics);
        this.anims.create({
            key: 'green-knight-idle',
            frames: this.anims.generateFrameNames('green-knight', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);
        this.input.on('pointerdown', this.placeTurret);
    }
    update(time, delta) {
        // if its time for the next enemy
        if (time > this.nextEnemy && this.enemies) {
            let enemy = this.enemies.get();
            if (enemy) {
                enemy.setActive(true);
                enemy.setVisible(true);
                // place the enemy at the start of the path
                enemy.startOnPath(this.path);
                this.nextEnemy = time + 2000;
            }
        }
    }
    placeTurret(pointer) {
        const place_y = Math.floor(pointer.y);
        const place_x = Math.floor(pointer.x);
        const width = 32; // Default width/height for now, can be changed per tower.
        const height = 32;
        // NO IDEA why I have to access turrents/path/bullets via this.scene instead of this. directly.
        if (this.scene.turrets && this.scene.path) {
            const turret = this.scene.turrets.get();
            if (turret) {
                turret.place(place_y, place_x, height, width, this.scene.turrets, this.scene.path, this.scene.bullets);
            }
        }
    }
    getEnemy(x, y, distance) {
        if (this.enemies) {
            const enemyUnits = this.enemies.getChildren();
            for (var i = 0; i < enemyUnits.length; i++) {
                if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
                    return enemyUnits[i];
            }
        }
        return false;
    }
    damageEnemy(enemy, bullet) {
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // we remove the bullet right away
            bullet.setActive(false);
            bullet.setVisible(false);
            // decrease the enemy hp with BULLET_DAMAGE
            enemy.receiveDamage(bullet.damage);
        }
    }
}

export default TD;
//# sourceMappingURL=td.js.map
