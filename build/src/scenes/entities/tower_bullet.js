class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, 0, 0, "small_bullet");
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = 0;
        this.damage = 0;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    }
    fire(x, y, angle, range, damage) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setRotation(angle - Phaser.Math.PI2 / 4); // FIXME(jon): not necessary if proj is round
        this.dx = Math.cos(angle); //
        this.dy = Math.sin(angle);
        this.lifespan = range * 1.3;
        this.damage = damage;
    }
    update(time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}

export default Bullet;
//# sourceMappingURL=tower_bullet.js.map
