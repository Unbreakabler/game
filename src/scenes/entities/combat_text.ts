const DEFAULT_STYLE = {
  fontFamily: 'Georgia',
  fontSize: '24px',
  fontStyle: '',
  backgroundColor: '',
  color: '#fff',
  stroke: '#000',
  strokeThickness: 2,
  align: 'center',
  maxLines: 0,
  fixedWidth: 0,
  fixedHeight: 0,
  rtl: false,
}


// TODO(jon): Add more styles for different types of hits
// fire can be red, ice blue, etc
// crits should be larger and "shake" or something for impact

export class CombatText extends Phaser.GameObjects.Text {
  private starting_lifespan: number;
  private remaining_lifespan: number;
  private float_increase: number = 0;

  constructor(scene: Phaser.Scene, 
              x: number, 
              y: number, 
              text: string, 
              style: Phaser.GameObjects.TextStyle = DEFAULT_STYLE as Phaser.GameObjects.TextStyle, 
              lifespan: number = 500
  ) {
    super(scene, x, y, text, style);
    scene.add.existing(this);
    this.starting_lifespan = lifespan;
    this.remaining_lifespan = lifespan;
  }

  // Either remove the text or float it up and fade it.
  public preUpdate(time: number, delta: number) {
    this.remaining_lifespan -= delta;

    if (this.remaining_lifespan < 0) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
      return;
    }
    this.float();
    this.fade();
  }

  private float() {
    // Slowly float combat text up over lifespan
    if (this.remaining_lifespan < (this.starting_lifespan * (4 / 5))) {
      this.y -= this.float_increase
      this.float_increase += 0.01
    }
  }
  
  // Slowly fade the alpha of the text to 0 over the lifespan of the combat text
  private fade() {
    const lifetime_used = this.remaining_lifespan / this.starting_lifespan + 0.5
    this.setAlpha(lifetime_used)
  }

  
}