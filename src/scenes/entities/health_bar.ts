

export class HealthBar extends Phaser.GameObjects.Rectangle {
  private current_hp: number;
  private starting_hp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, starting_hp: number) {
    const height = 15;
    super(scene, x, y, width, height, 0x00ff00);
    scene.add.existing(this);
    this.starting_hp = starting_hp
    this.current_hp = this.starting_hp;
  }

  public setCurrentHp(health_points: number) {
    if (health_points !== this.current_hp) {
      this.current_hp = health_points;
  
      const r = this.current_hp / this.starting_hp
      this.width = this.width * r;
    }
  }
}