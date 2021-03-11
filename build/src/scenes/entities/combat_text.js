const DEFAULT_STYLE = {
    fontFamily: 'Courier',
    fontSize: '18px',
    fontStyle: '',
    backgroundColor: '',
    color: '#fff',
    stroke: '#E64A47',
    strokeThickness: 2,
    align: 'center',
    maxLines: 0,
    fixedWidth: 0,
    fixedHeight: 0,
    rtl: false,
};
// TODO(jon): Add more styles for different types of hits
// fire can be red, ice blue, etc
// crits should be larger and "shake" or something for impact
class CombatText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style = DEFAULT_STYLE, lifespan = 500) {
        super(scene, x, y, text, style);
        this.float_increase = 0;
        scene.add.existing(this);
        this.starting_lifespan = lifespan;
        this.remaining_lifespawn = lifespan;
    }
    // Either remove the text or float it up and fade it.
    preUpdate(time, delta) {
        this.remaining_lifespawn -= delta;
        if (this.remaining_lifespawn < 0) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
            return;
        }
        this.float();
        this.fade();
    }
    float() {
        // Slowly float combat text up over lifespan
        this.y -= this.float_increase;
        this.float_increase += 0.01;
    }
    // Slowly fade the alpha of the text to 0 over the lifespan of the combat text
    fade() {
        const lifetime_used = this.starting_lifespan / this.remaining_lifespawn;
        this.setAlpha(lifetime_used);
    }
}

export { CombatText };
//# sourceMappingURL=combat_text.js.map
