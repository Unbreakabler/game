class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, starting_hp) {
        const height = 5;
        super(scene, x, y, width, height, 0x00ff00);
        scene.add.existing(this);
        this.starting_hp = starting_hp;
        this.current_hp = this.starting_hp;
        this.starting_width = width;
        this.background_bar = scene.add.rectangle(x, y - 1, width, height + 2, 0x000000);
        this.background_bar.setStrokeStyle(2, 0xffffff);
        this.setDepth(2);
        this.setVisible(false);
        this.background_bar.setVisible(false);
    }
    preDestroy() {
        this.background_bar.destroy();
    }
    setCurrentHp(health_points) {
        if (health_points !== this.current_hp) {
            this.current_hp = health_points;
            const r = this.current_hp / this.starting_hp;
            this.width = this.starting_width * r;
        }
        if (this.current_hp < this.starting_hp && !this.visible) {
            this.setVisible(true);
            this.background_bar.setVisible(true);
            this.background_bar.setActive(true);
        }
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.background_bar?.setPosition(x, y);
        return this;
    }
}

export { HealthBar };
//# sourceMappingURL=health_bar.js.map
