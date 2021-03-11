class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, starting_hp) {
        const height = 15;
        super(scene, x, y, width, height, 0x00ff00);
        scene.add.existing(this);
        this.starting_hp = starting_hp;
        this.current_hp = this.starting_hp;
    }
    setCurrentHp(health_points) {
        if (health_points !== this.current_hp) {
            this.current_hp = health_points;
            const r = this.current_hp / this.starting_hp;
            this.width = this.width * r;
        }
    }
}

export { HealthBar };
//# sourceMappingURL=health_bar.js.map
